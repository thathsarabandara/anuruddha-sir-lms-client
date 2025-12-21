import { useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaGraduationCap, FaTimes, FaUserGraduate } from 'react-icons/fa';

const AdminStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    {
      id: 1,
      name: 'Kamal Perera',
      email: 'kamal@email.com',
      phone: '+94 77 123 4567',
      grade: 'Grade 5',
      enrolledCourses: 3,
      status: 'active',
      joinDate: 'Oct 15, 2024',
      totalPayments: 'Rs. 36,000',
      attendance: 92,
      avgScore: 85,
    },
    {
      id: 2,
      name: 'Nimal Silva',
      email: 'nimal@email.com',
      phone: '+94 71 234 5678',
      grade: 'Grade 5',
      enrolledCourses: 2,
      status: 'active',
      joinDate: 'Nov 03, 2024',
      totalPayments: 'Rs. 24,000',
      attendance: 88,
      avgScore: 78,
    },
    {
      id: 3,
      name: 'Dilshan Mendis',
      email: 'dilshan@email.com',
      phone: '+94 76 345 6789',
      grade: 'Grade 5',
      enrolledCourses: 4,
      status: 'active',
      joinDate: 'Sep 20, 2024',
      totalPayments: 'Rs. 48,000',
      attendance: 95,
      avgScore: 92,
    },
    {
      id: 4,
      name: 'Sanduni Fernando',
      email: 'sanduni@email.com',
      phone: '+94 70 456 7890',
      grade: 'Grade 5',
      enrolledCourses: 1,
      status: 'inactive',
      joinDate: 'Aug 10, 2024',
      totalPayments: 'Rs. 12,000',
      attendance: 45,
      avgScore: 62,
    },
    {
      id: 5,
      name: 'Kasun Jayawardena',
      email: 'kasun@email.com',
      phone: '+94 77 567 8901',
      grade: 'Grade 5',
      enrolledCourses: 3,
      status: 'suspended',
      joinDate: 'Jul 05, 2024',
      totalPayments: 'Rs. 36,000',
      attendance: 0,
      avgScore: 0,
    },
  ];

  const stats = [
    { label: 'Total Students', value: '1,247', icon: FaUserGraduate, color: 'bg-blue-100 text-blue-700' },
    { label: 'Active Students', value: '1,189', icon: FaCheckCircle, color: 'bg-green-100 text-green-700' },
    { label: 'New This Month', value: '45', icon: '🆕', color: 'bg-purple-100 text-purple-700' },
    { label: 'Suspended', value: '8', icon: FaExclamationTriangle, color: 'bg-red-100 text-red-700' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.active;
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
          <p className="text-gray-600">Manage all student accounts and enrollments</p>
        </div>
        <button className="btn-primary px-6">+ Add New Student</button>
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
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="btn-outline px-4 py-2">Export</button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.grade}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <p className="text-gray-900">{student.email}</p>
                    <p className="text-gray-500">{student.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {student.enrolledCourses} courses
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ maxWidth: '100px' }}>
                        <div
                          className={`h-2 rounded-full ${student.attendance >= 80 ? 'bg-green-500' : student.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${student.avgScore >= 75 ? 'text-green-600' : student.avgScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {student.avgScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.joinDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(student)}
                        className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs"
                      >
                        View
                      </button>
                      <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-xs">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.status)}`}>
                    {selectedStudent.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 font-medium">{selectedStudent.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Grade</label>
                  <p className="text-gray-900 font-medium">{selectedStudent.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Join Date</label>
                  <p className="text-gray-900 font-medium">{selectedStudent.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Payments</label>
                  <p className="text-gray-900 font-medium">{selectedStudent.totalPayments}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrolled Courses</label>
                  <p className="text-gray-900 font-medium">{selectedStudent.enrolledCourses}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Attendance Rate</label>
                  <p className="text-gray-900 font-medium">{selectedStudent.attendance}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Average Score</label>
                  <p className="text-gray-900 font-medium">{selectedStudent.avgScore}%</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="flex-1 btn-primary">Edit Student</button>
                <button className="flex-1 btn-outline">View Performance</button>
                {selectedStudent.status === 'active' && (
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Suspend</button>
                )}
                {selectedStudent.status === 'suspended' && (
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Activate</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
