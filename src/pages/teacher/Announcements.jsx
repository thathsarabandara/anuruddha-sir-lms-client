import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaBullhorn,
  FaCalendar,
  FaCheck,
  FaEdit,
  FaEye,
  FaFilter,
  FaPlus,
  FaRedoAlt,
  FaSearch,
  FaTrash,
  FaUsers,
} from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { courseAPI } from '../../api/course';
import { notificationAPI } from '../../api/notification';
import { getUser } from '../../utils/helpers';

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

const toBatchPayload = (form, teacherOnly = false, selectedCourseId = null) => {
  const selectedChannels = Object.entries(form.channels)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name);

  const recipients = teacherOnly
    ? { type: 'course', filters: { course_id: selectedCourseId } }
    : form.recipientType === 'all'
    ? { type: 'all' }
    : { type: 'filtered', filters: { role: form.role } };

  const payload = {
    title: form.title.trim(),
    content: form.content.trim(),
    channels: selectedChannels,
    recipients,
    priority: form.priority,
  };

  if (form.sendMode === 'scheduled' && form.scheduledFor) {
    payload.scheduled_for = form.scheduledFor;
  }

  return payload;
};

const TeacherAnnouncements = () => {
  const currentUser = getUser();
  const isTeacher = currentUser?.role === 'TEACHER';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const [createdNotifications, setCreatedNotifications] = useState([]);
  const [inAppNotifications, setInAppNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('outgoing');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [courseSearch, setCourseSearch] = useState('');
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [editForm, setEditForm] = useState(DEFAULT_FORM);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const loadPageData = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [batchResponse, inAppResponse] = await Promise.all([
        notificationAPI.getBatchHistory({ limit: 100, offset: 0, status: statusFilter === 'all' ? undefined : statusFilter }),
        notificationAPI.getInAppNotifications({ limit: 100, offset: 0, filter: 'all', sort: 'newest' }),
      ]);

      const batches = batchResponse?.data?.data?.batches || [];
      const inbox = inAppResponse?.data?.data?.notifications || [];
      setCreatedNotifications(batches);
      setInAppNotifications(inbox);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to load notifications data'), 'error');
      setCreatedNotifications([]);
      setInAppNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadPageData(true);
  }, [loadPageData]);

  useEffect(() => {
    if (!showCreateModal || !isTeacher) return undefined;

    const timer = setTimeout(async () => {
      try {
        setCourseLoading(true);
        const response = await courseAPI.getTeacherCourses({ q: courseSearch, page: 1, limit: 10 });
        const courses = response?.data?.data || response?.data || [];
        setCourseOptions(Array.isArray(courses) ? courses : courses?.courses || []);
      } catch (error) {
        setCourseOptions([]);
      } finally {
        setCourseLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [courseSearch, isTeacher, showCreateModal]);

  const createdRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return createdNotifications;

    return createdNotifications.filter((item) => {
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
  }, [createdNotifications, searchTerm]);

  const inAppRows = useMemo(() => {
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
    total_announcements: createdNotifications.length,
    published_count: createdNotifications.filter((a) => a.status === 'sent').length,
    total_views: inAppNotifications.length,
    this_week: createdNotifications.filter((a) => {
      if (!a.created_at) return false;
      const createdAt = new Date(a.created_at).getTime();
      const now = Date.now();
      return now - createdAt <= 7 * 24 * 60 * 60 * 1000;
    }).length,
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      searchable: true,
      width: 'w-1/4',
    },
    {
      key: 'content',
      label: 'Message',
      searchable: true,
      width: 'w-1/3',
      render: (value) => (
        <span className="text-gray-700 line-clamp-2">{value}</span>
      ),
    },
    {
      key: 'channels',
      label: 'Channels',
      searchable: true,
      render: (value) => (
        <span className="text-gray-700">{Array.isArray(value) && value.length ? value.join(', ') : '-'}</span>
      ),
      width: 'w-1/5',
    },
    {
      key: 'priority',
      label: 'Priority',
      filterable: true,
      filterOptions: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      render: (value) => (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          value === 'urgent'
            ? 'bg-red-100 text-red-700'
            : value === 'high'
            ? 'bg-orange-100 text-orange-700'
            : value === 'low'
            ? 'bg-slate-100 text-slate-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {(value || 'normal').toUpperCase()}
        </span>
      ),
      width: 'w-24',
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
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
      label: 'Date',
      searchable: true,
      render: (value) => <span>{formatDateTime(value)}</span>,
      width: 'w-28',
    },
    {
      key: 'total_recipients',
      label: 'Recipients',
      render: (value) => (
        <span className="text-gray-700">{value ?? '-'}</span>
      ),
      width: 'w-20',
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (_, row) => (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleOpenEdit(row)}
            disabled={row.status !== 'scheduled'}
            className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-xs rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaEdit className="inline mr-1" />
            Edit
          </button>
          <button
            onClick={() => handleRefreshBatch(row.batch_id)}
            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded font-medium"
          >
            <FaEye className="inline mr-1" />
            Status
          </button>
        </div>
      ),
      width: 'w-40',
    },
  ];

  const inAppColumns = [
    {
      key: 'title',
      label: 'Title',
      searchable: true,
      width: 'w-1/4',
    },
    {
      key: 'message',
      label: 'Message',
      searchable: true,
      width: 'w-1/3',
      render: (value) => <span className="line-clamp-2">{value || '-'}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      searchable: true,
      width: 'w-28',
    },
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
    searchPlaceholder: 'Search created notifications...',
    emptyMessage: 'No notifications found',
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

  const metricsConfig = [
    {
      label: 'Total Announcements',
      statsKey: 'total_announcements',
      icon: FaBullhorn,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'all announcements',
    },
    {
      label: 'Published',
      statsKey: 'published_count',
      icon: FaUsers,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'sent batches',
    },
    {
      label: 'In-app Items',
      statsKey: 'total_views',
      icon: FaEye,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'notification center',
    },
    {
      label: 'This Week',
      statsKey: 'this_week',
      icon: FaCalendar,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'new posts',
    },
  ];

  const resetCreateForm = () => {
    setForm(DEFAULT_FORM);
    setCourseSearch('');
    setSelectedCourse(null);
    setCourseOptions([]);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetCreateForm();
  };

  const handleCreateChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateChannelChange = (channel, checked) => {
    setForm((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: checked,
      },
    }));
  };

  const handleCreateNotification = async (event) => {
    event.preventDefault();
    try {
      const payload = toBatchPayload(form, isTeacher, selectedCourse?.course_id);
      if (!payload.title || !payload.content) {
        showNotification('Title and message are required', 'error');
        return;
      }
      if (!payload.channels.length) {
        showNotification('Select at least one channel', 'error');
        return;
      }
      if (form.sendMode === 'scheduled' && !form.scheduledFor) {
        showNotification('Choose a schedule date and time', 'error');
        return;
      }
      if (isTeacher && !selectedCourse?.course_id) {
        showNotification('Select a course to notify enrolled students', 'error');
        return;
      }

      setSubmitting(true);
      await notificationAPI.sendBulkNotification(payload);
      showNotification('Notification created successfully', 'success');
      handleCloseCreateModal();
      await loadPageData(false);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to create notification'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = async (batchRow) => {
    try {
      const response = await notificationAPI.getBatchDetail(batchRow.batch_id);
      const data = response?.data?.data;
      const channels = Array.isArray(data?.channels) ? data.channels : [];
      const nextForm = {
        title: data?.title || '',
        content: data?.content || '',
        priority: data?.priority || 'normal',
        recipientType: 'all',
        role: 'student',
        channels: {
          in_app: channels.includes('in_app'),
          email: channels.includes('email'),
          whatsapp: channels.includes('whatsapp'),
        },
      };

      setSelectedBatch(data);
      setEditForm(nextForm);
      setShowEditModal(true);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to open edit form'), 'error');
    }
  };

  const handleEditChannelChange = (channel, checked) => {
    setEditForm((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: checked,
      },
    }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!selectedBatch?.batch_id) return;

    try {
      const payload = toBatchPayload(editForm, isTeacher);
      if (!payload.channels.length) {
        showNotification('Select at least one channel', 'error');
        return;
      }

      setSavingEdit(true);
      await notificationAPI.updateBatch(selectedBatch.batch_id, payload);
      showNotification('Notification batch updated', 'success');
      setShowEditModal(false);
      setSelectedBatch(null);
      await loadPageData(false);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to update notification'), 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRefreshBatch = async (batchId) => {
    try {
      const response = await notificationAPI.getBatchStatus(batchId);
      const status = response?.data?.data?.status;
      showNotification(`Batch status: ${status || 'unknown'}`, 'info', 3000);
      await loadPageData(false);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to fetch batch status'), 'error');
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
      showNotification('Notification marked as read', 'success', 2500);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to mark as read'), 'error');
    }
  };

  const handleDeleteInApp = async (notificationId) => {
    try {
      await notificationAPI.deleteInAppNotification(notificationId);
      setInAppNotifications((prev) =>
        prev.filter((item) => item.notification_id !== notificationId)
      );
      showNotification('In-app notification deleted', 'success', 2500);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to delete notification'), 'error');
    }
  };

  const statusHelperText = isTeacher
    ? 'Teacher access can create, search, and edit scheduled notifications.'
    : 'Admin access includes all notification management features.';

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Create and manage in-app notifications for students</p>
          <p className="text-xs text-gray-500 mt-1">{statusHelperText}</p>
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
          <button onClick={() => setShowCreateModal(true)} className="btn-primary px-6">
            <FaPlus className="inline mr-2" />
            Create Notification
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-2">
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
            Outgoing Notifications
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
            Incoming Notifications
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[260px] flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search created and in-app notifications"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          {activeTab === 'outgoing' ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <FaFilter className="text-xs" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="sending">Sending</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          ) : (
            <button
              onClick={async () => {
                try {
                  await notificationAPI.markAllInAppNotificationsAsRead();
                  setInAppNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
                  showNotification('All in-app notifications marked as read', 'success', 2500);
                } catch (error) {
                  showNotification(getErrorMessage(error, 'Failed to update in-app notifications'), 'error');
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
            >
              <FaCheck className="inline mr-2" />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <StatCard stats={stats} metricsConfig={metricsConfig} />

      <div className="mt-8">
        {activeTab === 'outgoing' ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Outgoing Notifications</h2>
            <DataTable
              data={createdRows}
              columns={columns}
              config={tableConfig}
              loading={loading}
            />
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Incoming Notifications</h2>
            <DataTable
              data={inAppRows}
              columns={inAppColumns}
              config={inboxTableConfig}
              loading={loading}
            />
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Notification</h2>
              <button
                onClick={handleCloseCreateModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleCreateNotification}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter notification title"
                  value={form.title}
                  onChange={(event) => handleCreateChange('title', event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="5"
                  className="input-field"
                  placeholder="Write your notification message..."
                  value={form.content}
                  onChange={(event) => handleCreateChange('content', event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2 rounded border border-gray-200 p-3">
                    <input
                      type="radio"
                      name="send-mode"
                      checked={form.sendMode === 'instant'}
                      onChange={() => handleCreateChange('sendMode', 'instant')}
                    />
                    <span className="text-sm text-gray-700">Send instantly</span>
                  </label>
                  <label className="flex items-center space-x-2 rounded border border-gray-200 p-3">
                    <input
                      type="radio"
                      name="send-mode"
                      checked={form.sendMode === 'scheduled'}
                      onChange={() => handleCreateChange('sendMode', 'scheduled')}
                    />
                    <span className="text-sm text-gray-700">Schedule for later</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  className="input-field"
                  value={form.priority}
                  onChange={(event) => handleCreateChange('priority', event.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              {form.sendMode === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={form.scheduledFor}
                    onChange={(event) => handleCreateChange('scheduledFor', event.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                {isTeacher ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Search your courses"
                      value={courseSearch}
                      onChange={(event) => setCourseSearch(event.target.value)}
                    />
                    <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                      {courseLoading ? (
                        <div className="p-3 text-sm text-gray-500">Searching courses...</div>
                      ) : courseOptions.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500">No courses found</div>
                      ) : (
                        courseOptions.map((course) => (
                          <button
                            key={course.course_id}
                            type="button"
                            onClick={() => setSelectedCourse(course)}
                            className={`w-full border-b border-gray-100 px-3 py-3 text-left text-sm hover:bg-blue-50 ${
                              selectedCourse?.course_id === course.course_id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="font-semibold text-gray-900">{course.title}</div>
                            <div className="text-xs text-gray-500">{course.subject || 'Course'} • {course.course_type || 'course'}</div>
                          </button>
                        ))
                      )}
                    </div>
                    {selectedCourse && (
                      <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                        Selected: {selectedCourse.title}
                      </div>
                    )}
                  </div>
                ) : (
                  <select
                    className="input-field"
                    value={form.recipientType}
                    onChange={(event) => handleCreateChange('recipientType', event.target.value)}
                  >
                    <option value="all">All active users</option>
                    <option value="filtered">Filter by role</option>
                  </select>
                )}
              </div>
              {!isTeacher && form.recipientType === 'filtered' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Filter</label>
                  <select
                    className="input-field"
                    value={form.role}
                    onChange={(event) => handleCreateChange('role', event.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {isTeacher && <div className="md:col-span-3 text-xs text-gray-500">Teachers can only notify students enrolled in the selected course.</div>}
                <label className="flex items-center space-x-2 rounded border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    checked={form.channels.in_app}
                    onChange={(event) => handleCreateChannelChange('in_app', event.target.checked)}
                  />
                  <span className="text-sm text-gray-700">In-app</span>
                </label>
                <label className="flex items-center space-x-2 rounded border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    checked={form.channels.email}
                    onChange={(event) => handleCreateChannelChange('email', event.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center space-x-2 rounded border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    checked={form.channels.whatsapp}
                    onChange={(event) => handleCreateChannelChange('whatsapp', event.target.checked)}
                  />
                  <span className="text-sm text-gray-700">WhatsApp</span>
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Notification'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="btn-outline px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Notification Batch</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedBatch(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSaveEdit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={editForm.title}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="5"
                  className="input-field"
                  value={editForm.content}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, content: event.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    className="input-field"
                    value={editForm.priority || 'normal'}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, priority: event.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <label className="flex items-center space-x-2 rounded border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    checked={editForm.channels.in_app}
                    onChange={(event) => handleEditChannelChange('in_app', event.target.checked)}
                  />
                  <span className="text-sm text-gray-700">In-app</span>
                </label>
                <label className="flex items-center space-x-2 rounded border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    checked={editForm.channels.email}
                    onChange={(event) => handleEditChannelChange('email', event.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center space-x-2 rounded border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    checked={editForm.channels.whatsapp}
                    onChange={(event) => handleEditChannelChange('whatsapp', event.target.checked)}
                  />
                  <span className="text-sm text-gray-700">WhatsApp</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary" disabled={savingEdit}>
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBatch(null);
                  }}
                  className="btn-outline px-6"
                >
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

export default TeacherAnnouncements;
