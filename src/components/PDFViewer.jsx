import { useState, useRef, useEffect, useMemo } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaPrint,
  FaSearch,
  FaTimes,
  FaBookmark,
  FaStickyNote,
} from 'react-icons/fa';
import { CiZoomIn, CiZoomOut } from 'react-icons/ci';

const SYNC_INTERVAL_MS = 12000;

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const PDFViewer = ({
  pdfUrl,
  title,
  onComplete,
  isCompleted,
  fileName,
  onClose,
  contentId,
  userId,
  onProgress,
  onSyncProgress,
  onEvent,
  completionThreshold = 1,
  totalPagesHint = 0,
  theme = 'light',
  disableRightClick = true,
  disableDownload = false,
  disablePrint = false,
  watermarkText,
}) => {
  const iframeRef = useRef(null);
  const syncTimerRef = useRef(null);

  const [totalPages, setTotalPages] = useState(totalPagesHint || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [viewedPages, setViewedPages] = useState(new Set([1]));
  const [jumpInput, setJumpInput] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const viewerMode = theme === 'dark' ? 'dark' : 'light';

  const storageKey = useMemo(() => {
    const keyPart = contentId || pdfUrl || 'unknown-pdf';
    const userPart = userId || 'anonymous';
    return `lms:pdf:${userPart}:${keyPart}`;
  }, [contentId, userId, pdfUrl]);

  const emitEvent = (type, payload = {}) => {
    if (!onEvent) return;
    onEvent({
      type,
      contentType: 'pdf',
      contentId: contentId || pdfUrl,
      userId: userId || null,
      timestamp: new Date().toISOString(),
      ...payload,
    });
  };

  const sourceUrl = pdfBlobUrl || pdfUrl;

  const getViewerSrc = () => {
    if (!sourceUrl) return '';
    return `${sourceUrl}#page=${currentPage}&zoom=${zoom}`;
  };

  const viewedCount = viewedPages.size;
  const progress = totalPages > 0 ? Math.min(100, (viewedCount / totalPages) * 100) : currentPage > 1 ? 40 : 0;

  const persistState = (partial = {}) => {
    const current = safeParse(localStorage.getItem(storageKey), {});
    const next = {
      ...current,
      currentPage,
      totalPages,
      zoom,
      timeSpentSeconds,
      viewedPages: Array.from(viewedPages),
      notes,
      bookmarks,
      progress,
      updatedAt: new Date().toISOString(),
      ...partial,
    };
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const buildPayload = () => ({
    currentPage,
    totalPages,
    viewedPages: Array.from(viewedPages).sort((a, b) => a - b),
    viewedPercentage: progress,
    completionStatus: totalPages > 0 ? viewedCount / totalPages >= completionThreshold : progress >= 90,
    timeSpentSeconds,
    lastPosition: { page: currentPage, zoom },
    timestamp: new Date().toISOString(),
  });

  const syncProgress = () => {
    const payload = buildPayload();
    persistState();

    if (onProgress) {
      onProgress(payload);
    }

    if (onSyncProgress) {
      onSyncProgress(payload);
    }
  };

  useEffect(() => {
    if (!pdfUrl) {
      setIsLoading(false);
      setPdfError('No PDF URL provided');
      return;
    }

    let mounted = true;
    let objectUrl = null;

    const loadPdfBlob = async () => {
      setIsLoading(true);
      setPdfError(null);

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const response = await fetch(pdfUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          if (!mounted) return;

          setPdfBlobUrl(objectUrl);
          setIsLoading(false);
          emitEvent('onStart', { source: 'blob', attempt });
          return;
        } catch (error) {
          if (attempt === 3 && mounted) {
            setPdfError('Failed to load PDF file. Open in new tab or download it.');
            setIsLoading(false);
            emitEvent('onError', { message: error?.message || 'pdf-load-failed' });
          }
        }
      }
    };

    const saved = safeParse(localStorage.getItem(storageKey), null);
    if (saved) {
      setCurrentPage(saved.currentPage || 1);
      setZoom(saved.zoom || 100);
      setTotalPages(saved.totalPages || totalPagesHint || 0);
      setViewedPages(new Set(saved.viewedPages || [saved.currentPage || 1]));
      setTimeSpentSeconds(saved.timeSpentSeconds || 0);
      setNotes(saved.notes || []);
      setBookmarks(saved.bookmarks || []);
      setJumpInput(String(saved.currentPage || 1));
    }

    loadPdfBlob();

    return () => {
      mounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pdfUrl, storageKey, totalPagesHint]);

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
  }, [currentPage, totalPages, zoom, viewedCount, notes, bookmarks, timeSpentSeconds]);

  useEffect(() => {
    if (isCompleted) return;

    if (totalPages > 0 && viewedCount / totalPages >= completionThreshold && onComplete) {
      onComplete();
      emitEvent('onComplete', { trigger: 'viewed_all_pages' });
    }
  }, [viewedCount, totalPages, completionThreshold, isCompleted, onComplete]);

  const markPageViewed = (page) => {
    setViewedPages((prev) => {
      const next = new Set(prev);
      next.add(page);
      return next;
    });
  };

  const goToPage = (page) => {
    const maxPage = totalPages || Number.MAX_SAFE_INTEGER;
    const next = Math.max(1, Math.min(maxPage, page));
    setCurrentPage(next);
    setJumpInput(String(next));
    markPageViewed(next);
    emitEvent('onPageChange', { page: next });
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const handleDownload = () => {
    if (disableDownload) return;

    const link = document.createElement('a');
    link.href = sourceUrl;
    link.download = fileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    emitEvent('onDownload', {});
  };

  const handlePrint = () => {
    if (disablePrint) return;

    try {
      iframeRef.current?.contentWindow?.print();
      emitEvent('onPrint', {});
    } catch {
      setPdfError('Print is blocked by browser security for this document source.');
    }
  };

  const handleZoom = (direction) => {
    if (direction === 'in' && zoom < 250) {
      setZoom((prev) => prev + 10);
    } else if (direction === 'out' && zoom > 50) {
      setZoom((prev) => prev - 10);
    }
  };

  const handleClose = () => {
    persistState();
    if (onClose) {
      onClose();
    }
  };

  const openInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const addBookmark = () => {
    const item = {
      id: `${Date.now()}`,
      page: currentPage,
      createdAt: new Date().toISOString(),
    };
    const next = [item, ...bookmarks].slice(0, 40);
    setBookmarks(next);
    persistState({ bookmarks: next });
    emitEvent('onBookmarkAdd', { page: currentPage });
  };

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;

    const item = {
      id: `${Date.now()}`,
      page: currentPage,
      text,
      createdAt: new Date().toISOString(),
    };

    const next = [item, ...notes].slice(0, 50);
    setNotes(next);
    setNoteDraft('');
    persistState({ notes: next });
    emitEvent('onNoteAdd', { page: currentPage, textLength: text.length });
  };

  const handleSearch = () => {
    const text = searchQuery.trim();
    if (!text) return;

    emitEvent('onSearch', { query: text });
    setPdfError('Use browser Find (Ctrl/Cmd + F) inside the opened tab for full-document search.');
  };

  const handleKeyDown = (event) => {
    const tag = event.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    switch (event.key.toLowerCase()) {
      case 'arrowright':
      case 'pagedown':
      case 'j':
        event.preventDefault();
        nextPage();
        break;
      case 'arrowleft':
      case 'pageup':
      case 'k':
        event.preventDefault();
        prevPage();
        break;
      case '+':
      case '=':
        event.preventDefault();
        handleZoom('in');
        break;
      case '-':
      case '_':
        event.preventDefault();
        handleZoom('out');
        break;
      default:
        break;
    }
  };

  const shellClass =
    viewerMode === 'dark'
      ? 'w-full bg-slate-900 text-slate-100 rounded-xl overflow-hidden shadow-lg border border-slate-700'
      : 'w-full bg-slate-100 rounded-xl overflow-hidden shadow-lg border border-slate-200';

  const panelClass = viewerMode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';

  return (
    <div
      className={shellClass}
      onContextMenu={(event) => {
        if (disableRightClick) {
          event.preventDefault();
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="PDF learning viewer"
    >
      <div className={`${panelClass} border-b p-4 flex items-center justify-between flex-wrap gap-4`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-current">{title || 'PDF Document'}</h3>
          {isCompleted && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
              Completed
            </span>
          )}
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {Math.round(progress)}% viewed
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-2 text-slate-700">
            <button
              onClick={prevPage}
              className="p-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all"
              disabled={currentPage <= 1}
              title="Previous page"
            >
              <FaChevronLeft size={14} />
            </button>

            <input
              value={jumpInput}
              onChange={(event) => setJumpInput(event.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => {
                const value = Number.parseInt(jumpInput, 10);
                if (!Number.isNaN(value)) {
                  goToPage(value);
                }
              }}
              className="w-12 px-2 py-1 text-sm rounded border border-slate-300"
              aria-label="Jump to page"
            />
            <span className="text-xs">/ {totalPages > 0 ? totalPages : '?'}</span>

            <button
              onClick={nextPage}
              className="p-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all"
              disabled={totalPages > 0 && currentPage >= totalPages}
              title="Next page"
            >
              <FaChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-2 text-slate-700">
            <button
              onClick={() => handleZoom('out')}
              disabled={zoom <= 50}
              className="p-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all"
              title="Zoom out"
            >
              <CiZoomOut size={16} />
            </button>
            <span className="text-sm font-semibold w-12 text-center">{zoom}%</span>
            <button
              onClick={() => handleZoom('in')}
              disabled={zoom >= 250}
              className="p-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all"
              title="Zoom in"
            >
              <CiZoomIn size={16} />
            </button>
          </div>

          <button
            onClick={addBookmark}
            className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
            title="Bookmark current page"
          >
            <FaBookmark size={14} />
          </button>

          {!disablePrint && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold"
              title="Print document"
            >
              <FaPrint size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>
          )}

          {!disableDownload && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-semibold"
              title="Download PDF"
            >
              <FaDownload size={14} />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}

          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold"
            title="Close PDF"
          >
            <FaTimes size={14} />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      <div className={`${panelClass} border-b p-3 flex items-center gap-2 flex-wrap`}>
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <FaSearch className="text-slate-500" size={14} />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="Search document (opens browser find guidance)"
            className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-2 rounded-md bg-slate-800 text-white text-sm hover:bg-slate-900"
          >
            Find
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <FaStickyNote className="text-slate-500" size={14} />
          <input
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                addNote();
              }
            }}
            placeholder={`Add note for page ${currentPage}`}
            className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm"
          />
          <button
            onClick={addNote}
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>

      <div className="relative w-full bg-slate-200 overflow-auto" style={{ height: 'calc(100vh - 320px)' }}>
        {watermarkText && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
            <span className="rotate-[-20deg] text-slate-700/15 text-xl sm:text-2xl font-bold tracking-wider">
              {watermarkText}
            </span>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600 font-semibold">Loading PDF...</p>
            </div>
          </div>
        )}

        {pdfError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-center max-w-md mx-4">
              <p className="text-red-600 font-semibold mb-3">Cannot Display PDF in Viewer</p>
              <p className="text-red-500 text-sm mb-6">{pdfError}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={openInNewTab}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold"
                >
                  Open in New Tab
                </button>
                {!disableDownload && (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-semibold"
                  >
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={getViewerSrc()}
          className="w-full h-full"
          title="PDF Viewer"
          onLoad={() => {
            setIsLoading(false);
            markPageViewed(currentPage);

            try {
              const pdfViewer = iframeRef.current?.contentWindow?.PDFViewerApplication;
              if (pdfViewer?.pagesCount) {
                setTotalPages(pdfViewer.pagesCount);
              }
            } catch {
              // Cross-origin embedded viewers may block script access.
            }

            emitEvent('onPageChange', { page: currentPage });
            syncProgress();
          }}
          onError={() => {
            setPdfError('Cannot display PDF in embedded viewer due to browser restrictions.');
          }}
        />
      </div>

      <div className={`${panelClass} border-t p-4 flex items-center justify-between flex-wrap gap-4`}>
        <div className="text-sm text-slate-600 flex items-center gap-3">
          <span>{totalPages > 0 ? `Pages: ${viewedCount}/${totalPages}` : `Page ${currentPage}`}</span>
          <span>Time: {Math.floor(timeSpentSeconds / 60)}m</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {bookmarks.slice(0, 6).map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => goToPage(bookmark.page)}
              className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200"
            >
              Page {bookmark.page}
            </button>
          ))}

          <button
            onClick={openInNewTab}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1 hover:bg-blue-50 rounded transition-all"
            title="Open PDF in new tab"
          >
            Open in New Tab
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
