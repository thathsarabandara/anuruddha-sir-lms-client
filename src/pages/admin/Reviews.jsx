import React, { useState } from 'react';
import { FaCheckCircle, FaTimes, FaFilter, FaRefresh, FaSync } from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import ReviewsList from '../../components/common/ReviewsList';


const AdminReviewModeration = () => {
  const [notification, setNotification] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const [filterApproved, setFilterApproved] = useState(null);
  const [courseFilter, setCourseFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // TODO: Add API call to refresh reviews
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRefreshKey(prev => prev + 1);
      showNotification('Reviews refreshed successfully', 'success');
    } catch (error) {
      showNotification('Failed to refresh reviews: ' + error.message, 'error');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm">
          <Notification 
            {...notification} 
            onClose={() => setNotification(null)} 
          />
        </div>
      )}
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

            <ButtonWithLoader
              label="Refresh"
              loadingLabel="Refreshing..."
              isLoading={refreshing}
              onClick={handleRefresh}
              icon={<FaSync />}
              variant="primary"
            />
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
