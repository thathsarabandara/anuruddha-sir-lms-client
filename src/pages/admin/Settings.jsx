import { useState } from 'react';
import { FaFileVideo } from 'react-icons/fa';
import PulseLoader from '../../components/common/PulseLoader';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'general'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                ⚙️ General Settings
              </button>
              <button
                onClick={() => setActiveTab('platform')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'platform'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🌐 Platform Config
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'payment'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                💰 Payment Gateway
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'email'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📧 Email Settings
              </button>
              <button
                onClick={() => setActiveTab('zoom')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'zoom'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📹 Zoom Integration
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🔒 Security
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'backup'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                💾 Backup & Recovery
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="Anuruddha Sir's LMS"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Description</label>
                  <textarea
                    rows="3"
                    defaultValue="Grade 5 Scholarship Examination Preparation Platform"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input type="email" defaultValue="info@anuruddhasiswa.lk" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input type="tel" defaultValue="+94 77 123 4567" className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="input-field">
                    <option>Asia/Colombo (GMT+5:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                  <select className="input-field">
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary px-6">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Platform Config */}
          {activeTab === 'platform' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Configuration</h2>
              <form className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Student Registration</p>
                      <p className="text-sm text-gray-500">Allow new students to register</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Teacher Registration</p>
                      <p className="text-sm text-gray-500">Allow teacher applications</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Course Approval</p>
                      <p className="text-sm text-gray-500">Require admin approval for new courses</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-500">Put platform in maintenance mode</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-bold text-gray-900 mb-4">Limits & Restrictions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Students per Course</label>
                      <input type="number" defaultValue="200" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max File Upload (MB)</label>
                      <input type="number" defaultValue="100" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (mins)</label>
                      <input type="number" defaultValue="60" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
                      <input type="number" defaultValue="8" className="input-field" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary px-6">
                  Save Configuration
                </button>
              </form>
            </div>
          )}

          {/* Payment Gateway */}
          {activeTab === 'payment' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Gateway Settings</h2>
              <form className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">PayHere Integration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Merchant ID</label>
                      <input type="text" placeholder="Enter PayHere Merchant ID" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <input type="password" placeholder="Enter PayHere API Key" className="input-field" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm text-gray-700">Enable PayHere payments</label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Bank Transfer Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supported Banks</label>
                      <textarea
                        rows="3"
                        defaultValue="Bank of Ceylon, Commercial Bank, Sampath Bank, Hatton National Bank"
                        className="input-field"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm text-gray-700">Enable bank transfer payments</label>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Cash Payment Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm text-gray-700">Enable cash payments</label>
                    </div>
                    <p className="text-xs text-gray-600">Cash payments must be verified manually by admin</p>
                  </div>
                </div>

                <button type="submit" className="btn-primary px-6">
                  Save Payment Settings
                </button>
              </form>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Configuration</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <input type="text" placeholder="smtp.gmail.com" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <input type="number" placeholder="587" className="input-field" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Username</label>
                    <input type="email" placeholder="noreply@anuruddhasiswa.lk" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                  <input type="text" defaultValue="Anuruddha Sir's LMS" className="input-field" />
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-bold text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">Welcome email on registration</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">Payment confirmation emails</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">Class reminders (24h before)</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">Certificate issuance emails</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary px-6">
                    Save Settings
                  </button>
                  <button type="button" className="btn-outline px-6">
                    Send Test Email
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Zoom Integration */}
          {activeTab === 'zoom' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Zoom Integration</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zoom API Key</label>
                  <input type="text" placeholder="Enter Zoom API Key" className="input-field" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zoom API Secret</label>
                  <input type="password" placeholder="Enter Zoom API Secret" className="input-field" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Meeting Duration (mins)</label>
                  <input type="number" defaultValue="60" className="input-field" />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Enable waiting room</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Mute participants on entry</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Auto record meetings</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary px-6">
                    Save Integration
                  </button>
                  <button type="button" className="btn-outline px-6">
                    Test Connection
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
              <form className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">IP Whitelist</p>
                      <p className="text-sm text-gray-500">Restrict admin access to specific IPs</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Force Password Change</p>
                      <p className="text-sm text-gray-500">Require password change every 90 days</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-bold text-gray-900 mb-4">Login Restrictions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                      <input type="number" defaultValue="5" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (mins)</label>
                      <input type="number" defaultValue="30" className="input-field" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary px-6">
                  Update Security Settings
                </button>
              </form>
            </div>
          )}

          {/* Backup & Recovery */}
          {activeTab === 'backup' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Backup & Recovery</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Automatic Backups</h3>
                  <p className="text-sm text-gray-600 mb-4">Last backup: 2 hours ago</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">Enable automatic backups</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                      <select className="input-field">
                        <option>Every 6 hours</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">Recent Backups</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">backup_2025_12_17_18_00.sql</p>
                        <p className="text-sm text-gray-500">Size: 245 MB • 2 hours ago</p>
                      </div>
                      <button className="btn-outline px-4 py-2 text-sm">Download</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">backup_2025_12_17_12_00.sql</p>
                        <p className="text-sm text-gray-500">Size: 243 MB • 8 hours ago</p>
                      </div>
                      <button className="btn-outline px-4 py-2 text-sm">Download</button>
                    </div>
                  </div>
                </div>

                <button className="btn-primary px-6">Create Backup Now</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
