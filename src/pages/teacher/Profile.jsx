import { useState } from 'react';
import { FaAward, FaBook, FaGraduationCap, FaUserGraduate } from 'react-icons/fa';

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Anuruddha Sir',
    email: 'anuruddha@email.com',
    phone: '+94 77 123 4567',
    subjects: ['Mathematics', 'Sinhala', 'Environment', 'English'],
    experience: '15 years',
    qualification: 'B.Ed. (Hons) Mathematics',
    bio: 'Experienced Grade 5 Scholarship teacher with a proven track record of helping students achieve excellence.',
    address: 'Colombo, Sri Lanka',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const stats = [
    { label: 'Total Students', value: '245', icon: FaUserGraduate },
    { label: 'Courses', value: '8', icon: FaBook },
    { label: 'Success Rate', value: '95%', icon: FaAward },
    { label: 'Years Experience', value: '15', icon: '⭐' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    // API call to update profile
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Profile</h1>
        <p className="text-gray-600">Manage your professional profile and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold">
                A
              </div>
              <h3 className="font-bold text-gray-900">Anuruddha Sir</h3>
              <p className="text-sm text-gray-600">Mathematics Educator</p>
              <p className="text-xs text-gray-500 mt-1">Member since Oct 2024</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                👤 Profile Information
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
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'preferences'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                ⚙️ Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Information */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn-outline px-4 py-2">
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button onClick={handleSaveProfile} className="btn-primary px-4 py-2">
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Teaching</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input-field"
                      />
                    </div>

                    <button className="btn-primary px-6 py-2">Update Password</button>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                  <button className="btn-outline px-6 py-2">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="input-field">
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="input-field">
                    <option>Asia/Colombo (GMT+5:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select className="input-field">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-700">Email notifications for new enrollments</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-700">Email notifications for quiz submissions</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-700">Email notifications for payments</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>

                <button className="btn-primary px-6 py-2">Save Preferences</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
