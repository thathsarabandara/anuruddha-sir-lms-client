import { useState } from 'react';

const APILogs = () => {
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const logs = [
    { id: 1, method: 'POST', endpoint: '/api/auth/login', status: 200, responseTime: '145ms', timestamp: '11:45:23 PM', ip: '192.168.1.105' },
    { id: 2, method: 'GET', endpoint: '/api/courses', status: 200, responseTime: '89ms', timestamp: '11:45:18 PM', ip: '192.168.1.103' },
    { id: 3, method: 'POST', endpoint: '/api/payments/verify', status: 201, responseTime: '234ms', timestamp: '11:45:12 PM', ip: '192.168.1.108' },
    { id: 4, method: 'GET', endpoint: '/api/students/profile', status: 200, responseTime: '67ms', timestamp: '11:45:05 PM', ip: '192.168.1.105' },
    { id: 5, method: 'PUT', endpoint: '/api/courses/123', status: 200, responseTime: '178ms', timestamp: '11:44:58 PM', ip: '192.168.1.102' },
    { id: 6, method: 'GET', endpoint: '/api/invalid/endpoint', status: 404, responseTime: '12ms', timestamp: '11:44:45 PM', ip: '192.168.1.110' },
    { id: 7, method: 'POST', endpoint: '/api/quiz/submit', status: 500, responseTime: '890ms', timestamp: '11:44:32 PM', ip: '192.168.1.107' },
  ];

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-700';
    if (status >= 400 && status < 500) return 'bg-orange-100 text-orange-700';
    if (status >= 500) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-blue-100 text-blue-700',
      POST: 'bg-green-100 text-green-700',
      PUT: 'bg-yellow-100 text-yellow-700',
      DELETE: 'bg-red-100 text-red-700',
    };
    return colors[method] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Request Logs</h1>
        <p className="text-gray-600">Real-time API request and response monitoring</p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="input-field">
            <option value="all">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
            <option value="all">All Status</option>
            <option value="2xx">2xx Success</option>
            <option value="4xx">4xx Client Error</option>
            <option value="5xx">5xx Server Error</option>
          </select>
          <button className="btn-outline px-4 py-2">Export Logs</button>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getMethodColor(log.method)}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{log.endpoint}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{log.responseTime}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{log.ip}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default APILogs;
