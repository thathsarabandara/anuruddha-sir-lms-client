import { useState } from 'react';
import {  FaBook, FaCheck, FaCheckCircle, FaExclamationTriangle, FaGraduationCap, FaTimes } from 'react-icons/fa';

const AdminTeachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const teachers = [
    {
      id: 1,
      name: 'Anuruddha Sir',
      email: 'anuruddha@email.com',
      phone: '+94 77 123 4567',
      subjects: ['Mathematics', 'Sinhala', 'Environment'],
      experience: '15 years',
      qualification: 'B.Ed. (Hons) Mathematics',
      status: 'approved',
      totalStudents: 245,
      totalCourses: 8,
      revenue: 'Rs. 2.4M',
      rating: 4.9,
      joinDate: 'Jan 10, 2024',
    },
    {
      id: 2,
      name: 'Saman Fernando',
      email: 'saman@email.com',
      phone: '+94 71 234 5678',
      subjects: ['English', 'Science'],
      experience: '10 years',
      qualification: 'B.A. English Literature',
      status: 'approved',
      totalStudents: 187,
      totalCourses: 6,
      revenue: 'Rs. 1.8M',
      rating: 4.7,
      joinDate: 'Feb 15, 2024',
    },
    {
      id: 3,
      name: 'Chaminda Wickramasinghe',
      email: 'chaminda@email.com',
      phone: '+94 76 345 6789',
      subjects: ['Science', 'Mathematics'],
      experience: '8 years',
      qualification: 'B.Sc. Physics',
      status: 'pending',
      totalStudents: 0,
      totalCourses: 0,
      revenue: 'Rs. 0',
      rating: 0,
      joinDate: 'Dec 17, 2025',
    },
    {
      id: 4,
      name: 'Nishantha Silva',
      email: 'nishantha@email.com',
      phone: '+94 70 456 7890',
      subjects: ['History', 'Buddhist Civilization'],
      experience: '12 years',
      qualification: 'M.A. History',
      status: 'suspended',
      totalStudents: 0,
      totalCourses: 4,
      revenue: 'Rs. 450K',
      rating: 3.2,
      joinDate: 'Mar 20, 2024',
    },
  ];

  const stats = [
    { label: 'Total Teachers', value: '18', icon: FaBook, color: 'bg-blue-100 text-blue-700' },
    { label: 'Active Teachers', value: '15', icon: FaCheckCircle, color: 'bg-green-100 text-green-700' },
    { label: 'Pending Approval', value: '2', icon: '⏳', color: 'bg-orange-100 text-orange-700' },
    { label: 'Suspended', value: '1', icon: FaExclamationTriangle, color: 'bg-red-100 text-red-700' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      suspended: 'bg-red-100 text-red-700',
      rejected: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || colors.pending;
  };

  const handleApprovalAction = (teacher) => {
    setSelectedTeacher(teacher);
    setShowApprovalModal(true);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || teacher.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Management</h1>
          <p className="text-gray-600">Approve and manage teacher accounts</p>
        </div>
        <button className="btn-primary px-6">+ Invite Teacher</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-3xl ${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="btn-outline px-4 py-2">Export</button>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{teacher.name}</h3>
                  <p className="text-sm text-gray-500">{teacher.experience} experience</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                {teacher.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📧</span>
                {teacher.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📱</span>
                {teacher.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaGraduationCap className="mr-2" />
                {teacher.qualification}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 mb-2 block">Subjects Teaching</label>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject, index) => (
                  <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {teacher.status === 'approved' && (
              <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{teacher.totalStudents}</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{teacher.totalCourses}</p>
                  <p className="text-xs text-gray-500">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">⭐ {teacher.rating}</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>
            )}

            <div className="flex space-x-2 mt-4">
              {teacher.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleApprovalAction(teacher)}
                    className="flex-1 btn-primary py-2 text-sm"
                  >
                    Review
                  </button>
                </>
              ) : teacher.status === 'approved' ? (
                <>
                  <button className="flex-1 btn-primary py-2 text-sm">View Profile</button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Edit
                  </button>
                </>
              ) : (
                <button className="flex-1 btn-primary py-2 text-sm">View Details</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Teacher Application Review</h2>
              <button onClick={() => setShowApprovalModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedTeacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTeacher.name}</h3>
                  <p className="text-gray-600">{selectedTeacher.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Applied on {selectedTeacher.joinDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900 font-medium">{selectedTeacher.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-gray-900 font-medium">{selectedTeacher.experience}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Qualification</label>
                  <p className="text-gray-900 font-medium">{selectedTeacher.qualification}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Subjects</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.subjects.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Review Checklist:</strong>
                  <br />
                  ✓ Verified email and phone number
                  <br />
                  ✓ Checked qualification documents
                  <br />
                  ✓ Reviewed teaching experience
                  <br />
                  ✓ Background verification completed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                <textarea rows="3" className="input-field" placeholder="Add any notes about this application..." />
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-medium">
                  ✓ Approve Teacher
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium">
                  ✗ Reject Application
                </button>
                <button onClick={() => setShowApprovalModal(false)} className="px-6 btn-outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;
