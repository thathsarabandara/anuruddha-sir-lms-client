import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaAward, FaBell, FaBook, FaStar, FaUserGraduate } from 'react-icons/fa';
import { IoLockClosed } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';

import { authAPI } from '../../api';
import { updateUser } from '../../app/slices/authSlice';
import Notification from '../../components/common/Notification';
import { teacherAPI } from '../../api/teacher';

const TeacherProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    years_of_experience: user?.years_of_experience || '',
    qualifications: user?.qualifications || '',
    address: user?.address || '',
    professional_bio: user?.professional_bio || '',
    profile_picture: user?.profile_picture || '',
    subjects_taught: Array.isArray(user?.subjects_taught) ? user.subjects_taught : [],
    subjects_input: Array.isArray(user?.subjects_taught) ? user.subjects_taught.join(', ') : '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const stats = [
    { label: 'Total Students', value: '245', icon: FaUserGraduate },
    { label: 'Courses', value: '8', icon: FaBook },
    { label: 'Success Rate', value: '95%', icon: FaAward },
    { label: 'Experience', value: '15', icon: FaStar },
  ];

  const notifications = [
    { id: 1, title: 'Email Notifications', description: 'Receive email updates', enabled: true },
    { id: 2, title: 'Whatsapp Notifications', description: 'Receive Whatsapp updates', enabled: true },
    { id: 3, title: 'In app Notifications', description: 'Receive in app updates', enabled: true },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await teacherAPI.getMyProfile();
        const profile = response?.data?.data || response?.data || {};
        setFormData((prev) => ({
          ...prev,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          years_of_experience: profile.years_of_experience ?? '',
          qualifications: profile.qualifications || '',
          address: profile.address || '',
          professional_bio: profile.professional_bio || '',
          profile_picture: profile.profile_picture || '',
          subjects_taught: Array.isArray(profile.subjects_taught) ? profile.subjects_taught : [],
          subjects_input: Array.isArray(profile.subjects_taught) ? profile.subjects_taught.join(', ') : '',
        }));
        setProfilePicturePreview(profile.profile_picture || '');
      } catch (err) {
        showNotification(err?.message || 'Failed to load teacher profile', 'error');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Profile picture must be less than 5MB', 'error');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      showNotification('Only JPG, PNG, GIF or WEBP images are allowed', 'error');
      return;
    }

    setProfilePictureFile(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const subjects = formData.subjects_input
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = new FormData();
      payload.append('first_name', formData.first_name);
      payload.append('last_name', formData.last_name);
      payload.append('phone', formData.phone || '');
      payload.append('years_of_experience', formData.years_of_experience ?? '');
      payload.append('qualifications', formData.qualifications || '');
      payload.append('professional_bio', formData.professional_bio || '');
      payload.append('address', formData.address || '');
      payload.append('subjects_taught', subjects.join(','));
      if (profilePictureFile) {
        payload.append('profile_picture', profilePictureFile);
      }

      const response = await teacherAPI.updateMyProfile(payload);
      const updated = response?.data?.data || response?.data || {};
      const updatedSubjects = Array.isArray(updated.subjects_taught) ? updated.subjects_taught : subjects;

      setFormData((prev) => ({
        ...prev,
        first_name: updated.first_name || prev.first_name,
        last_name: updated.last_name || prev.last_name,
        email: updated.email || prev.email,
        phone: updated.phone || '',
        years_of_experience: updated.years_of_experience ?? '',
        qualifications: updated.qualifications || '',
        address: updated.address || '',
        professional_bio: updated.professional_bio || '',
        profile_picture: updated.profile_picture || prev.profile_picture,
        subjects_taught: updatedSubjects,
        subjects_input: updatedSubjects.join(', '),
      }));
      if (updated.profile_picture) {
        setProfilePicturePreview(updated.profile_picture);
      }
      setProfilePictureFile(null);

      dispatch(
        updateUser({
          first_name: updated.first_name,
          last_name: updated.last_name,
          phone: updated.phone,
          years_of_experience: updated.years_of_experience,
          qualifications: updated.qualifications,
          professional_bio: updated.professional_bio,
          profile_picture: updated.profile_picture,
          address: updated.address,
          subjects_taught: updatedSubjects,
        })
      );

      setIsEditing(false);
      showNotification('Profile updated successfully', 'success');
    } catch (err) {
      showNotification(err?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showNotification('Please fill all password fields', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New password and confirm password do not match', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authAPI.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showNotification('Password updated successfully', 'success');
    } catch (err) {
      showNotification(err?.message || 'Failed to update password', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="p-8">
      {notification && (
        <div className="mb-4">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Profile</h1>
        <p className="text-gray-600">Manage your professional profile and settings</p>
      </div>

      {isLoadingProfile && <p className="text-sm text-gray-600 mb-4">Loading profile...</p>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center mb-6">
              {profilePicturePreview || formData.profile_picture ? (
                <img
                  src={profilePicturePreview || formData.profile_picture}
                  alt="Teacher profile"
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold">
                  {(formData.first_name?.[0] || 'T').toUpperCase()}
                </div>
              )}
              <h3 className="font-bold text-lg text-gray-900">{formData.first_name} {formData.last_name}</h3>
              <p className="text-sm text-gray-600">{formData.email}</p>
              <p className="text-xs text-gray-500 mt-1">{user?.username}</p>
            </div>

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
                  activeTab === 'profile' ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CgProfile /> Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'security' ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <IoLockClosed /> Security
              </button>
              <button
                onClick={() => setActiveTab('notification')}
                className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'notification' ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaBell /> Notification
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
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
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="btn-primary px-4 py-2 disabled:opacity-60"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    onChange={handleProfilePictureChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
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
                    disabled
                    className="input-field bg-gray-50"
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
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
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
                    name="professional_bio"
                    value={formData.professional_bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Teaching (comma separated)</label>
                  <input
                    type="text"
                    name="subjects_input"
                    value={formData.subjects_input}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
            </div>
          )}

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

                    <button
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword}
                      className="btn-primary px-6 py-2 disabled:opacity-60"
                    >
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notification' && (
            <div className="card">
              <p className="text-2xl font-bold text-black mb-6">Notification Preferences</p>
              <div className="space-y-4">
                {notifications.map((notificationItem) => (
                  <div key={notificationItem.id} className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="text-large text-gray-900">{notificationItem.title}</h4>
                      <p className="text-sm text-gray-600">{notificationItem.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notificationItem.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
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
