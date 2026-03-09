import React, { useState, useEffect } from 'react';
import {
  getAllGroups,
  createGroup,
  deleteGroup,
  updateGroup,
  getAvailablePermissions,
  addPermissionsToGroup,
  removePermissionsFromGroup,
} from '../../api/permissionApi';

const PermissionGroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  // Fetch groups and permissions on mount
  useEffect(() => {
    fetchGroups();
    fetchAvailablePermissions();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await getAllGroups();
      if (response.status === 'success') {
        setGroups(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePermissions = async () => {
    try {
      const response = await getAvailablePermissions();
      if (response.status === 'success') {
        setAvailablePermissions(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
    }
  };

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await createGroup({
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
      });

      if (response.status === 'success') {
        setSuccessMessage(`Group '${formData.name}' created successfully`);
        setFormData({ name: '', description: '', permissions: [] });
        setShowCreateModal(false);
        setEditingGroup(null);
        fetchGroups();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        setLoading(true);
        const response = await deleteGroup(groupId);
        if (response.status === 'success') {
          setSuccessMessage('Group deleted successfully');
          fetchGroups();
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (err) {
        setError(err.message || 'Failed to delete group');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemovePermissionFromGroup = async (groupId, permissionCodename) => {
    try {
      setLoading(true);
      const response = await removePermissionsFromGroup(groupId, [permissionCodename]);
      if (response.status === 'success') {
        setSuccessMessage('Permission removed successfully');
        fetchGroups();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to remove permission');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermissionToGroup = async (groupId, selectedPermissions) => {
    if (selectedPermissions.length === 0) {
      setError('Please select at least one permission');
      return;
    }

    try {
      setLoading(true);
      const response = await addPermissionsToGroup(groupId, selectedPermissions);
      if (response.status === 'success') {
        setSuccessMessage(`Added ${selectedPermissions.length} permission(s) successfully`);
        setShowAddPermissionModal(null);
        fetchGroups();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to add permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGroup = async (groupId) => {
    if (!formData.name.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await updateGroup(groupId, {
        name: formData.name,
        description: formData.description,
      });

      if (response.status === 'success') {
        setSuccessMessage(`Group '${formData.name}' updated successfully`);
        setEditingGroup(null);
        setFormData({ name: '', description: '', permissions: [] });
        fetchGroups();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (group) => {
    setEditingGroup(group.id);
    setFormData({
      name: group.name,
      description: group.description || '',
      permissions: [],
    });
    setShowCreateModal(true);
  };

  const handlePermissionToggle = (permissionCodename) => {
    if (formData.permissions.includes(permissionCodename)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permissionCodename),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionCodename],
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Permission Groups</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Create Group
        </button>
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

      {/* Create/Edit Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingGroup ? 'Edit Group' : 'Create New Group'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter group name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter group description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  />
                </div>

                {!editingGroup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions ({formData.permissions.length} selected)
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border border-gray-300 rounded-lg">
                      {availablePermissions.map((perm) => (
                        <label key={perm.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(perm.codename)}
                            onChange={() => handlePermissionToggle(perm.codename)}
                            className="mr-2 w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{perm.codename}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingGroup(null);
                    setFormData({ name: '', description: '', permissions: [] });
                    setError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingGroup) {
                      handleUpdateGroup(editingGroup);
                    } else {
                      handleCreateGroup();
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition"
                >
                  {loading ? 'Saving...' : editingGroup ? 'Update Group' : 'Create Group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Permissions Modal */}
      {showAddPermissionModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Add Permissions to Group</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Permissions to Add
                </label>
                <div id="add-permission-modal" className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 border border-gray-300 rounded-lg">
                  {availablePermissions.map((perm) => {
                    const groupPermissions = groups.find(g => g.id === showAddPermissionModal)?.permissions || [];
                    const isAlreadyAssigned = groupPermissions.includes(perm.codename);
                    
                    return (
                      <label 
                        key={perm.id} 
                        className={`flex items-center p-2 rounded cursor-pointer ${
                          isAlreadyAssigned ? 'bg-gray-100 opacity-50' : 'hover:bg-blue-50'
                        }`}
                        title={isAlreadyAssigned ? 'Already assigned' : ''}
                      >
                        <input
                          type="checkbox"
                          disabled={isAlreadyAssigned}
                          defaultChecked={false}
                          className="mr-2 w-4 h-4"
                        />
                        <span className={`text-sm ${isAlreadyAssigned ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {perm.codename}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddPermissionModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const checkboxes = document.querySelectorAll(
                      '#add-permission-modal input[type="checkbox"]:checked'
                    );
                    const selectedPermissions = Array.from(checkboxes).map(
                      (cb) => cb.parentElement.textContent.trim()
                    );
                    handleAddPermissionToGroup(showAddPermissionModal, selectedPermissions);
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition"
                >
                  {loading ? 'Adding...' : 'Add Permissions'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Groups List */}
      {loading && groups.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No groups found. Create your first group!
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="border border-gray-200 rounded-lg">
              <div
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                onClick={() =>
                  setExpandedGroupId(expandedGroupId === group.id ? null : group.id)
                }
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-600">
                    {group.permissions_count} permissions • {group.members_count} members
                  </p>
                </div>
                <span className="text-gray-400">
                  {expandedGroupId === group.id ? '▼' : '▶'}
                </span>
              </div>

              {/* Expanded Content */}
              {expandedGroupId === group.id && (
                <div className="p-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-3 text-gray-700">Permissions</h4>
                  <div className="space-y-2 mb-4">
                    {group.permissions && group.permissions.length > 0 ? (
                      group.permissions.map((perm) => (
                        <div
                          key={perm}
                          className="flex justify-between items-center bg-gray-100 p-2 rounded"
                        >
                          <span className="text-sm text-gray-700">{perm}</span>
                          <button
                            onClick={() =>
                              handleRemovePermissionFromGroup(group.id, perm)
                            }
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No permissions assigned</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => openEditModal(group)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                    >
                      Edit Group
                    </button>
                    <button
                      onClick={() => setShowAddPermissionModal(group.id)}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
                    >
                      Add Permissions
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                    >
                      Delete Group
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionGroupManager;
