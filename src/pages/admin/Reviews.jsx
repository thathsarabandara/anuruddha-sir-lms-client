import React, { useState } from 'react';
import { FaCheckCircle, FaTimes, FaFilter, FaRefresh } from 'react-icons/fa';
import ReviewsList from '../../components/common/ReviewsList';


const AdminReviewModeration = () => {
  const [filterApproved, setFilterApproved] = useState(null);
  const [courseFilter, setCourseFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Moderation</h1>
          <p className="text-gray-600">Manage and moderate course reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="text-4xl text-blue-500 opacity-20">
                <FaFilter />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">0</p>
              </div>
              <div className="text-4xl text-green-500 opacity-20">
                <FaCheckCircle />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
              </div>
              <div className="text-4xl text-orange-500 opacity-20">
                <FaTimes />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterApproved === null ? 'all' : filterApproved ? 'approved' : 'pending'}
                onChange={(e) => {
                  if (e.target.value === 'all') setFilterApproved(null);
                  else if (e.target.value === 'approved') setFilterApproved(true);
                  else setFilterApproved(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reviews</option>
                <option value="approved">Approved Reviews</option>
                <option value="pending">Pending Reviews</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Course ID
              </label>
              <input
                type="text"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                placeholder="Enter course ID (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
            >
              <FaRefresh /> Refresh
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-md p-6" key={refreshKey}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Review Submissions</h2>
          <ReviewsList courseId={null} isAdmin={true} />
        </div>
      </div>
    </div>
  );
};

export default AdminReviewModeration;
