import { FaBell, FaCheck, FaClock, FaEnvelope, FaExternalLinkAlt, FaTrash, FaWhatsapp } from 'react-icons/fa';

const typeStyles = {
  course_enrollment: 'bg-blue-100 text-blue-700',
  quiz: 'bg-amber-100 text-amber-700',
  payment: 'bg-emerald-100 text-emerald-700',
  achievement: 'bg-purple-100 text-purple-700',
  system: 'bg-gray-100 text-gray-700',
};

const normalizeTypeLabel = (type) => {
  if (!type) return 'General';
  return type
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return 'Unknown date';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Unknown date';
  return parsed.toLocaleString();
};

const getChannelIcon = (channel) => {
  if (channel === 'email') return <FaEnvelope className="text-slate-500" />;
  if (channel === 'whatsapp') return <FaWhatsapp className="text-green-600" />;
  return <FaBell className="text-slate-500" />;
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) => {
  const typeKey = (notification?.type || '').toLowerCase();
  const badgeClass = typeStyles[typeKey] || 'bg-slate-100 text-slate-700';
  const channels = Array.isArray(notification?.channels) ? notification.channels : [];

  return (
    <article
      className={`rounded-xl border p-5 shadow-sm transition-colors ${
        notification?.is_read
          ? 'border-slate-200 bg-white'
          : 'border-blue-200 bg-blue-50/40'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
              {normalizeTypeLabel(notification?.type)}
            </span>
            {!notification?.is_read && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {notification?.title || 'Untitled notification'}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FaClock />
          <span>{formatDateTime(notification?.created_at)}</span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-700">
        {notification?.message || 'No message provided for this notification.'}
      </p>

      {notification?.detailed_content && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detailed content</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{notification.detailed_content}</p>
        </div>
      )}

      {(channels.length > 0 || notification?.related_resource_type || notification?.related_resource_id) && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          {channels.map((channel) => (
            <span key={channel} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              {getChannelIcon(channel)}
              {channel}
            </span>
          ))}

          {notification?.related_resource_type && (
            <span className="rounded-full bg-slate-100 px-2 py-1">
              Resource: {notification.related_resource_type}
            </span>
          )}

          {notification?.related_resource_id && (
            <span className="rounded-full bg-slate-100 px-2 py-1">
              ID: {notification.related_resource_id}
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {notification?.action_url ? (
            <a
              href={notification.action_url}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
              target={notification.action_url.startsWith('http') ? '_blank' : undefined}
              rel={notification.action_url.startsWith('http') ? 'noreferrer' : undefined}
            >
              Open action
              <FaExternalLinkAlt className="text-xs" />
            </a>
          ) : (
            <p className="text-xs text-slate-500">No action link</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!notification?.is_read && (
            <button
              type="button"
              onClick={() => onMarkAsRead(notification.notification_id)}
              disabled={isUpdating || isDeleting}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaCheck className="text-xs" />
              {isUpdating ? 'Updating...' : 'Mark as read'}
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(notification.notification_id)}
            disabled={isUpdating || isDeleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaTrash className="text-xs" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default NotificationCard;
