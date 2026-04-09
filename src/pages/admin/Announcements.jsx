import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaBell,
  FaBullhorn,
  FaCalendar,
  FaCheck,
  FaEye,
  FaPlus,
  FaRedoAlt,
  FaTrash,
  FaUsers,
} from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { notificationAPI } from '../../api/notification';

const DEFAULT_FORM = {
  title: '',
  content: '',
  sendMode: 'instant',
  scheduledFor: '',
  priority: 'normal',
  recipientType: 'all',
  role: 'student',
  channels: {
    in_app: true,
    email: false,
    whatsapp: false,
  },
};

const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.message || error?.data?.message || fallback;

const formatDateTime = (value) => {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const toBatchPayload = (form) => {
  const channels = Object.entries(form.channels)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name);

  const recipients =
    form.recipientType === 'all'
      ? { type: 'all' }
      : { type: 'filtered', filters: { role: form.role } };

  const payload = {
    title: form.title.trim(),
    content: form.content.trim(),
    channels,
    recipients,
    priority: form.priority,
  };

  if (form.sendMode === 'scheduled' && form.scheduledFor) {
    payload.scheduled_for = form.scheduledFor;
  }

  return payload;
};

const AdminAnnouncements = () => {
  const [notification, setNotification] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [batches, setBatches] = useState([]);
  const [inAppNotifications, setInAppNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('outgoing');
  const [form, setForm] = useState(DEFAULT_FORM);

  const showToast = (message, type = 'info', duration = 4000) => {
    setNotification({ message, type, duration });
  };

  const loadPageData = useCallback(async (withLoader = true) => {
    if (withLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [batchResponse, inAppResponse] = await Promise.all([
        notificationAPI.getBatchHistory({
          limit: 100,
          offset: 0,
          status: statusFilter === 'all' ? undefined : statusFilter,
        }),
        notificationAPI.getInAppNotifications({
          limit: 100,
          offset: 0,
          filter: 'all',
          sort: 'newest',
        }),
      ]);

      setBatches(batchResponse?.data?.data?.batches || []);
      setInAppNotifications(inAppResponse?.data?.data?.notifications || []);
    } catch (error) {
      setBatches([]);
      setInAppNotifications([]);
      showToast(getErrorMessage(error, 'Failed to load announcements'), 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadPageData(true);
  }, [loadPageData]);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChannelChange = (channel, checked) => {
    setForm((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: checked,
      },
    }));
  };

  const handleCreateAnnouncement = async (event) => {
    event.preventDefault();

    const payload = toBatchPayload(form);
    if (!payload.title || !payload.content) {
      showToast('Title and message are required', 'error');
      return;
    }
    if (!payload.channels.length) {
      showToast('Select at least one channel', 'error');
      return;
    }
    if (form.sendMode === 'scheduled' && !form.scheduledFor) {
      showToast('Choose a scheduled date and time', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await notificationAPI.sendBulkNotification(payload);
      showToast('Announcement created successfully', 'success');
      setShowCreateModal(false);
      resetForm();
      await loadPageData(false);
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to create announcement'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefreshBatchStatus = async (batchId) => {
    try {
      const response = await notificationAPI.getBatchStatus(batchId);
      const status = response?.data?.data?.status || 'unknown';
      showToast(`Batch status: ${status}`, 'info', 3000);
      await loadPageData(false);
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to refresh batch status'), 'error');
    }
  };

  const handleMarkInAppRead = async (notificationId) => {
    try {
      await notificationAPI.markInAppNotificationAsRead(notificationId);
      setInAppNotifications((prev) =>
        prev.map((item) =>
          item.notification_id === notificationId
            ? { ...item, is_read: true }
            : item
        )
      );
      showToast('Notification marked as read', 'success', 2500);
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to mark as read'), 'error');
    }
  };

  const handleDeleteInApp = async (notificationId) => {
    try {
      await notificationAPI.deleteInAppNotification(notificationId);
      setInAppNotifications((prev) =>
        prev.filter((item) => item.notification_id !== notificationId)
      );
      showToast('Notification deleted', 'success', 2500);
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to delete notification'), 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllInAppNotificationsAsRead();
      setInAppNotifications((prev) =>
        prev.map((item) => ({ ...item, is_read: true }))
      );
      showToast('All in-app notifications marked as read', 'success', 2500);
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to mark all as read'), 'error');
    }
  };

  const outgoingRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return batches;

    return batches.filter((item) => {
      const haystack = [
        item.title,
        item.content,
        item.status,
        (item.channels || []).join(', '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [batches, searchTerm]);

  const inboxRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return inAppNotifications;

    return inAppNotifications.filter((item) => {
      const haystack = [item.title, item.message, item.type]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [inAppNotifications, searchTerm]);

  const stats = {
    total: batches.length,
    sent: batches.filter((item) => item.status === 'sent').length,
    scheduled: batches.filter((item) => item.status === 'scheduled').length,
    unread: inAppNotifications.filter((item) => !item.is_read).length,
  };

  const metricsConfig = [
    {
      label: 'Total Batches',
      statsKey: 'total',
      icon: FaBullhorn,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'all announcements',
    },
    {
      label: 'Sent',
      statsKey: 'sent',
      icon: FaCheck,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'delivered batches',
    },
    {
      label: 'Scheduled',
      statsKey: 'scheduled',
      icon: FaCalendar,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'upcoming sends',
    },
    {
      label: 'Unread In-app',
      statsKey: 'unread',
      icon: FaBell,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'notification center',
    },
  ];

  const outgoingColumns = [
    { key: 'title', label: 'Title', searchable: true, width: 'w-1/4' },
    {
      key: 'content',
      label: 'Message',
      searchable: true,
      width: 'w-1/3',
      render: (value) => <span className="line-clamp-2">{value || '-'}</span>,
    },
    {
      key: 'channels',
      label: 'Channels',
      render: (value) => (
        <span>{Array.isArray(value) && value.length ? value.join(', ') : '-'}</span>
      ),
      width: 'w-1/6',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            value === 'sent'
              ? 'bg-green-100 text-green-700'
              : value === 'failed'
              ? 'bg-red-100 text-red-700'
              : value === 'sending'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {(value || '-').toUpperCase()}
        </span>
      ),
      width: 'w-24',
    },
    {
      key: 'created_at',
      label: 'Created',
      searchable: true,
      render: (value) => <span>{formatDateTime(value)}</span>,
      width: 'w-32',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (_, row) => (
        <button
          onClick={() => handleRefreshBatchStatus(row.batch_id)}
          className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded font-medium"
        >
          <FaEye className="inline mr-1" />
          Status
        </button>
      ),
      width: 'w-24',
    },
  ];

  const inboxColumns = [
    { key: 'title', label: 'Title', searchable: true, width: 'w-1/4' },
    {
      key: 'message',
      label: 'Message',
      searchable: true,
      render: (value) => <span className="line-clamp-2">{value || '-'}</span>,
      width: 'w-1/3',
    },
    { key: 'type', label: 'Type', searchable: true, width: 'w-24' },
    {
      key: 'is_read',
      label: 'Read',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${value ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {value ? 'READ' : 'UNREAD'}
        </span>
      ),
      width: 'w-20',
    },
    {
      key: 'created_at',
      label: 'Created',
      searchable: true,
      render: (value) => <span>{formatDateTime(value)}</span>,
      width: 'w-32',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (_, row) => (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleMarkInAppRead(row.notification_id)}
            disabled={row.is_read}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCheck className="inline mr-1" />
            Read
          </button>
          <button
            onClick={() => handleDeleteInApp(row.notification_id)}
            className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-xs rounded font-medium"
          >
            <FaTrash className="inline mr-1" />
            Delete
          </button>
        </div>
      ),
      width: 'w-36',
    },
  ];

  const tableConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search announcements...',
    emptyMessage: 'No announcements found',
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    statusFilterOptions: [
      { label: 'All Status', value: 'all' },
      { label: 'Scheduled', value: 'scheduled' },
      { label: 'Sending', value: 'sending' },
      { label: 'Sent', value: 'sent' },
      { label: 'Failed', value: 'failed' },
    ],
    statusFilterValue: statusFilter,
    onStatusFilterChange: setStatusFilter,
  };

  const inboxTableConfig = {
    itemsPerPage: 10,
    searchPlaceholder: 'Search in-app notifications...',
    emptyMessage: 'No in-app notifications found',
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
  };

  return (
    <div className="p-8">
      {notification && (
        <div className="mb-4">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Announcements</h1>
          <p className="text-gray-600">Create and manage platform-wide announcement batches</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadPageData(false)}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            <FaRedoAlt className={`inline mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-6"
          >
            <FaPlus className="inline mr-2" />
            New Announcement
          </button>
        </div>
      </div>

      <StatCard stats={stats} metricsConfig={metricsConfig} />

      <div className="mb-6 rounded-xl border border-gray-200 p-2 mt-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('outgoing')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === 'outgoing'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Outgoing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === 'incoming'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In-App Inbox
          </button>
          {activeTab === 'incoming' && (
            <button
              onClick={handleMarkAllRead}
              className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
            >
              <FaCheck className="inline mr-2" />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {activeTab === 'outgoing' ? (
        <DataTable
          data={outgoingRows}
          columns={outgoingColumns}
          config={tableConfig}
          loading={loading}
        />
      ) : (
        <DataTable
          data={inboxRows}
          columns={inboxColumns}
          config={inboxTableConfig}
          loading={loading}
        />
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Announcement</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleCreateAnnouncement}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter announcement title"
                  value={form.title}
                  onChange={(event) => handleFormChange('title', event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  className="input-field"
                  rows={5}
                  placeholder="Write your announcement"
                  value={form.content}
                  onChange={(event) => handleFormChange('content', event.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    className="input-field"
                    value={form.priority}
                    onChange={(event) => handleFormChange('priority', event.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                  <select
                    className="input-field"
                    value={form.recipientType}
                    onChange={(event) => handleFormChange('recipientType', event.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="filtered">Filter by Role</option>
                  </select>
                </div>
              </div>

              {form.recipientType === 'filtered' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    className="input-field"
                    value={form.role}
                    onChange={(event) => handleFormChange('role', event.target.value)}
                  >
                    <option value="student">Students</option>
                    <option value="teacher">Teachers</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send Mode</label>
                  <select
                    className="input-field"
                    value={form.sendMode}
                    onChange={(event) => handleFormChange('sendMode', event.target.value)}
                  >
                    <option value="instant">Send Instantly</option>
                    <option value="scheduled">Schedule</option>
                  </select>
                </div>

                {form.sendMode === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule For</label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={form.scheduledFor}
                      onChange={(event) => handleFormChange('scheduledFor', event.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                <div className="flex flex-wrap gap-5 mt-2">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.channels.in_app}
                      onChange={(event) => handleChannelChange('in_app', event.target.checked)}
                    />
                    In-App
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.channels.email}
                      onChange={(event) => handleChannelChange('email', event.target.checked)}
                    />
                    Email
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.channels.whatsapp}
                      onChange={(event) => handleChannelChange('whatsapp', event.target.checked)}
                    />
                    WhatsApp
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
