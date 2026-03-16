import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaAward, FaBook, FaGraduationCap, FaUserGraduate , FaStar, FaBell} from 'react-icons/fa';
import { IoLockClosed } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const TeacherProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    experience: user?.years_of_experience || '',
    qualification: user?.qualifications || '',
    address: user?.address || '',
    subjects: user?.subjects || [],
    bio: user?.professional_bio || '',
    subjectsTeaching: user?.subjects_taught || [],
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
    { label: 'Experience', value: '15', icon: FaStar },
  ];

   const notifications = [
    { id: 1, title: 'Email Notifications', description: 'Receive email updates', enabled: true },
    { id: 2, title: 'Whatsapp Notifications', description: 'Receive Whatsapp Updates', enabled: true },
    { id: 3, title: 'In app Notifications', description: 'Receive In app Updates', enabled: true },
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
              <h3 className="font-bold text-lg text-gray-900">{user?.first_name} {user?.last_name}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">{user?.username}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <stat.icon size={24} className="mx-auto mb-2 text-primary-500" />
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CgProfile /> Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <IoLockClosed /> Security
              </button>
              <button
                onClick={() => setActiveTab('notification')}
                className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'notification'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaBell/> Notification
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastName}
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
                    disabled={true}
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
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'notification' && (
            <div className="card">
              <p className="text-2xl font-bold text-black mb-6">Notification Preferences</p>
                <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="text-large text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={notification.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
