import { useState, useEffect, useCallback } from 'react';
import { FaBook, FaCheck, FaCheckCircle, FaExclamationTriangle, FaGraduationCap, FaTimes, FaEdit, FaSave, FaEye, FaSearch, FaBan, FaUndo, FaClock, FaTimesCircle, FaKey, FaUserPlus } from 'react-icons/fa';
import { CgSandClock } from 'react-icons/cg';
import { BiLoader } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { teachersAPI } from '../../api';
import PulseLoader from '../../components/common/PulseLoader';

const AdminTeachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState({
    total_teachers: 0,
    active_teachers: 0,
    pending_teachers: 0,
    suspended_teachers: 0,
    rejected_teachers: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'approve', 'reject', 'suspend', 'reactivate', 'reset'
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    profile_picture: '',
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    qualifications: '',
    subjects_taught: '',
    years_of_experience: '',
    bio: '',
    address: '',
    language: 'English',
  });
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: 12,
      };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await teachersAPI.getAll(params);
      console.log('Teachers API response:', response.data);
      setTeachers(response.data.teachers || []);
      setTotalPages(response.data.pagination?.total_pages || 1);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, searchTerm]);

  const fetchStats = async () => {
    try {
      const response = await teachersAPI.getStats();
      setStats(response.data);
    } catch {
      console.error('Error fetching stats');
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchStats();
  }, [fetchTeachers]);

  const openModal = (type, teacher) => {
    setModalType(type);
    setSelectedTeacher(teacher);
    
    if (type === 'edit') {
      setEditFormData({
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
        contact_number: teacher.contact_number,
        qualifications: teacher.qualifications,
        subjects_taught: teacher.subjects_taught,
        years_of_experience: teacher.years_of_experience,
        bio: teacher.bio,
        address: teacher.address,
        language: teacher.language,
      });
    }
    
    setShowModal(true);
    setActionReason('');
    setAdminNotes('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    setModalType('');
  };

  const handleApprove = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await teachersAPI.approve(selectedTeacher.id);
      setSuccess('Teacher approved successfully!');
      closeModal();
      fetchTeachers();
      fetchStats();
    } catch {
      setError('Failed to approve teacher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!actionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await teachersAPI.reject(selectedTeacher.id, { reason: actionReason, admin_notes: adminNotes });
      setSuccess('Teacher rejected successfully!');
      setShowRejectModal(false);
      setActionReason('');
      fetchTeachers();
      fetchStats();
    } catch {
      setError('Failed to reject teacher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!actionReason.trim()) {
      setError('Please provide a suspension reason');
      return;
    }
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await teachersAPI.suspend(selectedTeacher.id, { reason: actionReason, admin_notes: adminNotes });
      setSuccess('Teacher suspended successfully!');
      setShowSuspendModal(false);
      setActionReason('');
      fetchTeachers();
      fetchStats();
    } catch {
      setError('Failed to suspend teacher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await teachersAPI.activate(selectedTeacher.id);
      setSuccess('Teacher reactivated successfully!');
      closeModal();
      fetchTeachers();
      fetchStats();
    } catch {
      setError('Failed to reactivate teacher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.keys(editFormData).forEach(key => {
        if (key !== 'profile_picture_preview' && editFormData[key]) {
          formData.append(key, editFormData[key]);
        }
      });
      
      await teachersAPI.update(selectedTeacher.id, formData);
      setSuccess('Teacher profile updated successfully!');
      setShowEditModal(false);
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update teacher profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await teachersAPI.resetPassword(selectedTeacher.id);
      setResetPasswordData({
        email: response.data.teacher.email,
        temporary_password: response.data.temporary_password,
      });
      setShowResetPasswordModal(true);
      setSuccess('Password reset successfully! Email sent to teacher.');
    } catch {
      setError('Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = () => {
    setEditFormData({
      first_name: selectedTeacher.first_name || '',
      last_name: selectedTeacher.last_name || '',
      email: selectedTeacher.email || '',
      contact_number: selectedTeacher.contact_number || '',
      qualifications: selectedTeacher.qualifications || '',
      subjects_taught: selectedTeacher.subjects_taught || '',
      years_of_experience: selectedTeacher.years_of_experience || '',
      bio: selectedTeacher.bio || '',
      address: selectedTeacher.address || '',
      language: selectedTeacher.language || '',
    });
    setShowEditModal(true);
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('first_name', createFormData.first_name);
      formData.append('last_name', createFormData.last_name);
      formData.append('email', createFormData.email);
      formData.append('contact_number', createFormData.contact_number);
      formData.append('qualifications', createFormData.qualifications);
      formData.append('subjects_taught', createFormData.subjects_taught);
      formData.append('years_of_experience', createFormData.years_of_experience);
      formData.append('bio', createFormData.bio);
      formData.append('address', createFormData.address);
      formData.append('language', createFormData.language);
      if (createFormData.profile_picture) {
        formData.append('profile_picture', createFormData.profile_picture);
      }

      await teachersAPI.create(formData);
      setSuccess('Teacher created successfully!');
      setShowCreateModal(false);
      setCreateFormData({
        profile_picture: '',
        first_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        qualifications: '',
        subjects_taught: '',
        years_of_experience: '',
        bio: '',
        address: '',
        language: 'English',
      });
      fetchTeachers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create teacher');
      console.error('Error creating teacher:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      APPROVED: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      REJECTED: 'bg-red-100 text-red-700',
      SUSPENDED: 'bg-orange-100 text-orange-700',
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusIcon = (status) => {
    const icons = {
      APPROVED: FaCheckCircle,
      PENDING: FaClock,
      REJECTED: FaTimesCircle,
      SUSPENDED: FaBan,
    };
    return icons[status] || FaClock;
  };

  const statsDisplay = [
    { label: 'Total Teachers', value: stats.total_teachers, icon: FaBook, color: 'bg-blue-100 text-blue-700', borderColor: 'border-blue-500' },
    { label: 'Active Teachers', value: stats.approved_teachers, icon: FaCheckCircle, color: 'bg-green-100 text-green-700', borderColor: 'border-green-500' },
    { label: 'Pending Approval', value: stats.pending_teachers, icon: CgSandClock, color: 'bg-yellow-100 text-yellow-700', borderColor: 'border-yellow-500' },
    { label: 'Suspended', value: stats.suspended_teachers, icon: FaExclamationTriangle, color: 'bg-red-100 text-red-700', borderColor: 'border-red-500' },
  ];

  // Loading state
  if (loading) {
    return <PulseLoader />;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Management</h1>
          <p className="text-gray-600">Approve and manage teacher accounts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FaUserPlus /> Add Verified Teacher
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <FaCheckCircle className="text-green-500 mt-0.5" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">
            <FaTimes />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <FaTimesCircle className="text-red-500 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((stat, index) => (
          <div key={index} className={`card border-l-4 ${stat.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-3xl ${stat.color} p-3 rounded-lg`}>
                <stat.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
          <div className="flex-1 max-w-md relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <BiLoader className="animate-spin text-4xl text-primary-600" />
              <span className="ml-3 text-gray-600">Loading teachers...</span>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-12">
              <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No teachers found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qualifications</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjects</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teachers.map((teacher) => {
                    const StatusIcon = getStatusIcon(teacher.status);
                    return (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {teacher.profile_picture ? (
                              <img 
                                src={teacher.profile_picture} 
                                alt={teacher.full_name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {teacher.first_name?.charAt(0)}{teacher.last_name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{teacher.full_name}</p>
                              <p className="text-sm text-gray-500">{teacher.years_of_experience} yrs exp</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <p className="text-gray-900">{teacher.email}</p>
                          <p className="text-gray-500">{teacher.contact_number || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <p className="text-gray-900">{teacher.qualifications || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects_taught ? teacher.subjects_taught.split(',').slice(0, 2).map((subject, index) => (
                              <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                                {subject.trim()}
                              </span>
                            )) : <span className="text-gray-500">N/A</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <p className="text-gray-900">{teacher.years_of_experience} years</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(teacher.status)}`}>
                            <StatusIcon className="text-xs" />
                            {teacher.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {teacher.created_at ? new Date(teacher.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openModal('view', teacher)}
                            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs flex items-center gap-1"
                          >
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === i + 1
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Teacher Details Modal */}
      {showModal && selectedTeacher && modalType === 'view' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Teacher Profile</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 pb-6 border-b">
                {selectedTeacher.profile_picture ? (
                  <img 
                    src={selectedTeacher.profile_picture} 
                    alt={selectedTeacher.full_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3">
                    {selectedTeacher.first_name?.charAt(0)}{selectedTeacher.last_name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTeacher.full_name}</h3>
                  <p className="text-gray-600">{selectedTeacher.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTeacher.status)}`}>
                      {selectedTeacher.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Teacher Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 font-medium">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900 font-medium">{selectedTeacher.contact_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                    <p className="text-gray-900 font-medium">{selectedTeacher.years_of_experience || 'N/A'} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Language</label>
                    <p className="text-gray-900 font-medium">{selectedTeacher.language || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Qualifications</label>
                    <p className="text-gray-900 font-medium">{selectedTeacher.qualifications || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Subjects Taught</label>
                    <p className="text-gray-900 font-medium">{selectedTeacher.subjects_taught || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Bio</label>
                    <p className="text-gray-900">{selectedTeacher.bio || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{selectedTeacher.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t flex-wrap">
                {selectedTeacher.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <FaCheck /> Approve Teacher
                    </button>
                    <button 
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                )}
                
                {selectedTeacher.status === 'APPROVED' && (
                  <>
                    <button 
                      onClick={() => setShowSuspendModal(true)}
                      disabled={actionLoading}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaBan /> Suspend
                    </button>
                    <button 
                      onClick={openEditModal}
                      disabled={actionLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                    <button 
                      onClick={handleResetPassword}
                      disabled={actionLoading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaKey /> Reset Password
                    </button>
                  </>
                )}
                
                {(selectedTeacher.status === 'SUSPENDED' || selectedTeacher.status === 'REJECTED') && (
                  <button 
                    onClick={handleReactivate}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaUndo /> Reactivate Teacher
                  </button>
                )}

                <button onClick={closeModal} className="px-6 btn-outline py-2">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && selectedTeacher && modalType === 'view' && showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Teacher Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={(e) => setEditFormData({...editFormData, last_name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="text"
                    value={editFormData.contact_number}
                    onChange={(e) => setEditFormData({...editFormData, contact_number: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={editFormData.years_of_experience}
                    onChange={(e) => setEditFormData({...editFormData, years_of_experience: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                  <textarea
                    value={editFormData.qualifications}
                    onChange={(e) => setEditFormData({...editFormData, qualifications: e.target.value})}
                    className="input-field"
                    rows="2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Taught</label>
                  <input
                    type="text"
                    value={editFormData.subjects_taught}
                    onChange={(e) => setEditFormData({...editFormData, subjects_taught: e.target.value})}
                    className="input-field"
                    placeholder="Math, Science, English"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                    className="input-field"
                    rows="3"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    className="input-field"
                    rows="2"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" disabled={actionLoading} className="flex-1 btn-primary py-3">
                  <FaSave className="inline mr-2" /> Save Changes
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 btn-outline py-3">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Teacher</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting <strong>{selectedTeacher.full_name}</strong>:
            </p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="input-field w-full h-24"
              placeholder="Enter rejection reason..."
            />
            <div className="mt-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input-field w-full h-16"
                placeholder="Internal notes..."
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-medium"
              >
                Confirm Rejection
              </button>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="px-4 btn-outline py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Suspend Teacher</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for suspending <strong>{selectedTeacher.full_name}</strong>:
            </p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="input-field w-full h-24"
              placeholder="Enter suspension reason..."
            />
            <div className="mt-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input-field w-full h-16"
                placeholder="Internal notes..."
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSuspend}
                disabled={actionLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 font-medium"
              >
                Confirm Suspension
              </button>
              <button 
                onClick={() => setShowSuspendModal(false)}
                className="px-4 btn-outline py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && resetPasswordData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Password Reset Successful</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700"><strong>Temporary Password:</strong></p>
              <p className="text-lg font-mono font-bold text-blue-900 mt-2 break-all">{resetPasswordData.temporary_password}</p>
            </div>
            <p className="text-gray-600 text-sm mb-4">Share this password with the teacher. They should change it on their first login.</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setResetPasswordData(null);
                }}
                className="flex-1 btn-primary py-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Teacher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Create Verified Teacher</h3>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                <div className="flex items-center gap-4">
                  {createFormData.profile_picture_preview ? (
                    <img 
                      src={createFormData.profile_picture_preview} 
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaGraduationCap className="text-2xl text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setCreateFormData({...createFormData, profile_picture: file, profile_picture_preview: URL.createObjectURL(file)});
                      }
                    }}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={createFormData.first_name}
                    onChange={(e) => setCreateFormData({...createFormData, first_name: e.target.value})}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={createFormData.last_name}
                    onChange={(e) => setCreateFormData({...createFormData, last_name: e.target.value})}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                  className="input-field w-full"
                  required
                />
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    value={createFormData.contact_number}
                    onChange={(e) => setCreateFormData({...createFormData, contact_number: e.target.value})}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                  <input
                    type="number"
                    value={createFormData.years_of_experience}
                    onChange={(e) => setCreateFormData({...createFormData, years_of_experience: e.target.value})}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications *</label>
                <input
                  type="text"
                  value={createFormData.qualifications}
                  onChange={(e) => setCreateFormData({...createFormData, qualifications: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., B.Ed (Hons) Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjects Taught *</label>
                <input
                  type="text"
                  value={createFormData.subjects_taught}
                  onChange={(e) => setCreateFormData({...createFormData, subjects_taught: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., Mathematics, Science, English"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
                <textarea
                  value={createFormData.bio}
                  onChange={(e) => setCreateFormData({...createFormData, bio: e.target.value})}
                  className="input-field w-full h-20"
                  placeholder="Teacher biography"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    value={createFormData.address}
                    onChange={(e) => setCreateFormData({...createFormData, address: e.target.value})}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
                  <select
                    value={createFormData.language}
                    onChange={(e) => setCreateFormData({...createFormData, language: e.target.value})}
                    className="input-field w-full"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <BiLoader className="animate-spin" /> : <FaSave />}
                  {actionLoading ? 'Creating...' : 'Create Teacher'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;
