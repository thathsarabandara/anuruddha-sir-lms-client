import { useState } from 'react';
import { FaCalendar, FaTimes, FaUsers } from 'react-icons/fa';

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Announcements</div>
          <div className="text-2xl font-bold text-gray-900">{announcements.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {announcements.filter((a) => a.status === 'published').length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Views</div>
          <div className="text-2xl font-bold text-primary-600">
            {announcements.reduce((sum, a) => sum + a.views, 0)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">This Week</div>
          <div className="text-2xl font-bold text-gray-900">3</div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div
                  className={`${
                    announcement.status === 'published' ? 'bg-blue-600' : 'bg-gray-400'
                  } text-white p-3 rounded-lg`}
                >
                  <div className="text-2xl">📢</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        announcement.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {announcement.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{announcement.message}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      {announcement.target}
                    </div>
                    <div className="flex items-center">
                      <FaCalendar className="mr-1" />
                      {announcement.date}
                    </div>
                    {announcement.status === 'published' && (
                      <div className="flex items-center">
                        <span className="mr-1">👁️</span>
                        {announcement.views} views
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                {announcement.status === 'draft' ? (
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
                    Publish
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">
                    View Details
                  </button>
                )}
                <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  Edit
                </button>
                <button className="px-4 py-2 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
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
