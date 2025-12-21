const SystemHealth = () => {
  const serverMetrics = [
    { label: 'CPU Usage', value: '45%', status: 'good', max: 100 },
    { label: 'Memory Usage', value: '62%', status: 'warning', max: 100 },
    { label: 'Disk Usage', value: '38%', status: 'good', max: 100 },
    { label: 'Network I/O', value: '156 Mbps', status: 'good' },
  ];

  const databaseMetrics = [
    { label: 'Active Connections', value: '45/100', status: 'good' },
    { label: 'Query Response', value: '12ms', status: 'good' },
    { label: 'DB Size', value: '2.4 GB', status: 'good' },
    { label: 'Cache Hit Rate', value: '94%', status: 'good' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">System Health</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {serverMetrics.map((metric, index) => (
          <div key={index} className="card">
            <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
            {metric.max && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${parseInt(metric.value) > 80 ? 'bg-red-500' : parseInt(metric.value) > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: metric.value }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Database Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {databaseMetrics.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-xl font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Server Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Server Version</span>
            <span className="font-medium">Node.js v20.10.0</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">OS</span>
            <span className="font-medium">Ubuntu 22.04 LTS</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Database</span>
            <span className="font-medium">PostgreSQL 15.3</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Last Restart</span>
            <span className="font-medium">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
