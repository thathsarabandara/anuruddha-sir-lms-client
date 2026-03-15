import React from 'react';
import { FaUsers, FaAward, FaCheckCircle, FaClock } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';

/**
 * QuizStatsCard Component
 * Displays 4 key quiz performance metrics: Total Attempts, Average Score, Pass Rate, and Average Time
 * 
 * @param {Object} stats - Statistics object from the backend
 * @param {number} stats.total_attempts - Total number of quiz attempts
 * @param {number} stats.average_score - Average percentage score (0-100)
 * @param {number} stats.pass_rate - Percentage of students who passed (0-100)
 * @param {number} stats.average_time_minutes - Average time spent on quiz in minutes
 * @param {boolean} loading - Optional loading state
 */
const QuizStatsCard = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-3 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse ml-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
          No statistics available
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Attempts',
      value: stats.total_attempts || 0,
      unit: '',
      icon: FaUsers,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      tooltip: 'Number of students who attempted this quiz'
    },
    {
      label: 'Average Score',
      value: stats.average_score !== undefined ? `${stats.average_score}` : 0,
      unit: '%',
      icon: FaAward,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      tooltip: 'Average percentage score across all attempts'
    },
    {
      label: 'Pass Rate',
      value: stats.pass_rate !== undefined ? `${stats.pass_rate}` : 0,
      unit: '%',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      tooltip: 'Percentage of students who passed'
    },
    {
      label: 'Average Time',
      value: stats.average_time_minutes !== undefined ? `${stats.average_time_minutes}` : 0,
      unit: ' min',
      icon: FaClock,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      tooltip: 'Average time spent on quiz in minutes'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            title={metric.tooltip}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  {metric.unit && <span className="text-sm text-gray-600">{metric.unit}</span>}
                </div>
                <p className="text-xs text-gray-500 mt-2">{metric.tooltip}</p>
              </div>
              <div className={`${metric.bgColor} ${metric.textColor} p-3 rounded-lg text-xl flex-shrink-0`}>
                <IconComponent />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizStatsCard;
