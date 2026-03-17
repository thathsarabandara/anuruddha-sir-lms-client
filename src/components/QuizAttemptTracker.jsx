import { useState } from 'react';
import {
  FaHistory,
  FaTrophy,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaClock,
  FaPercent,
  FaArrowRight
} from 'react-icons/fa';

const QuizAttemptTracker = ({ 
  quizTitle, 
  maxAttempts, 
  attempts = [], 
  remainingAttempts,
  onAttemptClick,
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAttempt, setExpandedAttempt] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (attempt) => {
    if (!attempt.is_submitted) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
          <FaClock size={12} /> In Progress
        </span>
      );
    }

    if (attempt.is_passed) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          <FaCheckCircle size={12} /> Passed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
        <FaTimesCircle size={12} /> Failed
      </span>
    );
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const bestAttempt = attempts.length > 0
    ? attempts.reduce((best, current) => 
        (current.percentage || 0) > (best.percentage || 0) ? current : best
      )
    : null;

  const averageScore = attempts.length > 0
    ? (attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.length).toFixed(2)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 text-white rounded-lg">
              <FaHistory size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{quizTitle}</h3>
              <p className="text-sm text-slate-600">Attempt History & Performance</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{attempts.length}</p>
            <p className="text-sm text-slate-600">Total Attempts</p>
          </div>
        </div>

        {/* Quick Stats */}
        {attempts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-slate-600 font-semibold">Best Score</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(bestAttempt?.percentage || 0)}`}>
                {(bestAttempt?.percentage || 0).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-slate-600 font-semibold">Average Score</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(averageScore)}`}>
                {parseFloat(averageScore).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-slate-600 font-semibold">Passed Attempts</p>
              <p className="text-2xl font-bold text-green-600">
                {attempts.filter(a => a.is_passed).length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-slate-600 font-semibold">Remaining</p>
              <p className="text-2xl font-bold text-orange-600">
                {maxAttempts ? maxAttempts - attempts.length : '∞'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 font-semibold transition-all text-center ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-4 font-semibold transition-all text-center ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Attempt History
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin">
              <FaClock className="text-4xl text-blue-600" />
            </div>
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-12">
            <FaTrophy className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold mb-2">No Attempts Yet</p>
            <p className="text-sm text-slate-500">Start your first attempt to begin tracking your progress</p>
            {onAttemptClick && (
              <button
                onClick={() => onAttemptClick('start')}
                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto"
              >
                Start Quiz <FaArrowRight size={14} />
              </button>
            )}
          </div>
        ) : activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Remaining Attempts */}
            {maxAttempts && remainingAttempts !== undefined && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Remaining Attempts</p>
                    <p className="text-3xl font-bold text-blue-600">{remainingAttempts}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{maxAttempts}</p>
                    <p className="text-xs text-slate-600">Maximum Attempts</p>
                  </div>
                </div>

                {/* Attempt Progress */}
                <div className="mt-4 bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{
                          width: `${((maxAttempts - remainingAttempts) / maxAttempts) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {maxAttempts - remainingAttempts} of {maxAttempts}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Latest Attempt Summary */}
            {attempts.length > 0 && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FaCalendarAlt size={16} className="text-blue-600" />
                  Latest Attempt
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Attempt #{attempts[0].attempt_number}</span>
                    {getStatusBadge(attempts[0])}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Score</span>
                    <span className={`text-xl font-bold ${getPerformanceColor(attempts[0].percentage || 0)}`}>
                      {(attempts[0].percentage || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Completed</span>
                    <span>{formatDate(attempts[0].submitted_at || attempts[0].started_at)}</span>
                  </div>
                  {onAttemptClick && attempts[0].is_submitted && (
                    <button
                      onClick={() => onAttemptClick('review', attempts[0])}
                      className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                    >
                      Review Attempt
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Start New Attempt Button */}
            {onAttemptClick && (!maxAttempts || remainingAttempts > 0) && (
              <button
                onClick={() => onAttemptClick('start')}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all shadow-md"
              >
                Start New Attempt
              </button>
            )}
          </div>
        ) : (
          /* Attempt History */
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  expandedAttempt === attempt.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setExpandedAttempt(expandedAttempt === attempt.id ? null : attempt.id)}
              >
                {/* Attempt Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900">#{attempt.attempt_number}</p>
                      <p className="text-xs text-slate-500">Attempt</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDate(attempt.submitted_at || attempt.started_at)}
                      </p>
                      <p className="text-xs text-slate-600">
                        {formatDuration(Math.round((new Date(attempt.submitted_at || new Date()) - new Date(attempt.started_at)) / 60000))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getPerformanceColor(attempt.percentage || 0)}`}>
                        {(attempt.percentage || 0).toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-600">
                        {attempt.score || 0} / {attempt.total_marks || 100}
                      </p>
                    </div>
                    {getStatusBadge(attempt)}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedAttempt === attempt.id && (
                  <div className="border-t border-slate-200 pt-4 mt-4 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">Status</p>
                        {getStatusBadge(attempt)}
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">Duration</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {Math.round((new Date(attempt.submitted_at || new Date()) - new Date(attempt.started_at)) / 60000)} min
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">Passing Score</p>
                        <p className="text-sm font-semibold text-slate-900">{attempt.passing_score || 50}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">Grading</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {attempt.is_graded ? 'Graded' : 'Auto-graded'}
                        </p>
                      </div>
                    </div>

                    {attempt.is_submitted && onAttemptClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAttemptClick('review', attempt);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all text-sm"
                      >
                        View Detailed Results
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptTracker;
