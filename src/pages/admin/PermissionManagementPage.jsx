import React, { useState } from 'react';
import Notification from '../../components/common/Notification';
import PermissionGroupManager from '../../components/admin/PermissionGroupManager';
import UserPermissionManager from '../../components/admin/UserPermissionManager';


const PermissionManagementPage = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const [activeTab, setActiveTab] = useState('groups'); // 'groups', 'users', 'overview'
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm">
          <Notification 
            {...notification} 
            onClose={() => setNotification(null)} 
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Permission Management
          </h1>
          <p className="text-gray-600">
            Manage user groups, permissions, and roles across the system
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'groups'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              👥 Manage Groups
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'users'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              👤 User Permissions
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              📊 Overview
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div>
              <PermissionGroupManager />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Select User to Manage
                </h2>
                <input
                  type="number"
                  placeholder="Enter User ID"
                  onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedUserId ? (
                <UserPermissionManager
                  userId={selectedUserId}
                  username={`User #${selectedUserId}`}
                />
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                  <p className="text-gray-700 font-medium">
                    Enter a User ID to manage their permissions
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Groups Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    📋 Groups
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Manage and organize user groups to assign permissions in bulk
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Create new groups</li>
                    <li>✓ Add/remove permissions</li>
                    <li>✓ View group members</li>
                    <li>✓ Delete groups</li>
                  </ul>
                </div>

                {/* User Permissions Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    👤 User Permissions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Assign or remove permissions for individual users
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Assign users to groups</li>
                    <li>✓ Assign direct permissions</li>
                    <li>✓ View all user permissions</li>
                    <li>✓ Remove groups or permissions</li>
                  </ul>
                </div>
              </div>

              {/* Permission System Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📚 Permission System Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Group Permissions</h4>
                    <p className="mb-3">
                      Permissions assigned to a group are automatically inherited by all
                      members of that group. This is the recommended way to manage permissions.
                    </p>
                    <h5 className="font-medium text-gray-800 mb-1">Default Groups:</h5>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>Student</strong> - Basic course access</li>
                      <li><strong>Teacher</strong> - Course management</li>
                      <li><strong>Admin</strong> - Full system access</li>
                      <li><strong>Moderator</strong> - Content moderation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Direct Permissions</h4>
                    <p className="mb-3">
                      Individual permissions can also be assigned directly to users,
                      overriding or extending their group permissions.
                    </p>
                    <h5 className="font-medium text-gray-800 mb-1">Example Permissions:</h5>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>add_course</li>
                      <li>change_course</li>
                      <li>view_students</li>
                      <li>submit_quiz</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">
                  💡 Best Practices
                </h3>
                <ul className="space-y-2 text-sm text-amber-900">
                  <li>• <strong>Use groups for most users:</strong> Groups make it easier to manage permissions for multiple users</li>
                  <li>• <strong>Use direct permissions sparingly:</strong> Reserve direct permissions for special cases</li>
                  <li>• <strong>Keep role clarity:</strong> Use clear group names that reflect user roles</li>
                  <li>• <strong>Regular audits:</strong> Periodically review user permissions to ensure they match current roles</li>
                  <li>• <strong>Least privilege:</strong> Assign only the permissions users need to do their job</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionManagementPage;
