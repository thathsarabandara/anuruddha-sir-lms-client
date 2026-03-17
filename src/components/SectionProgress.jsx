import {
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaPlayCircle,
  FaLock,
  FaFileAlt,
  FaQuestionCircle,
  FaBook,
  FaVideo,
  FaExternalLinkAlt,
  FaFileDownload
} from 'react-icons/fa';

const SectionProgress = ({
  sections,
  currentLessonId,
  completedLessons,
  expandedSections,
  onToggleSection,
  onLessonClick,
  sidebarOpen
}) => {
  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'VIDEO':
        return <FaVideo className="text-purple-500" />;
      case 'PDF':
        return <FaFileDownload className="text-red-500" />;
      case 'TEXT':
        return <FaBook className="text-blue-500" />;
      case 'LINK':
        return <FaExternalLinkAlt className="text-green-500" />;
      case 'QUIZ':
        return <FaQuestionCircle className="text-orange-500" />;
      default:
        return <FaFileAlt className="text-slate-500" />;
    }
  };

  const getContentTypeLabel = (contentType) => {
    return contentType ? contentType.charAt(0) + contentType.slice(1).toLowerCase() : 'Content';
  };

  const calculateSectionProgress = (section) => {
    if (section.lessons.length === 0) return 0;
    const completedCount = section.lessons.filter(lesson =>
      completedLessons.has(lesson.id)
    ).length;
    return Math.round((completedCount / section.lessons.length) * 100);
  };

  return (
    <>
      {!sidebarOpen && (
        <div className="hidden lg:block lg:col-span-1 sticky top-32 max-h-[calc(100vh-150px)]">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Course Content
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                {completedLessons.size} of{' '}
                {sections.reduce((sum, s) => sum + s.lessons.length, 0)} lessons
              </p>
              {/* Overall Progress Bar */}
              <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                  style={{
                    width: `${
                      sections.length > 0
                        ? Math.round(
                          (completedLessons.size /
                            sections.reduce((sum, s) => sum + s.lessons.length, 0)) *
                          100
                        )
                        : 0
                    }%`
                  }}
                ></div>
              </div>
            </div>

            {/* Sections List */}
            <div className="overflow-y-auto flex-1">
              <div className="divide-y divide-slate-200">
                {sections.map((section) => {
                  const sectionProgress = calculateSectionProgress(section);
                  const isExpanded = expandedSections.has(section.id);

                  return (
                    <div key={section.id} className="border-b border-slate-100 last:border-b-0">
                      {/* Section Header */}
                      <button
                        onClick={() => onToggleSection(section.id)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-all text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-slate-900 text-xs block truncate group-hover:text-blue-600 transition-all">
                            {section.title}
                          </span>
                          <span className="text-xs text-slate-600 mt-1 block">
                            {section.lessons.filter(l => completedLessons.has(l.id)).length} / {section.lessons.length}
                          </span>
                          {/* Section Progress Bar */}
                          <div className="mt-2 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all"
                              style={{ width: `${sectionProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-2 text-slate-400 flex-shrink-0">
                          {isExpanded ? (
                            <FaChevronUp className="text-xs" />
                          ) : (
                            <FaChevronDown className="text-xs" />
                          )}
                        </div>
                      </button>

                      {/* Lessons List */}
                      {isExpanded && (
                        <div className="bg-slate-50">
                          {section.lessons.map((lesson) => {
                            const isCompleted = completedLessons.has(lesson.id);
                            const isCurrent = currentLessonId === lesson.id;

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => onLessonClick(lesson)}
                                disabled={lesson.is_locked}
                                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 border-l-4 text-xs transition-all group ${
                                  isCurrent
                                    ? 'border-l-blue-600 bg-blue-100 hover:bg-blue-150 text-blue-900'
                                    : 'border-l-transparent hover:bg-slate-100'
                                } ${lesson.is_locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <FaCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                                  ) : lesson.is_locked ? (
                                    <FaLock className="text-slate-400 text-xs flex-shrink-0" />
                                  ) : (
                                    <FaPlayCircle className="text-blue-500 text-sm flex-shrink-0" />
                                  )}
                                </div>

                                {/* Lesson Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="truncate font-medium text-slate-900 group-hover:text-blue-600">
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-slate-500">
                                      {getContentTypeLabel(lesson.type)}
                                    </span>
                                    {lesson.duration && (
                                      <span className="text-xs text-slate-500">
                                        • {lesson.duration}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Content Type Badge */}
                                <div className="flex-shrink-0 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                  {getContentTypeIcon(lesson.type)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-600 text-center font-semibold">
                ✓ Complete all lessons to finish
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionProgress;
