import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBookmark, FaCheckCircle, FaMoon, FaSun, FaStickyNote } from 'react-icons/fa';

const SYNC_INTERVAL_MS = 12000;

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || `section-${Date.now()}`;

const buildHtml = (title, rawContent) => {
  const content = rawContent || '';
  const lines = content.split('\n');
  const htmlParts = [];
  let paragraph = [];
  let headingIndex = 0;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    htmlParts.push(`<p>${paragraph.join(' ')}</p>`);
    paragraph = [];
  };

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      headingIndex += 1;
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = `${slugify(text)}-${headingIndex}`;
      const headingLevel = Math.min(4, level + 1);
      htmlParts.push(`<h${headingLevel} id="${id}">${text}</h${headingLevel}>`);
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();

  if (!htmlParts.length) {
    const fallback = content
      .split('\n\n')
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => `<p>${chunk.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    return `<h2 id="intro">${title || 'Reading Material'}</h2>${fallback}`;
  }

  return htmlParts.join('');
};

const extractHeadings = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headingNodes = Array.from(doc.querySelectorAll('h1, h2, h3, h4'));

  return headingNodes.map((node, index) => {
    if (!node.id) {
      node.id = `${slugify(node.textContent)}-${index + 1}`;
    }

    return {
      id: node.id,
      text: node.textContent || `Section ${index + 1}`,
      level: Number(node.tagName.charAt(1)),
    };
  });
};

const TextViewer = ({
  title,
  content,
  html,
  contentId,
  userId,
  onProgress,
  onSyncProgress,
  onComplete,
  isCompleted,
  onEvent,
  completionThreshold = 90,
  initialTheme = 'light',
}) => {
  const scrollRef = useRef(null);
  const articleRef = useRef(null);
  const syncTimerRef = useRef(null);

  const storageKey = useMemo(() => {
    const keyPart = contentId || title || 'unknown-text';
    const userPart = userId || 'anonymous';
    return `lms:text:${userPart}:${keyPart}`;
  }, [contentId, title, userId]);

  const initialSaved = useMemo(() => safeParse(localStorage.getItem(storageKey), null), [storageKey]);

  const [theme, setTheme] = useState(initialSaved?.theme || (initialTheme === 'dark' ? 'dark' : 'light'));
  const [fontSize, setFontSize] = useState(initialSaved?.fontSize || 18);
  const [scrollProgress, setScrollProgress] = useState(initialSaved?.scrollProgress || 0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(initialSaved?.timeSpentSeconds || 0);
  const [activeSection, setActiveSection] = useState(initialSaved?.activeSection || '');
  const [bookmarks, setBookmarks] = useState(initialSaved?.bookmarks || []);
  const [notes, setNotes] = useState(initialSaved?.notes || []);
  const [noteDraft, setNoteDraft] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const normalizedHtml = useMemo(() => {
    if (html?.trim()) {
      return html;
    }
    return buildHtml(title, content || '');
  }, [html, content, title]);

  const headings = useMemo(() => extractHeadings(normalizedHtml), [normalizedHtml]);

  const emitEvent = (type, payload = {}) => {
    if (!onEvent) return;
    onEvent({
      type,
      contentType: 'text',
      contentId: contentId || title,
      userId: userId || null,
      timestamp: new Date().toISOString(),
      ...payload,
    });
  };

  const persistState = (partial = {}) => {
    const current = safeParse(localStorage.getItem(storageKey), {});
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...current,
        scrollProgress,
        timeSpentSeconds,
        fontSize,
        theme,
        activeSection,
        bookmarks,
        notes,
        lastPosition: {
          scrollTop: scrollRef.current?.scrollTop || 0,
          section: activeSection,
        },
        updatedAt: new Date().toISOString(),
        ...partial,
      })
    );
  };

  const buildPayload = () => ({
    progress: scrollProgress,
    lastPosition: {
      scrollTop: scrollRef.current?.scrollTop || 0,
      section: activeSection,
    },
    completionStatus: scrollProgress >= completionThreshold,
    timeSpentSeconds,
    sectionsCompleted: headings
      .filter((heading) => bookmarks.some((bookmark) => bookmark.sectionId === heading.id))
      .map((heading) => heading.id),
    timestamp: new Date().toISOString(),
  });

  const syncProgress = () => {
    const payload = buildPayload();

    if (onProgress) {
      onProgress(payload);
    }

    if (onSyncProgress) {
      onSyncProgress(payload);
    }

    persistState();
  };

  useEffect(() => {
    const scrollTop = initialSaved?.lastPosition?.scrollTop;
    const timer = setTimeout(() => {
      if (scrollTop && scrollRef.current) {
        scrollRef.current.scrollTop = scrollTop;
      }
    }, 50);

    emitEvent('onStart', {});

    return () => clearTimeout(timer);
  }, [initialSaved]);

  useEffect(() => {
    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
    }

    syncTimerRef.current = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + Math.round(SYNC_INTERVAL_MS / 1000));
      syncProgress();
    }, SYNC_INTERVAL_MS);

    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
      persistState();
    };
  }, [scrollProgress, activeSection, bookmarks, notes, fontSize, theme, timeSpentSeconds]);

  useEffect(() => {
    if (!isCompleted && scrollProgress >= completionThreshold && onComplete) {
      onComplete();
      emitEvent('onComplete', { trigger: 'scroll-threshold' });
    }
  }, [scrollProgress, completionThreshold, isCompleted, onComplete]);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const maxScroll = Math.max(1, scrollHeight - clientHeight);
    const nextProgress = Math.min(100, (scrollTop / maxScroll) * 100);
    setScrollProgress(nextProgress);

    const topOffset = scrollTop + 100;
    const sectionNodes = Array.from(articleRef.current?.querySelectorAll('h1, h2, h3, h4') || []);
    const activeNode = sectionNodes.filter((node) => node.offsetTop <= topOffset).at(-1);

    if (activeNode?.id && activeNode.id !== activeSection) {
      setActiveSection(activeNode.id);
      emitEvent('onSectionChange', { sectionId: activeNode.id });
    }

    emitEvent('onScroll', { scrollProgress: nextProgress });
  };

  const jumpToSection = (sectionId) => {
    const node = articleRef.current?.querySelector(`#${sectionId}`);
    if (!node || !scrollRef.current) return;

    scrollRef.current.scrollTo({ top: node.offsetTop - 40, behavior: 'smooth' });
    setActiveSection(sectionId);
    emitEvent('onSectionJump', { sectionId });
  };

  const addBookmark = () => {
    if (!activeSection) return;

    const heading = headings.find((item) => item.id === activeSection);
    const item = {
      id: `${Date.now()}`,
      sectionId: activeSection,
      label: heading?.text || activeSection,
      createdAt: new Date().toISOString(),
    };

    const next = [item, ...bookmarks.filter((bookmark) => bookmark.sectionId !== activeSection)].slice(0, 30);
    setBookmarks(next);
    persistState({ bookmarks: next });
    emitEvent('onBookmarkAdd', { sectionId: activeSection });
  };

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;

    const item = {
      id: `${Date.now()}`,
      sectionId: activeSection,
      sectionLabel: headings.find((heading) => heading.id === activeSection)?.text || 'General',
      text,
      selectedText,
      createdAt: new Date().toISOString(),
    };

    const next = [item, ...notes].slice(0, 80);
    setNotes(next);
    setNoteDraft('');
    setSelectedText('');
    persistState({ notes: next });
    emitEvent('onNoteAdd', { sectionId: activeSection, textLength: text.length });
  };

  const captureSelection = () => {
    const selection = window.getSelection()?.toString().trim() || '';
    if (selection) {
      setSelectedText(selection.slice(0, 280));
      emitEvent('onHighlight', { length: selection.length });
    }
  };

  const handleKeyDown = (event) => {
    const tag = event.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (!scrollRef.current) return;

    switch (event.key.toLowerCase()) {
      case 'j':
      case 'arrowdown':
        event.preventDefault();
        scrollRef.current.scrollBy({ top: 120, behavior: 'smooth' });
        break;
      case 'k':
      case 'arrowup':
        event.preventDefault();
        scrollRef.current.scrollBy({ top: -120, behavior: 'smooth' });
        break;
      case '+':
      case '=':
        event.preventDefault();
        setFontSize((prev) => Math.min(24, prev + 1));
        break;
      case '-':
      case '_':
        event.preventDefault();
        setFontSize((prev) => Math.max(14, prev - 1));
        break;
      case 'd':
        event.preventDefault();
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
        break;
      default:
        break;
    }
  };

  const shellClass =
    theme === 'dark'
      ? 'w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 shadow-lg'
      : 'w-full rounded-xl overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-lg';

  const articleClass =
    theme === 'dark'
      ? 'prose prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-300'
      : 'prose max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700';

  return (
    <div className={shellClass} onKeyDown={handleKeyDown} tabIndex={0} role="region" aria-label="Text learning viewer">
      <div className="relative h-1 bg-slate-200">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="border-b border-inherit px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base sm:text-lg">{title || 'Reading Material'}</h3>
          {isCompleted && <FaCheckCircle className="text-green-500" />}
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
            {Math.round(scrollProgress)}%
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFontSize((prev) => Math.max(14, prev - 1))}
            className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm"
            title="Decrease font"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((prev) => Math.min(24, prev + 1))}
            className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm"
            title="Increase font"
          >
            A+
          </button>
          <button
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className="p-2 rounded-md bg-slate-100 text-slate-700"
            title="Toggle theme"
          >
            {theme === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
          </button>
          <button
            onClick={addBookmark}
            className="p-2 rounded-md bg-amber-100 text-amber-700"
            title="Bookmark current section"
          >
            <FaBookmark size={14} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr_280px] gap-0" style={{ height: 'calc(100vh - 280px)' }}>
        <aside className="border-r border-inherit p-4 overflow-auto hidden lg:block">
          <p className="text-xs uppercase tracking-wide mb-3 opacity-70">Contents</p>
          <div className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => jumpToSection(heading.id)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                  activeSection === heading.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-slate-100'
                }`}
                style={{ paddingLeft: `${heading.level * 8}px` }}
              >
                {heading.text}
              </button>
            ))}
          </div>
        </aside>

        <div ref={scrollRef} className="overflow-auto p-6 sm:p-8" onScroll={handleScroll} onMouseUp={captureSelection}>
          <article
            ref={articleRef}
            className={articleClass}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: normalizedHtml }}
          />
        </div>

        <aside className="border-l border-inherit p-4 overflow-auto">
          <p className="text-xs uppercase tracking-wide mb-3 opacity-70">Notes</p>
          {selectedText && (
            <div className="mb-3 p-2 rounded bg-cyan-50 text-cyan-800 text-xs">"{selectedText}"</div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <FaStickyNote className="opacity-60" size={14} />
            <input
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  addNote();
                }
              }}
              placeholder="Add inline note"
              className="w-full px-3 py-2 rounded border border-slate-300 text-sm text-slate-900"
            />
          </div>
          <button
            onClick={addNote}
            className="w-full mb-4 px-3 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Save Note
          </button>

          <div className="space-y-2">
            {notes.slice(0, 12).map((note) => (
              <button
                key={note.id}
                onClick={() => jumpToSection(note.sectionId)}
                className="w-full text-left p-2 rounded bg-slate-100 hover:bg-slate-200"
              >
                <p className="text-xs font-semibold text-slate-700">{note.sectionLabel}</p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{note.text}</p>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className="border-t border-inherit px-4 py-3 flex items-center justify-between text-xs sm:text-sm">
        <div>Time spent: {Math.floor(timeSpentSeconds / 60)}m</div>
        <div className="flex items-center gap-2 flex-wrap">
          {bookmarks.slice(0, 4).map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => jumpToSection(bookmark.sectionId)}
              className="px-2 py-1 rounded bg-amber-100 text-amber-700"
            >
              {bookmark.label.slice(0, 20)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextViewer;
