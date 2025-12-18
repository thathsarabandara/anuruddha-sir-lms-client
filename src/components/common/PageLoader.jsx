import React from 'react';

const PageLoader = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Blue minimalist spinner (CSS-based, react-loading 'spin' style) */}
        <div role="status" aria-live="polite" className="flex items-center">
          <div className="loader" aria-hidden="true"></div>
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-medium">Loading…</p>
          <p className="text-sm text-gray-500">Preparing your learning experience</p>
        </div>
      </div>
      <style>{`
        @keyframes rl-spin { to { transform: rotate(360deg); } }
        .loader {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 6px solid rgba(37,99,235,0.12); /* light blue track */
          border-top-color: #2563eb; /* blue accent */
          animation: rl-spin 0.9s linear infinite;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
