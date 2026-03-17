import { useState, useEffect } from 'react';
import { MdClose, MdCheckCircle, MdError, MdWarning, MdInfo } from 'react-icons/md';

const Notification = ({ message, type = 'info', duration = 5000, onClose, actions = [] }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: MdCheckCircle,
      iconColor: 'text-green-600',
      text: 'text-green-800',
      button: 'hover:bg-green-100',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: MdError,
      iconColor: 'text-red-600',
      text: 'text-red-800',
      button: 'hover:bg-red-100',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: MdWarning,
      iconColor: 'text-yellow-600',
      text: 'text-yellow-800',
      button: 'hover:bg-yellow-100',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: MdInfo,
      iconColor: 'text-blue-600',
      text: 'text-blue-800',
      button: 'hover:bg-blue-100',
    },
  };

  const style = styles[type] || styles.info;
  const IconComponent = style.icon;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 flex items-start gap-4 shadow-sm`}>
      <IconComponent className={`${style.iconColor} flex-shrink-0 mt-0.5`} size={20} />
      
      <div className="flex-1 min-w-0">
        <p className={`${style.text} text-sm font-medium`}>{message}</p>
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick?.();
                if (action.closeAfter) handleClose();
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${style.button} ${style.text}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleClose}
        className={`p-1 rounded transition-colors ${style.button} flex-shrink-0`}
      >
        <MdClose className={style.iconColor} size={18} />
      </button>
    </div>
  );
};

export default Notification;
