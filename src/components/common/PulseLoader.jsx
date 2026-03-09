import React from 'react';

const PulseLoader = ({ variant = 'default' }) => {
  const pulseStyles = `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    .pulse-animate {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `;

  // Table/List variant
  if (variant === 'table' || variant === 'default') {
    return (
      <div className="p-8">
        <style>{pulseStyles}</style>

        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-10 w-48 bg-gray-200 rounded-lg pulse-animate mb-3"></div>
              <div className="h-4 w-64 bg-gray-200 rounded pulse-animate"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg pulse-animate ml-4"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded pulse-animate mb-3"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded-lg pulse-animate"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg pulse-animate ml-4"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Search/Filter Bar */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg pulse-animate"></div>
            <div className="w-40 h-10 bg-gray-200 rounded-lg pulse-animate"></div>
          </div>

          {/* Table Header */}
          <div className="mb-4 border-b border-gray-200 pb-4">
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded pulse-animate"></div>
              ))}
            </div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-5 gap-4 py-4 border-b border-gray-100"
                style={{ animationDelay: `${rowIdx * 0.05}s` }}
              >
                {[...Array(5)].map((_, colIdx) => (
                  <div key={colIdx} className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded pulse-animate"></div>
                    <div className="h-3 w-5/6 bg-gray-200 rounded pulse-animate"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Card grid variant
  if (variant === 'grid') {
    return (
      <div className="p-8">
        <style>{pulseStyles}</style>

        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded-lg pulse-animate mb-3"></div>
          <div className="h-4 w-64 bg-gray-200 rounded pulse-animate"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 pulse-animate" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-48 w-full bg-gray-200 pulse-animate"></div>
              <div className="p-6">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-3 pulse-animate"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2 pulse-animate"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded pulse-animate"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Minimal variant for small loaders
  if (variant === 'minimal') {
    return (
      <div className="p-8">
        <style>{pulseStyles}</style>
        <div className="h-8 w-32 bg-gray-200 rounded-lg pulse-animate mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded pulse-animate"></div>
      </div>
    );
  }

  // Default
  return (
    <div className="p-8">
      <style>{pulseStyles}</style>
      <div className="h-10 w-48 bg-gray-200 rounded-lg pulse-animate mb-3"></div>
      <div className="h-4 w-64 bg-gray-200 rounded pulse-animate"></div>
    </div>
  );
};

export default PulseLoader;
