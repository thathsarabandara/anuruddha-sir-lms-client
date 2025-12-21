import { FaBook, FaLightbulb } from 'react-icons/fa';

const TeacherRevenue = () => {
  const revenueStats = {
    thisMonth: 1250000,
    lastMonth: 1180000,
    total: 5240000,
    pending: 85000,
  };

  const courseRevenue = [
    { course: 'Complete Scholarship Package', students: 156, price: 25000, revenue: 3900000, color: 'bg-blue-600' },
    { course: 'Mathematics Excellence', students: 89, price: 8000, revenue: 712000, color: 'bg-green-600' },
    { course: 'Sinhala Language', students: 72, price: 8000, revenue: 576000, color: 'bg-purple-600' },
    { course: 'Environment Studies', students: 6, price: 8000, revenue: 48000, color: 'bg-yellow-600' },
  ];

  const recentPayments = [
    { id: 1, student: 'Kasun Perera', course: 'Complete Package', amount: 25000, date: 'Dec 15, 2025', status: 'verified' },
    { id: 2, student: 'Nimal Silva', course: 'Mathematics', amount: 8000, date: 'Dec 14, 2025', status: 'verified' },
    { id: 3, student: 'Saman W.', course: 'Sinhala', amount: 8000, date: 'Dec 13, 2025', status: 'verified' },
    { id: 4, student: 'Ruwan Fernando', course: 'Mathematics', amount: 8000, date: 'Dec 12, 2025', status: 'pending' },
    { id: 5, student: 'Amila Jayawardena', course: 'Complete Package', amount: 25000, date: 'Dec 11, 2025', status: 'pending' },
  ];

  const monthlyData = [
    { month: 'Jul', revenue: 980000 },
    { month: 'Aug', revenue: 1050000 },
    { month: 'Sep', revenue: 1120000 },
    { month: 'Oct', revenue: 1080000 },
    { month: 'Nov', revenue: 1180000 },
    { month: 'Dec', revenue: 1250000 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue & Earnings</h1>
        <p className="text-gray-600">Track your income and financial performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-green-400 to-green-600 text-white">
          <div className="text-sm opacity-90 mb-1">This Month</div>
          <div className="text-3xl font-bold">Rs. {(revenueStats.thisMonth / 1000).toFixed(0)}K</div>
          <div className="text-sm opacity-90 mt-2">
            ↑ {(((revenueStats.thisMonth - revenueStats.lastMonth) / revenueStats.lastMonth) * 100).toFixed(1)}% from last month
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div className="text-sm opacity-90 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold">Rs. {(revenueStats.total / 1000000).toFixed(2)}M</div>
          <div className="text-sm opacity-90 mt-2">All time earnings</div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
          <div className="text-sm opacity-90 mb-1">Pending Verification</div>
          <div className="text-3xl font-bold">Rs. {(revenueStats.pending / 1000).toFixed(0)}K</div>
          <div className="text-sm opacity-90 mt-2">2 payments pending</div>
        </div>
        <div className="card bg-gradient-to-br from-purple-400 to-purple-600 text-white">
          <div className="text-sm opacity-90 mb-1">Avg per Student</div>
          <div className="text-3xl font-bold">Rs. {(revenueStats.total / 323 / 1000).toFixed(1)}K</div>
          <div className="text-sm opacity-90 mt-2">323 total students</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue Trend</h2>
            <div className="space-y-3">
              {monthlyData.map((data) => (
                <div key={data.month}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="font-medium text-gray-700">{data.month} 2025</span>
                    <span className="font-bold text-gray-900">Rs. {(data.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course-wise Revenue */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue by Course</h2>
            <div className="space-y-4">
              {courseRevenue.map((course) => (
                <div key={course.course} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`${course.color} text-white p-2 rounded-lg`}>
                        <FaBook className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{course.course}</h4>
                        <p className="text-sm text-gray-600">{course.students} students enrolled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        Rs. {course.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">@ Rs. {course.price.toLocaleString()} each</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${course.color} h-2 rounded-full`}
                        style={{ width: `${(course.revenue / 3900000) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {((course.revenue / 5240000) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Payments */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Payments</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{payment.student}</div>
                      <div className="text-xs text-gray-600">{payment.course}</div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        payment.status === 'verified'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {payment.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{payment.date}</span>
                    <span className="font-bold text-green-600">Rs. {payment.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reports & Export</h3>
            <div className="space-y-2">
              <button className="w-full btn-primary text-sm py-2">Download Revenue Report</button>
              <button className="w-full btn-outline text-sm py-2">Export to Excel</button>
              <button className="w-full btn-outline text-sm py-2">View Tax Summary</button>
            </div>
          </div>

          {/* Summary */}
          <div className="card bg-blue-50 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Insights</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• December is showing 5.9% growth</p>
              <p>• Complete Package is your top earner</p>
              <p>• 2 payments need verification</p>
              <p>• Average student value: Rs. 16.2K</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRevenue;
