import { useState } from 'react';
import { FaCalendar, FaTimes, FaUsers, FaBullhorn, FaEye } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const TeacherAnnouncements = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const announcements = [
    {
      id: 1,
      title: 'Holiday Notice - Christmas Break',
      message: 'Classes will be suspended from Dec 24-26. Regular schedule resumes on Dec 27.',
      target: 'All Students',
      date: 'Dec 17, 2025',
      status: 'published',
      views: 245,
    },
    {
      id: 2,
      title: 'Important: December Quiz Schedule',
      message: 'Final quiz for Mathematics Chapter 5 will be held on Dec 20. Please complete all practice exercises.',
      target: 'Mathematics Excellence',
      date: 'Dec 15, 2025',
      status: 'published',
      views: 89,
    },
    {
      id: 3,
      title: 'New Study Materials Available',
      message: 'Updated study materials for Sinhala Language have been uploaded to the recordings section.',
      target: 'Sinhala Language',
      date: 'Dec 13, 2025',
      status: 'published',
      views: 72,
    },
    {
      id: 4,
      title: 'January 2026 Schedule Update',
      message: 'Class schedule for January will be shared next week. Stay tuned!',
      target: 'All Students',
      date: 'Dec 17, 2025',
      status: 'draft',
      views: 0,
    },
  ];

  const stats = {
    total_announcements: announcements.length,
    published_count: announcements.filter((a) => a.status === 'published').length,
    total_views: announcements.reduce((sum, a) => sum + a.views, 0),
    this_week: 3,
  };

  // DataTable columns configuration
  const columns = [
    {
      key: 'title',
      label: 'Title',
      searchable: true,
      width: 'w-1/4',
    },
    {
      key: 'message',
      label: 'Message',
      searchable: true,
      width: 'w-1/3',
      render: (value) => (
        <span className="text-gray-700 line-clamp-2">{value}</span>
      ),
    },
    {
      key: 'target',
      label: 'Target Audience',
      searchable: true,
      filterable: true,
      filterOptions: [
        { label: 'All Students', value: 'All Students' },
        { label: 'Mathematics Excellence', value: 'Mathematics Excellence' },
        { label: 'Sinhala Language', value: 'Sinhala Language' },
        { label: 'Complete Scholarship Package', value: 'Complete Scholarship Package' },
        { label: 'Environment Studies', value: 'Environment Studies' },
      ],
      width: 'w-1/5',
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      render: (value) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            value === 'published'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {value.toUpperCase()}
        </span>
      ),
      width: 'w-24',
    },
    {
      key: 'date',
      label: 'Date',
      searchable: true,
      width: 'w-28',
    },
    {
      key: 'views',
      label: 'Views',
      render: (value, row) => (
        <span className={row.status === 'published' ? 'text-gray-700' : 'text-gray-400'}>
          {row.status === 'published' ? value : '-'}
        </span>
      ),
      width: 'w-20',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (value, row) => (
        <div className="flex gap-2 flex-wrap">
          {row.status === 'draft' ? (
            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium">
              Publish
            </button>
          ) : (
            <button className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded font-medium">
              Details
            </button>
          )}
          <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-xs rounded font-medium">
            Edit
          </button>
          <button className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-xs rounded font-medium">
            Delete
          </button>
        </div>
      ),
      width: 'w-40',
    },
  ];

  const tableConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search announcements...',
    emptyMessage: 'No announcements found',
  };

  const metricsConfig = [
    {
      label: 'Total Announcements',
      statsKey: 'total_announcements',
      icon: FaBullhorn,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'all announcements',
    },
    {
      label: 'Published',
      statsKey: 'published_count',
      icon: FaUsers,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'active now',
    },
    {
      label: 'Total Views',
      statsKey: 'total_views',
      icon: FaEye,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'student views',
    },
    {
      label: 'This Week',
      statsKey: 'this_week',
      icon: FaCalendar,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'new posts',
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Send important updates to your students</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary px-6">
          + Create Announcement
        </button>
      </div>

      <StatCard stats={stats} metricsConfig={metricsConfig} />

      {/* Announcements DataTable */}
      <div className="mt-8">
        <DataTable
          data={announcements}
          columns={columns}
          config={tableConfig}
        />
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Announcement</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" className="input-field" placeholder="Enter announcement title" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="5"
                  className="input-field"
                  placeholder="Write your announcement message..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select className="input-field">
                  <option>All Students</option>
                  <option>Complete Scholarship Package</option>
                  <option>Mathematics Excellence</option>
                  <option>Sinhala Language</option>
                  <option>Environment Studies</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className="input-field">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="send-email" className="rounded" />
                <label htmlFor="send-email" className="text-sm text-gray-700">
                  Send email notification to students
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Publish Announcement
                </button>
                <button type="button" className="btn-outline px-6">
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-outline px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAnnouncements;
