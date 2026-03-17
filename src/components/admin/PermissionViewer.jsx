import React, { useState, useEffect } from 'react';
import { getAvailablePermissions, getAllGroups } from '../../api/permissionApi';

const PermissionViewer = () => {
  const [permissions, setPermissions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByApp, setFilterByApp] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [permRes, groupRes] = await Promise.all([
        getAvailablePermissions(),
        getAllGroups(),
      ]);

      if (permRes.status === 'success') {
        setPermissions(permRes.data);
      }
      if (groupRes.status === 'success') {
        setGroups(groupRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = permissions.filter((perm) => {
    const matchesSearch =
      perm.codename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApp =
      !filterByApp || perm.content_type__app_label === filterByApp;
    return matchesSearch && matchesApp;
  });

  const appLabels = [...new Set(permissions.map((p) => p.content_type__app_label))];

  const getGroupsWithPermission = (permissionCodename) => {
    return groups.filter((g) =>
      g.permissions.includes(permissionCodename)
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Permission Viewer</h2>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Permissions
          </label>
          <input
            type="text"
            placeholder="Search by name or codename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Module
          </label>
          <select
            value={filterByApp}
            onChange={(e) => setFilterByApp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Modules</option>
            {appLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading permissions...</div>
      ) : (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            Found {filteredPermissions.length} of {permissions.length} permissions
          </div>

          <div className="space-y-3">
            {filteredPermissions.map((perm) => {
              const groupsWithPerm = getGroupsWithPermission(perm.codename);
              return (
                <div
                  key={perm.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {perm.codename}
                      </h4>
                      <p className="text-sm text-gray-600">{perm.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Module: <code className="bg-gray-100 px-2 py-1 rounded">
                          {perm.content_type__app_label}
                        </code>
                      </p>
                    </div>
                  </div>

                  {groupsWithPerm.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Groups with this permission:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {groupsWithPerm.map((g) => (
                          <span
                            key={g.id}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionViewer;
