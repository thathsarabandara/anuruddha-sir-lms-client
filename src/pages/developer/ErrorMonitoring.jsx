const ErrorMonitoring = () => {
  const errors = [
    {
      id: 1,
      type: 'Database Error',
      message: 'Connection pool exhausted',
      stack: 'at DatabaseService.query (db.js:45:12)\nat CourseController.getCourses (courses.js:23:8)',
      count: 3,
      firstSeen: '2 hours ago',
      lastSeen: '5 mins ago',
      status: 'active',
      severity: 'high',
    },
    {
      id: 2,
      type: 'API Error',
      message: 'PayHere API timeout',
      stack: 'at PaymentService.processPayment (payment.js:67:15)\nat PaymentController.verify (payment.js:102:10)',
      count: 5,
      firstSeen: '3 hours ago',
      lastSeen: '45 mins ago',
      status: 'active',
      severity: 'medium',
    },
    {
      id: 3,
      type: 'Validation Error',
      message: 'Invalid email format',
      stack: 'at AuthValidator.validateEmail (validator.js:34:8)\nat AuthController.register (auth.js:56:12)',
      count: 12,
      firstSeen: '1 day ago',
      lastSeen: '2 hours ago',
      status: 'resolved',
      severity: 'low',
    },
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-blue-100 text-blue-700',
    };
    return colors[severity] || colors.low;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-700',
      resolved: 'bg-green-100 text-green-700',
      ignored: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Error Monitoring</h1>
        <p className="text-gray-600">Track and resolve application errors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Errors</p>
          <p className="text-3xl font-bold text-gray-900">20</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Active Errors</p>
          <p className="text-3xl font-bold text-red-600">8</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Resolved (24h)</p>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>
      </div>

      <div className="space-y-4">
        {errors.map((error) => (
          <div key={error.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{error.type}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(error.severity)}`}>
                    {error.severity.toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(error.status)}`}>
                    {error.status.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {error.count} occurrences
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{error.message}</p>
                <div className="text-sm text-gray-500 space-x-4">
                  <span>First seen: {error.firstSeen}</span>
                  <span>Last seen: {error.lastSeen}</span>
                </div>
              </div>
            </div>

            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-gray-900 text-sm">Stack Trace</summary>
              <pre className="mt-3 text-xs text-gray-700 font-mono overflow-x-auto">{error.stack}</pre>
            </details>

            <div className="flex space-x-2 mt-4">
              {error.status === 'active' && (
                <>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                    Mark Resolved
                  </button>
                  <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded text-sm">
                    Ignore
                  </button>
                </>
              )}
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorMonitoring;
