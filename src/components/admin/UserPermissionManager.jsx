import React, { useState, useEffect } from 'react';
import {
  getAllGroups,
  getUserPermissions,
  assignUserToGroup,
  removeUserFromGroup,
  assignPermissionToUser,
  removePermissionFromUser,
  getAvailablePermissions,
} from '../../api/permissionApi';

const UserPermissionManager = ({ userId, username }) => {
  const [groups, setGroups] = useState([]);
  const [userPermissions, setUserPermissions] = useState(null);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' or 'permissions'

  // Fetch data on mount
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [groupsRes, permissionsRes, availableRes] = await Promise.all([
        getAllGroups(),
        getUserPermissions(userId),
        getAvailablePermissions(),
      ]);

      if (groupsRes.status === 'success') {
        setGroups(groupsRes.data);
      }
      if (permissionsRes.status === 'success') {
        setUserPermissions(permissionsRes.data);
      }
      if (availableRes.status === 'success') {
        setAvailablePermissions(availableRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignGroup = async (groupId) => {
    try {
      setLoading(true);
      const response = await assignUserToGroup(userId, groupId);
      if (response.status === 'success') {
        setSuccessMessage(`User assigned to group successfully`);
        fetchUserData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to assign group');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGroup = async (groupId) => {
    if (window.confirm('Remove user from this group?')) {
      try {
        setLoading(true);
        const response = await removeUserFromGroup(userId, groupId);
        if (response.status === 'success') {
          setSuccessMessage('User removed from group successfully');
          fetchUserData();
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (err) {
        setError(err.message || 'Failed to remove group');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAssignPermission = async (permissionCodename) => {
    try {
      setLoading(true);
      const response = await assignPermissionToUser(userId, permissionCodename);
      if (response.status === 'success') {
        setSuccessMessage('Permission assigned successfully');
        fetchUserData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to assign permission');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePermission = async (permissionCodename) => {
    if (window.confirm('Remove this permission from user?')) {
      try {
        setLoading(true);
        const response = await removePermissionFromUser(userId, permissionCodename);
        if (response.status === 'success') {
          setSuccessMessage('Permission removed successfully');
          fetchUserData();
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (err) {
        setError(err.message || 'Failed to remove permission');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !userPermissions) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Permissions</h2>
        <p className="text-gray-600 mt-1">Managing permissions for: <strong>{username}</strong></p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'groups'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Groups ({userPermissions?.groups?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'permissions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Direct Permissions ({userPermissions?.direct_permissions?.length || 0})
        </button>
      </div>

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Assigned Groups</h3>
          {userPermissions?.groups && userPermissions.groups.length > 0 ? (
            <div className="space-y-2 mb-6">
              {userPermissions.groups.map((groupName) => (
                <div
                  key={groupName}
                  className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200"
                >
                  <span className="text-gray-800 font-medium">{groupName}</span>
                  <button
                    onClick={() => {
                      const group = groups.find((g) => g.name === groupName);
                      if (group) handleRemoveGroup(group.id);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No groups assigned yet</p>
          )}

          <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groups
              .filter((g) => !userPermissions?.groups?.includes(g.name))
              .map((group) => (
                <div
                  key={group.id}
                  className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{group.name}</h4>
                      <p className="text-sm text-gray-600">
                        {group.permissions_count} permissions
                      </p>
                    </div>
                    <button
                      onClick={() => handleAssignGroup(group.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm transition"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Group Permissions ({userPermissions?.group_permissions?.length || 0})
          </h3>
          {userPermissions?.group_permissions && userPermissions.group_permissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
              {userPermissions.group_permissions.map((perm) => (
                <div
                  key={perm}
                  className="flex items-center bg-white p-2 rounded border border-gray-200"
                >
                  <span className="text-sm text-gray-700">📋 {perm}</span>
                  <span className="ml-auto text-xs text-gray-500">(via group)</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No group permissions</p>
          )}

          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Direct Permissions ({userPermissions?.direct_permissions?.length || 0})
          </h3>
          {userPermissions?.direct_permissions && userPermissions.direct_permissions.length > 0 ? (
            <div className="space-y-2 mb-6">
              {userPermissions.direct_permissions.map((perm) => (
                <div
                  key={perm}
                  className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200"
                >
                  <span className="text-gray-800 font-medium">✓ {perm}</span>
                  <button
                    onClick={() => handleRemovePermission(perm)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No direct permissions assigned</p>
          )}

          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Add Direct Permission
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availablePermissions
              .filter((p) => !userPermissions?.direct_permissions?.includes(p.codename))
              .map((perm) => (
                <div
                  key={perm.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{perm.codename}</p>
                    <p className="text-xs text-gray-600">{perm.name}</p>
                  </div>
                  <button
                    onClick={() => handleAssignPermission(perm.codename)}
                    disabled={loading}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded text-sm transition"
                  >
                    Add
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPermissionManager;
