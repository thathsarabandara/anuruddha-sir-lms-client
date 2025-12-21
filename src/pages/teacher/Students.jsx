import { useState } from 'react';
import { FaExclamationTriangle, FaTrophy } from 'react-icons/fa';

const TeacherStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Kasun Perera',
      email: 'kasun@email.com',
      phone: '+94 77 123 4567',
      course: 'Complete Scholarship Package',
      enrolledDate: 'Oct 1, 2025',
      attendance: 95,
      avgScore: 88,
      status: 'active',
    },
    {
      id: 2,
      name: 'Nimal Silva',
      email: 'nimal@email.com',
      phone: '+94 77 234 5678',
      course: 'Mathematics Excellence',
      enrolledDate: 'Oct 5, 2025',
      attendance: 92,
      avgScore: 85,
      status: 'active',
    },
    {
      id: 3,
      name: 'Saman Wickramasinghe',
      email: 'saman@email.com',
      phone: '+94 77 345 6789',
      course: 'Sinhala Language',
      enrolledDate: 'Oct 10, 2025',
      attendance: 88,
      avgScore: 82,
      status: 'active',
    },
    {
      id: 4,
      name: 'Ruwan Fernando',
      email: 'ruwan@email.com',
      phone: '+94 77 456 7890',
      course: 'Mathematics Excellence',
      enrolledDate: 'Oct 15, 2025',
      attendance: 75,
      avgScore: 78,
      status: 'inactive',
    },
  ];

  const topPerformers = [
    { rank: 1, name: 'Kasun P.', avgScore: 88, badge: '🥇' },
    { rank: 2, name: 'Nimal S.', avgScore: 85, badge: '🥈' },
    { rank: 3, name: 'Saman W.', avgScore: 82, badge: '🥉' },
  ];

  const filteredStudents = students.filter(
    (student) =>
      (filterCourse === 'all' || student.course === filterCourse) &&
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Students Management</h1>
        <p className="text-gray-600">Monitor student performance and engagement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Students</div>
          <div className="text-2xl font-bold text-gray-900">{students.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {students.filter((s) => s.status === 'active').length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Avg Attendance</div>
          <div className="text-2xl font-bold text-primary-600">
            {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Avg Performance</div>
          <div className="text-2xl font-bold text-yellow-600">
            {Math.round(students.reduce((sum, s) => sum + s.avgScore, 0) / students.length)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Search and Filter */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="input-field md:w-64"
              >
                <option value="all">All Courses</option>
                <option value="Complete Scholarship Package">Complete Package</option>
                <option value="Mathematics Excellence">Mathematics</option>
                <option value="Sinhala Language">Sinhala</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Attendance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{student.course}</div>
                      <div className="text-xs text-gray-600">Since {student.enrolledDate}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                          <div
                            className={`h-2 rounded-full ${
                              student.attendance >= 90
                                ? 'bg-green-600'
                                : student.attendance >= 75
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${student.attendance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{student.attendance}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">{student.avgScore}%</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {student.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Top Performers */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FaTrophy className="mr-2" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {topPerformers.map((performer) => (
                <div key={performer.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{performer.badge}</div>
                    <div>
                      <div className="font-medium text-gray-900">{performer.name}</div>
                      <div className="text-xs text-gray-600">Rank #{performer.rank}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{performer.avgScore}%</div>
                    <div className="text-xs text-gray-600">avg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full btn-primary text-sm py-2">Send Message to All</button>
              <button className="w-full btn-outline text-sm py-2">Export Student List</button>
              <button className="w-full btn-outline text-sm py-2">Generate Report</button>
            </div>
          </div>

          {/* Alerts */}
          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">⚠️ Attention Needed</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-white rounded">
                <span className="font-medium">1 student</span> with low attendance
              </div>
              <div className="p-2 bg-white rounded">
                <span className="font-medium">2 students</span> missed recent quiz
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudents;
