import React from 'react';

/**
 * StatCard Component
 * Displays customizable metrics for dashboard
 * 
 * @param {Object} stats - Statistics object with values to display
 * @param {Array} metricsConfig - Configuration array for metrics to display
 *   Each metric object should have:
 *   - label: Display label
 *   - statsKey: Key to access value from stats object
 *   - icon: Icon component (class)
 *   - bgColor: Background color class (e.g., 'bg-blue-100')
 *   - textColor: Text color class (e.g., 'text-blue-600')
 *   - description: Short description text
 *   - formatter: (Optional) Function to format the value before display
 * @param {boolean} loading - Optional loading state
 * 
 * @example
 * const metricsConfig = [
 *   {
 *     label: 'Monthly Revenue',
 *     statsKey: 'monthly_revenue',
 *     icon: FaDollarSign,
 *     bgColor: 'bg-yellow-100',
 *     textColor: 'text-yellow-600',
 *     description: 'total revenue',
 *     formatter: (value) => `$${value.toLocaleString()}`,
 *   },
 * ];
 * <StatCard stats={stats} metricsConfig={metricsConfig} />
 */
const StatCard = ({ stats, metricsConfig = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="card">
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

  if (!stats || metricsConfig.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center text-gray-500">No statistics available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricsConfig.map((metric, idx) => {
        const IconComponent = metric.icon;
        const value = stats[metric.statsKey] || 0;
        const displayValue = metric.formatter ? metric.formatter(value) : value;
        return (
          <div key={idx} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900">{displayValue}</p>
                <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
              </div>
              <div className={`${metric.bgColor} ${metric.textColor} p-3 rounded-lg text-2xl flex-shrink-0`}>
                <IconComponent />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCard;
