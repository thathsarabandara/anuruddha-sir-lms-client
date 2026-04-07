import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaBell, FaCheck, FaFilter, FaInbox, FaRedoAlt, FaSearch } from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import NotificationCard from '../../components/student/NotificationCard';
import { studentAPI } from '../../api/student';

const PAGE_LIMIT = 10;

const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.message || error?.data?.message || fallback;

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [total, setTotal] = useState(0);

  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const loadNotifications = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setFetching(true);
    }

    try {
      const offset = (page - 1) * PAGE_LIMIT;
      const response = await studentAPI.getNotifications({
        limit: PAGE_LIMIT,
        offset,
        filter: activeFilter,
        sort: sortOrder,
      });

      const payload = response?.data?.data;
      const rows = payload?.notifications || [];
      const paginationTotal = payload?.pagination?.total || 0;

      setNotifications(rows);
      setTotal(paginationTotal);
    } catch (error) {
      setNotifications([]);
      setTotal(0);
      showNotification(getErrorMessage(error, 'Failed to load notifications'), 'error');
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [activeFilter, page, sortOrder]);

  useEffect(() => {
    loadNotifications(true);
  }, [loadNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      setUpdatingId(notificationId);
      await studentAPI.markNotificationAsRead(notificationId);
      setNotifications((prev) => prev.map((item) => (
        item.notification_id === notificationId
          ? { ...item, is_read: true }
          : item
      )));
      showNotification('Notification marked as read', 'success', 3500);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to mark notification as read'), 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      setDeletingId(notificationId);
      await studentAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((item) => item.notification_id !== notificationId));
      setTotal((prev) => Math.max(0, prev - 1));
      showNotification('Notification deleted', 'success', 3500);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to delete notification'), 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await studentAPI.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      showNotification('All notifications marked as read', 'success', 3500);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to update notifications'), 'error');
    }
  };

  const filteredNotifications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return notifications;

    return notifications.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const message = (item.message || '').toLowerCase();
      const details = (item.detailed_content || '').toLowerCase();
      const type = (item.type || '').toLowerCase();

      return title.includes(term) || message.includes(term) || details.includes(term) || type.includes(term);
    });
  }, [notifications, searchTerm]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications],
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <div className="p-6 lg:p-8">
      {notification && (
        <div className="fixed right-4 top-4 z-50 max-w-md">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            <p className="mt-1 text-sm text-slate-600">
              Stay updated with your classes, quizzes, achievements, and account activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loadNotifications(false)}
              disabled={fetching || loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaRedoAlt className={fetching ? 'animate-spin text-xs' : 'text-xs'} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaCheck className="text-xs" />
              Mark all as read
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <FaInbox className="text-xs" />
            Total: {total}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-blue-700">
            <FaBell className="text-xs" />
            Unread: {unreadCount}
          </span>
        </div>
      </header>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search notifications"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <FaFilter className="text-xs" />
            <select
              value={activeFilter}
              onChange={(event) => {
                setActiveFilter(event.target.value);
                setPage(1);
              }}
              className="bg-transparent font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <FaFilter className="text-xs" />
            <select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value);
                setPage(1);
              }}
              className="bg-transparent font-medium text-slate-700 focus:outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center min-h-[500px]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <FaBell />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No notifications found</h2>
          <p className="mt-1 text-sm text-slate-600">
            Try changing the filter or search term to find older notifications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((item) => (
            <NotificationCard
              key={item.notification_id}
              notification={item}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              isUpdating={updatingId === item.notification_id}
              isDeleting={deletingId === item.notification_id}
            />
          ))}
        </div>
      )}

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <p>
          Page {page} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || loading}
            className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || loading}
            className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
};

export default StudentNotifications;
