import { useState } from 'react';
import { FaCalendar, FaClock, FaFileVideo, FaTimes } from 'react-icons/fa';

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Recordings</div>
          <div className="text-2xl font-bold text-gray-900">{recordings.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Views</div>
          <div className="text-2xl font-bold text-primary-600">
            {recordings.reduce((sum, r) => sum + r.views, 0)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Duration</div>
          <div className="text-2xl font-bold text-green-600">24.5 hrs</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Storage Used</div>
          <div className="text-2xl font-bold text-yellow-600">12.8 GB</div>
        </div>
      </div>

      {/* Recordings List */}
      <div className="space-y-4">
        {recordings.map((recording) => (
          <div key={recording.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div
                  className={`${
                    recording.status === 'published' ? 'bg-blue-600' : 'bg-gray-400'
                  } text-white p-4 rounded-lg`}
                >
                  <div className="text-3xl">{recording.status === 'published' ? '▶️' : '⏳'}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{recording.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        recording.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {recording.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{recording.course}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FaCalendar className="mr-2" />
                      {recording.date}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      {recording.duration}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">👁️</span>
                      {recording.views} views
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">💾</span>
                      {recording.size}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                {recording.status === 'published' ? (
                  <>
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">
                      Preview
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      Edit Details
                    </button>
                    <button className="px-4 py-2 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm">
                      Delete
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-gray-600 text-center px-4">
                    <div className="mb-2">Processing...</div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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
