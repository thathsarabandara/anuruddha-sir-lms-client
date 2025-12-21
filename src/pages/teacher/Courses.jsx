import { useState } from 'react';
import { FaChartBar, FaTimes } from 'react-icons/fa';

const TeacherCourses = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Mathematics',
    description: '',
    price: '',
    duration: '3',
    lessons: '',
    schedule: '',
  });

  const courses = [
    {
      id: 1,
      title: 'Complete Scholarship Package',
      subject: 'All Subjects',
      students: 156,
      price: 25000,
      duration: '6 Months',
      lessons: 48,
      status: 'active',
      revenue: 3900000,
      color: 'bg-blue-600',
    },
    {
      id: 2,
      title: 'Mathematics Excellence',
      subject: 'Mathematics',
      students: 89,
      price: 8000,
      duration: '3 Months',
      lessons: 24,
      status: 'active',
      revenue: 712000,
      color: 'bg-green-600',
    },
    {
      id: 3,
      title: 'Sinhala Language',
      subject: 'Sinhala',
      students: 72,
      price: 8000,
      duration: '3 Months',
      lessons: 24,
      status: 'active',
      revenue: 576000,
      color: 'bg-purple-600',
    },
    {
      id: 4,
      title: 'Environment Studies',
      subject: 'Environment',
      students: 45,
      price: 8000,
      duration: '3 Months',
      lessons: 24,
      status: 'draft',
      revenue: 0,
      color: 'bg-yellow-600',
    },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    // API call to create course
    setShowCreateModal(false);
    setFormData({
      title: '',
      subject: 'Mathematics',
      description: '',
      price: '',
      duration: '3',
      lessons: '',
      schedule: '',
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Create and manage your courses</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary px-6">
          + Create New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Courses</div>
          <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Active Courses</div>
          <div className="text-2xl font-bold text-green-600">
            {courses.filter((c) => c.status === 'active').length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Students</div>
          <div className="text-2xl font-bold text-primary-600">
            {courses.reduce((sum, c) => sum + c.students, 0)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-yellow-600">
            Rs. {(courses.reduce((sum, c) => sum + c.revenue, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <div className={`${course.color} text-white p-4 -m-6 mb-4 rounded-t-xl`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold">{course.title}</h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    course.status === 'active'
                      ? 'bg-green-400 text-green-900'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {course.status.toUpperCase()}
                </span>
              </div>
              <p className="text-white/90 text-sm">{course.subject}</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-600">Students</div>
                  <div className="font-bold text-gray-900">{course.students}</div>
                </div>
                <div>
                  <div className="text-gray-600">Price</div>
                  <div className="font-bold text-gray-900">Rs. {course.price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Duration</div>
                  <div className="font-medium text-gray-900">{course.duration}</div>
                </div>
                <div>
                  <div className="text-gray-600">Lessons</div>
                  <div className="font-medium text-gray-900">{course.lessons}</div>
                </div>
              </div>

              {course.revenue > 0 && (
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600">Revenue Generated</div>
                  <div className="text-xl font-bold text-green-600">
                    Rs. {course.revenue.toLocaleString()}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button className="flex-1 btn-primary text-sm py-2">Edit</button>
                <button className="flex-1 btn-outline text-sm py-2">View</button>
                <button className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                  📊
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleInputChange} className="input-field">
                  <option value="Mathematics">Mathematics</option>
                  <option value="Sinhala">Sinhala Language</option>
                  <option value="Environment">Environment Studies</option>
                  <option value="English">English Language</option>
                  <option value="All Subjects">All Subjects</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Lessons</label>
                  <input
                    type="number"
                    name="lessons"
                    value={formData.lessons}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon & Wed 4PM"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Create Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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

export default TeacherCourses;
