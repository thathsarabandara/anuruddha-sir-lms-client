import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Integration Status Card
 * Displays the status of an integration service
 */
export const IntegrationStatusCard = ({
  serviceName,
  isConnected,
  isLoading,
  details,
  onConnect,
  onDisconnect,
  onTest,
  icon: Icon,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg border-2 border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && <div className="text-3xl text-blue-600">{Icon}</div>}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{serviceName}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>

        {isLoading ? (
          <FaSpinner className="text-2xl text-blue-600 animate-spin" />
        ) : isConnected ? (
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-2xl text-green-600" />
            <span className="text-sm font-semibold text-green-600">Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FaTimesCircle className="text-2xl text-red-600" />
            <span className="text-sm font-semibold text-red-600">Not Connected</span>
          </div>
        )}
      </div>

      {/* Details section - only shown when connected */}
      {isConnected && details && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
          <div className="space-y-2 text-sm">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                <span className="font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {!isConnected ? (
          <button
            onClick={onConnect}
            disabled={isLoading}
            className="flex-1 btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        ) : (
          <>
            <button
              onClick={onTest}
              disabled={isLoading}
              className="flex-1 btn-secondary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={onDisconnect}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-100 text-red-700 border-2 border-red-300 rounded-lg hover:bg-red-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Credentials Form
 * Reusable form component for entering integration credentials
 */
export const CredentialsForm = ({ title, fields, onSubmit, isLoading, submitText = 'Save Credentials' }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-slate-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>

      <div className="space-y-4 mb-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-600">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={field.rows || 3}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
              />
            )}
            {field.help && <p className="text-xs text-gray-600 mt-1">{field.help}</p>}
          </div>
        ))}
      </div>

      <ButtonWithLoader
        type="submit"
        label={submitText}
        loadingLabel="Saving..."
        isLoading={isLoading}
        variant="success"
        fullWidth
      />
    </form>
  );
};

/**
 * Alert/Notification Component
 */
export const AlertBox = ({ type = 'info', title, message, onClose }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800',
  };

  const iconMap = {
    success: <FaCheckCircle className="text-lg" />,
    error: <FaTimesCircle className="text-lg" />,
    warning: <FaExclamationTriangle className="text-lg" />,
    info: null,
  };

  return (
    <div className={`border-2 rounded-lg p-4 mb-4 flex items-start gap-3 ${typeStyles[type]}`}>
      {iconMap[type]}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-bold hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

/**
 * Loading Spinner
 */
export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">{text}</p>
      </div>
    </div>
  );
};

/**
 * Integration Info Box
 * Shows helpful information about an integration
 */
export const IntegrationInfoBox = ({ title, content, icon: Icon }) => {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        {Icon && <div className="text-2xl text-blue-600 mt-1">{Icon}</div>}
        <div>
          <h4 className="font-bold text-blue-900 mb-2">{title}</h4>
          <p className="text-sm text-blue-800">{content}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Status Badge
 * Small indicator for status
 */
export const StatusBadge = ({ status, text }) => {
  const statusStyles = {
    connected: 'bg-green-100 text-green-800',
    disconnected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
      {text}
    </span>
  );
};
