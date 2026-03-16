import { useState } from 'react';
import { FaCalendar, FaClock, FaFileVideo, FaTimes, FaDatabase, FaEye } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const TeacherRecordings = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const recordings = [
    {
      id: 1,
      title: 'Mathematics - Chapter 5: Fractions',
      course: 'Mathematics Excellence',
      date: 'Dec 15, 2025',
      duration: '1:28:45',
      views: 156,
      size: '2.4 GB',
      status: 'published',
    },
    {
      id: 2,
      title: 'Sinhala - Essay Writing Techniques',
      course: 'Sinhala Language',
      date: 'Dec 13, 2025',
      duration: '1:15:30',
      views: 142,
      size: '1.9 GB',
      status: 'published',
    },
    {
      id: 3,
      title: 'Mathematics - Chapter 4: Multiplication',
      course: 'Mathematics Excellence',
      date: 'Dec 11, 2025',
      duration: '1:35:20',
      views: 178,
      size: '2.8 GB',
      status: 'published',
    },
    {
      id: 4,
      title: 'Environment Studies - Ecosystem',
      course: 'Complete Scholarship Package',
      date: 'Dec 10, 2025',
      duration: '0:00:00',
      views: 0,
      size: '0 GB',
      status: 'processing',
    },
  ];

  const stats = {
    total_recordings: recordings.length,
    total_views: recordings.reduce((sum, r) => sum + r.views, 0),
    total_duration: 24.5,
    storage_used: 12.8,
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
      key: 'course',
      label: 'Course',
      searchable: true,
      filterable: true,
      filterOptions: [
        { label: 'Mathematics Excellence', value: 'Mathematics Excellence' },
        { label: 'Sinhala Language', value: 'Sinhala Language' },
        { label: 'Complete Scholarship Package', value: 'Complete Scholarship Package' },
      ],
      width: 'w-1/5',
    },
    {
      key: 'date',
      label: 'Date',
      searchable: true,
      width: 'w-24',
    },
    {
      key: 'duration',
      label: 'Duration',
      width: 'w-24',
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
      key: 'size',
      label: 'Size',
      width: 'w-20',
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Published', value: 'published' },
        { label: 'Processing', value: 'processing' },
      ],
      render: (value) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            value === 'published'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {value.toUpperCase()}
        </span>
      ),
      width: 'w-28',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (value, row) => (
        <div className="flex gap-2 flex-wrap">
          {row.status === 'published' ? (
            <>
              <button className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded font-medium">
                Preview
              </button>
              <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-xs rounded font-medium">
                Edit
              </button>
              <button className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-xs rounded font-medium">
                Delete
              </button>
            </>
          ) : (
            <div className="text-xs text-gray-600 font-medium">Processing...</div>
          )}
        </div>
      ),
      width: 'w-48',
    },
  ];

  const tableConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search recordings...',
    emptyMessage: 'No recordings found',
  };

  const metricsConfig = [
    {
      label: 'Total Recordings',
      statsKey: 'total_recordings',
      icon: FaFileVideo,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'all recordings',
    },
    {
      label: 'Total Views',
      statsKey: 'total_views',
      icon: FaEye,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'across all videos',
    },
    {
      label: 'Total Duration',
      statsKey: 'total_duration',
      icon: FaClock,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'hours of content',
      formatter: (value) => `${value} hrs`,
    },
    {
      label: 'Storage Used',
      statsKey: 'storage_used',
      icon: FaDatabase,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'storage capacity',
      formatter: (value) => `${value} GB`,
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Recordings</h1>
          <p className="text-gray-600">Manage and upload class recordings</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn-primary px-6">
          + Upload Recording
        </button>
      </div>

      <StatCard stats={stats} metricsConfig={metricsConfig} />

      {/* Recordings DataTable */}
      <div className="mt-8">
        <DataTable
          data={recordings}
          columns={columns}
          config={tableConfig}
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload Class Recording</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recording Title</label>
                <input type="text" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select className="input-field">
                  <option>Mathematics Excellence</option>
                  <option>Sinhala Language</option>
                  <option>Complete Scholarship Package</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows="3" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                  <FaFileVideo className="text-4xl mb-2" />
                  <p className="text-gray-600 mb-2">Drag and drop video file here, or click to browse</p>
                  <p className="text-sm text-gray-500">Supports MP4, AVI, MOV (Max 5GB)</p>
                  <input type="file" accept="video/*" className="hidden" />
                  <button type="button" className="mt-3 btn-outline text-sm py-2 px-4">
                    Select File
                  </button>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Upload Recording
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 btn-outline"
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

export default TeacherRecordings;
