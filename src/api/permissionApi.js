import apiClient from './axios';

const PERMISSION_API_BASE = '/api/auth/permissions';

/**
 * Permission and Group Management API Service
 */

// ==================== GROUP MANAGEMENT ====================

/**
 * Create a new group
 */
export const createGroup = async (groupData) => {
  try {
    const response = await apiClient.post(
      `${PERMISSION_API_BASE}/groups/create`,
      groupData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

/**
 * Get all groups
 */
export const getAllGroups = async () => {
  try {
    const response = await apiClient.get(`${PERMISSION_API_BASE}/groups`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

/**
 * Get group details
 */
export const getGroupDetail = async (groupId) => {
  try {
    const response = await apiClient.get(
      `${PERMISSION_API_BASE}/groups/${groupId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

/**
 * Update group
 */
export const updateGroup = async (groupId, groupData) => {
  try {
    const response = await apiClient.put(
      `${PERMISSION_API_BASE}/groups/${groupId}/update`,
      groupData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

/**
 * Delete group
 */
export const deleteGroup = async (groupId) => {
  try {
    const response = await apiClient.delete(
      `${PERMISSION_API_BASE}/groups/${groupId}/delete`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

// ==================== GROUP PERMISSIONS ====================

/**
 * Add permissions to group
 */
export const addPermissionsToGroup = async (groupId, permissions) => {
  try {
    const response = await apiClient.post(
      `${PERMISSION_API_BASE}/groups/${groupId}/add-permissions`,
      { permissions }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

/**
 * Remove permissions from group
 */
export const removePermissionsFromGroup = async (groupId, permissions) => {
  try {
    const response = await apiClient.post(
      `${PERMISSION_API_BASE}/groups/${groupId}/remove-permissions`,
      { permissions }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

// ==================== USER GROUPS ====================

/**
 * Assign user to group
 */
export const assignUserToGroup = async (userId, groupId) => {
  try {
    const response = await apiClient.post(
      `${PERMISSION_API_BASE}/users/assign-group`,
      { user_id: userId, group_id: groupId }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

/**
 * Remove user from group
 */
export const removeUserFromGroup = async (userId, groupId) => {
  try {
    const response = await apiClient.post(
      `${PERMISSION_API_BASE}/users/remove-group`,
      { user_id: userId, group_id: groupId }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

// ==================== USER PERMISSIONS ====================

/**
 * Assign permission to user
 */
export const assignPermissionToUser = async (userId, permissionCodename) => {
  try {
    const response = await apiClient.post(
      `${PERMISSION_API_BASE}/users/assign-permission`,
      { user_id: userId, permission_codename: permissionCodename }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

/**
 * Remove permission from user
 */
export const removePermissionFromUser = async (userId, permissionCodename) => {
  try {
    const response = await apiClient.post(
      `${PERMISSION_API_BASE}/users/remove-permission`,
      { user_id: userId, permission_codename: permissionCodename }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

/**
 * Get user permissions
 */
export const getUserPermissions = async (userId) => {
  try {
    const response = await apiClient.get(
      `${PERMISSION_API_BASE}/users/${userId}/permissions`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

// ==================== AVAILABLE PERMISSIONS ====================

/**
 * Get all available permissions
 */
export const getAvailablePermissions = async () => {
  try {
    const response = await apiClient.get(`${PERMISSION_API_BASE}/available`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};

// ==================== INITIALIZATION ====================

/**
 * Initialize default groups
 */
export const initializeDefaultGroups = async () => {
  try {
    const response = await apiClient.post(
      `${PERMISSION_API_BASE}/initialize-defaults`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { status: 'error', message: error.message };
  }
};
