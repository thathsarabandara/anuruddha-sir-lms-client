import { useState } from 'react';
import { FaBook, FaCalendar,  FaChartBar, FaCheckCircle, FaFilePdf, FaGraduationCap, FaTimes, FaUserGraduate, FaStar, FaEye } from 'react-icons/fa';
import PulseLoader from '../../components/common/PulseLoader';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const AdminManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [_selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const admins = [
    {
      id: 1,
      name: 'Rajitha Wickramasinghe',
      email: 'rajitha@lms.com',
      phone: '+94 77 111 2222',
      role: 'super_admin',
      permissions: ['all'],
      status: 'active',
      joinDate: 'Jan 01, 2024',
      lastLogin: '2 hours ago',
    },
    {
      id: 2,
      name: 'Priyanka Silva',
      email: 'priyanka@lms.com',
      phone: '+94 71 333 4444',
      role: 'admin',
      permissions: ['students', 'teachers', 'courses', 'payments'],
      status: 'active',
      joinDate: 'Feb 15, 2024',
      lastLogin: '1 day ago',
    },
    {
      id: 3,
      name: 'Nuwan Fernando',
      email: 'nuwan@lms.com',
      phone: '+94 76 555 6666',
      role: 'admin',
      permissions: ['payments', 'certificates', 'reports'],
      status: 'active',
      joinDate: 'Mar 10, 2024',
      lastLogin: '3 hours ago',
    },
    {
      id: 4,
      name: 'Sandali Perera',
      email: 'sandali@lms.com',
      phone: '+94 70 777 8888',
      role: 'admin',
      permissions: ['students', 'quizzes', 'certificates'],
      status: 'inactive',
      joinDate: 'Apr 20, 2024',
      lastLogin: '2 weeks ago',
    },
  ];

  const permissionsList = [
    { key: 'students', label: 'Student Management', icon: FaUserGraduate },
    { key: 'teachers', label: 'Teacher Management', icon: FaBook },
    { key: 'courses', label: 'Course Management', icon: FaBook },
    { key: 'payments', label: 'Payment Verification', icon: '💰' },
    { key: 'quizzes', label: 'Quiz Moderation', icon: FaFilePdf },
    { key: 'certificates', label: 'Certificate Management', icon: FaGraduationCap },
    { key: 'reports', label: 'Reports & Analytics', icon: FaChartBar },
    { key: 'settings', label: 'System Settings', icon: '⚙️' },
  ];

  const statsData = {
    total_admins: 8,
    super_admins: 2,
    active_admins: 6,
    inactive: 2,
  };

  const metricsConfig = [
    {
      label: 'Total Admins',
      statsKey: 'total_admins',
      icon: FaUserGraduate,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'all administrators',
    },
    {
      label: 'Super Admins',
      statsKey: 'super_admins',
      icon: FaStar,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'full access',
    },
    {
      label: 'Active Admins',
      statsKey: 'active_admins',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'currently active',
    },
    {
      label: 'Inactive',
      statsKey: 'inactive',
      icon: FaTimes,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      description: 'not active',
    },
  ];

  const getRoleBadge = (role) => {
    const badges = {
      super_admin: { label: 'Super Admin', color: 'bg-yellow-100 text-yellow-700' },
      admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700' },
    };
    return badges[role] || badges.admin;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
          <p className="text-gray-600">Manage admin accounts and permissions</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary px-6">
          + Create Admin
        </button>
      </div>

      <StatCard stats={statsData} metricsConfig={metricsConfig} />

      {/* Admins DataTable */}
      <DataTable
        data={admins}
        columns={[
          {
            key: 'name',
            label: 'Name',
            searchable: true,
            render: (value, admin) => (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {admin.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ),
          },
          {
            key: 'email',
            label: 'Email',
            searchable: true,
            render: (value) => <p className="text-sm text-gray-600">{value}</p>,
          },
          {
            key: 'phone',
            label: 'Phone',
            render: (value) => <p className="text-sm text-gray-600">{value}</p>,
          },
          {
            key: 'role',
            label: 'Role',
            filterable: true,
            filterOptions: [
              { label: 'All Roles', value: 'all' },
              { label: 'Super Admin', value: 'super_admin' },
              { label: 'Admin', value: 'admin' },
            ],
            render: (value) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(value).color}`}>
                {getRoleBadge(value).label}
              </span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            render: (value) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                {value.toUpperCase()}
              </span>
            ),
          },
          {
            key: 'joinDate',
            label: 'Joined',
            render: (value) => <p className="text-sm text-gray-600">{value}</p>,
          },
          {
            key: 'lastLogin',
            label: 'Last Login',
            render: (value) => <p className="text-sm text-gray-600">{value}</p>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, admin) => (
              <button
                onClick={() => setSelectedAdmin(admin)}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs flex items-center gap-1 transition whitespace-nowrap"
              >
                <FaEye /> Edit
              </button>
            ),
          },
        ]}
        config={{
          itemsPerPage: 10,
          searchPlaceholder: 'Search by name or email...',
          hideSearch: false,
          emptyMessage: 'No admins found',
          searchValue: searchTerm,
          onSearchChange: setSearchTerm,
          statusFilterOptions: [
            { label: 'All Roles', value: 'all' },
            { label: 'Super Admin', value: 'super_admin' },
            { label: 'Admin', value: 'admin' },
          ],
          statusFilterValue: filterRole,
          onStatusFilterChange: setFilterRole,
        }}
        loading={false}
      />

      {/* Activity Log */}
      <div className="card mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Admin Activity</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaCheckCircle className="text-2xl" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Priyanka Silva</span> approved teacher registration
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">💰</div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Nuwan Fernando</span> verified bank payment
              </p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaGraduationCap className="text-2xl" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Rajitha Wickramasinghe</span> issued 5 certificates
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Admin</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="input-field" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="input-field" placeholder="john@lms.com" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" className="input-field" placeholder="+94 77 123 4567" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select className="input-field">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Permissions</label>
                <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                  {permissionsList.map((perm) => (
                    <div key={perm.key} className="flex items-center space-x-2">
                      <input type="checkbox" id={perm.key} className="rounded" />
                      <label htmlFor={perm.key} className="text-sm text-gray-700">
                        {perm.icon} {perm.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Password</label>
                <input type="password" className="input-field" placeholder="Create secure password" required />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> The admin will receive a welcome email with login instructions. They will be
                  required to change their password on first login.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Create Admin Account
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-outline px-6">
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

export default AdminManagement;
