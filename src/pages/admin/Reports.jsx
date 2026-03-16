import { useState } from 'react';
import { FaChartBar, FaGraduationCap, FaUserGraduate, FaStar } from 'react-icons/fa';

import StatCard from '../../components/common/StatCard';

const AdminReports = () => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('this-month');

  const overviewStats = [
    { label: 'Total Revenue', value: 'Rs. 3.2M', change: '+18%', icon: '💰', color: 'bg-green-100 text-green-700' },
    { label: 'Active Students', value: '1,189', change: '+12%', icon: FaUserGraduate, color: 'bg-blue-100 text-blue-700' },
    { label: 'Course Completions', value: '234', change: '+25%', icon: FaGraduationCap, color: 'bg-purple-100 text-purple-700' },
    { label: 'Avg. Satisfaction', value: '4.8/5', change: '+0.2', icon: '⭐', color: 'bg-yellow-100 text-yellow-700' },
  ];

  const reportsMetricsConfig = [
    {
      label: 'Total Revenue',
      statsKey: 'revenue',
      icon: FaChartBar,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Total earnings',
    },
    {
      label: 'Active Students',
      statsKey: 'activeStudents',
      icon: FaUserGraduate,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Enrolled students',
    },
    {
      label: 'Course Completions',
      statsKey: 'completions',
      icon: FaGraduationCap,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Finished courses',
    },
    {
      label: 'Avg. Satisfaction',
      statsKey: 'satisfaction',
      icon: FaStar,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Student ratings',
    },
  ];

  const monthlyRevenue = [
    { month: 'July', revenue: 245000, students: 180, courses: 32 },
    { month: 'August', revenue: 298000, students: 215, courses: 35 },
    { month: 'September', revenue: 312000, students: 245, courses: 38 },
    { month: 'October', revenue: 345000, students: 287, courses: 40 },
    { month: 'November', revenue: 389000, students: 324, courses: 42 },
    { month: 'December', revenue: 420000, students: 356, courses: 45 },
  ];

  const topCourses = [
    { name: 'Complete Scholarship Package', students: 145, revenue: 'Rs. 1.74M', rating: 4.9 },
    { name: 'Mathematics Excellence', students: 89, revenue: 'Rs. 445K', rating: 4.8 },
    { name: 'Science Mastery', students: 67, revenue: 'Rs. 268K', rating: 4.6 },
    { name: 'English Grammar', students: 54, revenue: 'Rs. 243K', rating: 4.7 },
    { name: 'Sinhala Language', students: 45, revenue: 'Rs. 158K', rating: 4.5 },
  ];

  const topTeachers = [
    { name: 'Anuruddha Sir', students: 245, courses: 8, revenue: 'Rs. 2.4M', rating: 4.9 },
    { name: 'Saman Fernando', students: 187, courses: 6, revenue: 'Rs. 1.8M', rating: 4.7 },
    { name: 'Priya Jayawardena', students: 156, courses: 5, revenue: 'Rs. 1.5M', rating: 4.8 },
  ];

  const studentPerformance = [
    { range: '90-100%', count: 145, percentage: 35 },
    { range: '75-89%', count: 198, percentage: 48 },
    { range: '60-74%', count: 67, percentage: 16 },
    { range: 'Below 60%', count: 8, percentage: 1 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive insights and data analytics</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="input-field">
                <option value="overview">Overview</option>
                <option value="revenue">Revenue</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="courses">Courses</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Date Range</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input-field">
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="btn-outline px-4 py-2">📊 Generate Report</button>
            <button className="btn-primary px-4 py-2">📥 Export PDF</button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <StatCard 
        stats={{
          revenue: 'Rs. 3.2M',
          activeStudents: '1,189',
          completions: '234',
          satisfaction: '4.8/5',
        }}
        metricsConfig={reportsMetricsConfig}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue Trend */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue Trend</h2>
          <div className="space-y-3">
            {monthlyRevenue.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-sm font-medium text-gray-700 w-20">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                    <div
                      className="bg-gradient-to-r from-primary-400 to-primary-600 h-8 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${(data.revenue / 500000) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">Rs. {(data.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-3">
                  {data.students} students • {data.courses} courses
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Performance Distribution */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Student Performance</h2>
          <div className="space-y-4">
            {studentPerformance.map((perf, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{perf.range}</span>
                  <span className="text-sm font-bold text-gray-900">{perf.count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      perf.percentage >= 40
                        ? 'bg-green-500'
                        : perf.percentage >= 20
                        ? 'bg-blue-500'
                        : perf.percentage >= 10
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${perf.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{perf.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Top Courses */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Courses</h2>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-xs text-gray-500">{course.students} students • ⭐ {course.rating}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{course.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Teachers */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Teachers by Revenue</h2>
          <div className="space-y-4">
            {topTeachers.map((teacher, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{teacher.name}</p>
                    <p className="text-xs text-gray-500">
                      {teacher.students} students • {teacher.courses} courses • ⭐ {teacher.rating}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{teacher.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="card mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Key Metrics Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">Rs. 3.2M</p>
            <p className="text-sm text-gray-600 mt-1">Total Revenue (6 months)</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">234</p>
            <p className="text-sm text-gray-600 mt-1">Certificates Issued</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">4,567</p>
            <p className="text-sm text-gray-600 mt-1">Quiz Submissions</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">92%</p>
            <p className="text-sm text-gray-600 mt-1">Avg. Attendance Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
