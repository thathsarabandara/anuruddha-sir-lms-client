import { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaCopy,
  FaEdit,
  FaKey,
  FaMinusCircle,
  FaPlus,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import { courseAPI } from '../../api/course';

const formatDate = (value) => {
  if (!value) return 'No expiry';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
};

const emptyForm = {
  max_enrollments: '10',
  expiry_date: '',
  description: '',
};

const normalizeKey = (row) => {
  const maxEnrollments = Number(row?.max_enrollments || 0);
  const currentUsage = Number(row?.current_usage || 0);
  return {
    keyId: row?.key_id,
    key: row?.key,
    maxEnrollments,
    currentUsage,
    remainingSlots: Math.max(0, maxEnrollments - currentUsage),
    description: row?.description || '',
    expiryDate: row?.expiry_date || '',
    isActive: Boolean(row?.is_active),
    createdAt: row?.created_at || '',
    deactivatedAt: row?.deactivated_at || '',
  };
};

const EnrollmentKeyManager = ({ courseId, showNotification }) => {
  const [keys, setKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingId, setIsEditingId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [activeFilter, setActiveFilter] = useState('all');

  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.response?.data?.detail || err?.message || fallback;

  const fetchKeys = async (nextFilter = activeFilter) => {
    try {
      setIsLoading(true);
      const query = {};
      if (nextFilter === 'active') query.is_active = true;
      if (nextFilter === 'inactive') query.is_active = false;

      const response = await courseAPI.getEnrollmentKeys(courseId, query);
      const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
      setKeys(rows.map(normalizeKey));
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to load enrollment keys'), 'error');
      setKeys([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    fetchKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const keyStats = useMemo(() => {
    const total = keys.length;
    const active = keys.filter((item) => item.isActive).length;
    const inactive = total - active;
    const totalUsage = keys.reduce((sum, item) => sum + item.currentUsage, 0);
    return { total, active, inactive, totalUsage };
  }, [keys]);

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateKey = async (event) => {
    event.preventDefault();

    if (!createForm.max_enrollments || Number(createForm.max_enrollments) < 1) {
      showNotification('Max enrollments must be at least 1', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      await courseAPI.createEnrollmentKey(courseId, {
        max_enrollments: Number(createForm.max_enrollments),
        expiry_date: createForm.expiry_date || undefined,
        description: createForm.description.trim() || undefined,
      });
      showNotification('Enrollment key created successfully', 'success');
      setCreateForm(emptyForm);
      setShowCreateForm(false);
      await fetchKeys();
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to create enrollment key'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (item) => {
    setIsEditingId(item.keyId);
    setEditForm({
      max_enrollments: String(item.maxEnrollments || ''),
      expiry_date: item.expiryDate ? String(item.expiryDate).slice(0, 10) : '',
      description: item.description || '',
    });
  };

  const stopEdit = () => {
    setIsEditingId('');
    setEditForm(emptyForm);
  };

  const handleUpdateKey = async (item) => {
    if (!editForm.max_enrollments || Number(editForm.max_enrollments) < 1) {
      showNotification('Max enrollments must be at least 1', 'warning');
      return;
    }

    const payload = {
      max_enrollments: Number(editForm.max_enrollments),
      expiry_date: editForm.expiry_date || undefined,
      description: editForm.description.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      await courseAPI.updateEnrollmentKey(courseId, item.keyId, payload);
      showNotification('Enrollment key updated successfully', 'success');
      stopEdit();
      await fetchKeys();
    } catch (err) {
      const statusCode = err?.response?.status;
      const supportsFallback = statusCode === 404 || statusCode === 405 || statusCode === 501;

      if (!supportsFallback) {
        showNotification(getErrorMessage(err, 'Failed to update enrollment key'), 'error');
        return;
      }

      try {
        if (item.isActive) {
          await courseAPI.deactivateEnrollmentKey(courseId, item.keyId);
        }
        await courseAPI.createEnrollmentKey(courseId, payload);

        showNotification(
          'Updated by creating a replacement key and deactivating the old key.',
          'warning',
          7000
        );
        stopEdit();
        await fetchKeys();
      } catch (fallbackError) {
        showNotification(getErrorMessage(fallbackError, 'Failed to apply key update'), 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (item) => {
    if (!item.isActive) return;

    const confirmed = window.confirm(
      `Deactivate key ${item.key}? Students will no longer be able to enroll with this key.`
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      await courseAPI.deactivateEnrollmentKey(courseId, item.keyId);
      showNotification('Enrollment key deactivated', 'success');
      await fetchKeys();
    } catch (err) {
      showNotification(getErrorMessage(err, 'Failed to deactivate enrollment key'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      showNotification('Enrollment key copied', 'success', 2500);
    } catch {
      showNotification('Unable to copy key to clipboard', 'warning');
    }
  };

  const applyFilter = async (value) => {
    setActiveFilter(value);
    await fetchKeys(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase">Total Keys</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{keyStats.total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase">Active Keys</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{keyStats.active}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase">Inactive Keys</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{keyStats.inactive}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase">Total Usage</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{keyStats.totalUsage}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Enrollment Keys</h2>
            <p className="text-sm text-slate-600 mt-1">
              Create, edit, and deactivate enrollment keys for this course.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyFilter('all')}
              className={`px-3 py-2 rounded-md text-sm border ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => applyFilter('active')}
              className={`px-3 py-2 rounded-md text-sm border ${
                activeFilter === 'active'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => applyFilter('inactive')}
              className={`px-3 py-2 rounded-md text-sm border ${
                activeFilter === 'inactive'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Inactive
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="px-3 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {showCreateForm ? <FaTimes /> : <FaPlus />} {showCreateForm ? 'Close' : 'Create Key'}
            </button>
          </div>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateKey} className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div>
              <label className="text-xs uppercase text-slate-500">Max Enrollments</label>
              <input
                type="number"
                min="1"
                name="max_enrollments"
                value={createForm.max_enrollments}
                onChange={handleCreateChange}
                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase text-slate-500">Expiry Date</label>
              <input
                type="date"
                name="expiry_date"
                value={createForm.expiry_date}
                onChange={handleCreateChange}
                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-slate-500">Description</label>
              <input
                type="text"
                name="description"
                value={createForm.description}
                onChange={handleCreateChange}
                placeholder="Example: Grade 11 batch A"
                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? <BiLoader className="animate-spin" /> : <FaKey />} Create Enrollment Key
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          {isLoading ? (
            <div className="py-8 text-slate-500 flex items-center gap-2">
              <BiLoader className="animate-spin" /> Loading enrollment keys...
            </div>
          ) : keys.length === 0 ? (
            <div className="py-8 text-slate-500 text-center border border-dashed border-slate-300 rounded-lg">
              No enrollment keys found for the selected filter.
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((item) => {
                const isEditing = isEditingId === item.keyId;
                return (
                  <div key={item.keyId} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="px-2 py-1 bg-slate-900 text-white rounded text-sm break-all">{item.key}</code>
                          <button
                            type="button"
                            onClick={() => handleCopyKey(item.key)}
                            className="text-xs px-2 py-1 border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1"
                          >
                            <FaCopy /> Copy
                          </button>
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                            item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.isActive ? <FaCheckCircle /> : <FaMinusCircle />}
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                          <p>Usage: {item.currentUsage} / {item.maxEnrollments} ({item.remainingSlots} slots left)</p>
                          <p className="flex items-center gap-1"><FaCalendarAlt /> Expiry: {formatDate(item.expiryDate)}</p>
                          <p>Created: {formatDate(item.createdAt)}</p>
                          {item.description ? <p>Description: {item.description}</p> : <p>Description: -</p>}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.isActive && !isEditing && (
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                            disabled={isSubmitting}
                          >
                            <FaEdit /> Edit
                          </button>
                        )}
                        {item.isActive && (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(item)}
                            className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                            disabled={isSubmitting}
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs uppercase text-slate-500">Max Enrollments</label>
                            <input
                              type="number"
                              min="1"
                              name="max_enrollments"
                              value={editForm.max_enrollments}
                              onChange={handleEditChange}
                              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs uppercase text-slate-500">Expiry Date</label>
                            <input
                              type="date"
                              name="expiry_date"
                              value={editForm.expiry_date}
                              onChange={handleEditChange}
                              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs uppercase text-slate-500">Description</label>
                            <input
                              type="text"
                              name="description"
                              value={editForm.description}
                              onChange={handleEditChange}
                              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateKey(item)}
                            className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? <BiLoader className="animate-spin" /> : <FaSave />} Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={stopEdit}
                            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentKeyManager;
