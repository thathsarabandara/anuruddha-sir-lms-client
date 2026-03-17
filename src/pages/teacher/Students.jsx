import { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaGraduationCap, FaTimes, FaUserGraduate, FaTimesCircle, FaClock, FaSearch, FaEye, FaCheck, FaBan, FaUndo, FaUserPlus, FaEdit, FaKey } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import Notification from '../../components/common/Notification';
import StatCard from '../../components/common/StatCard';
import { studentAPI } from '../../api/student';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    page_size: 10,
    has_next: false,
    has_previous: false,
  });
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState(null);
  const [reason, setreason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [createFormData, setCreateFormData] = useState({
    profile_picture: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    grade_level: '',
    school: '',
    address: '',
    parent_name: '',
    parent_contact: '',
    language: 'English',
    password: '',
  });
  const [editFormData, setEditFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const fetchStats = async () => {
    try {
      const response = await studentAPI.getStudentStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching student stats:', error);
    }
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentAPI.getStudents(searchTerm, filterStatus, currentPage, 10);
      setStudents(response.data.data.students || []);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, currentPage]);

  useEffect(() => {
    fetchStats();
    fetchStudents();
  }, [fetchStudents]);


  const handleViewDetails = async (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.activateStudent(selectedStudent.id);
      
      // Update local state
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, account_status: { ...s.account_status, is_active: true, is_banned: false } } : s
      ));
      
      setSuccess('Student approved and activated successfully!');
      setShowDetailsModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.banStudent(selectedStudent.id, {
        reason: reason,
        ban_duration_hours: 72
      });
      
      // Update local state
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, status: 'banned' } : s
      ));
      
      setSuccess('Student rejected successfully!');
      setShowRejectModal(false);
      setreason('');
      setShowDetailsModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      setError('Please provide a reason for suspension');
      return;
    }
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.banStudent(selectedStudent.id, {
        reason: suspendReason,
        ban_duration_hours: 72, // 3 days suspension
      });
      
      // Update local state
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, account_status: { ...s.account_status, is_active: false, is_banned: true } } : s
      ));
      
      setSuccess('Student suspended successfully!');
      setShowSuspendModal(false);
      setSuspendReason('');
      setShowDetailsModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to suspend student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.activateStudent(selectedStudent.id);
      
      // Update local state
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, account_status: { ...s.account_status, is_active: true, is_banned: false } } : s
      ));
      
      setSuccess('Student activated successfully!');
      setShowDetailsModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to activate student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!createFormData.first_name.trim() || !createFormData.last_name.trim() || !createFormData.email.trim()) {
      setError('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await studentAPI.createStudent({
        first_name: createFormData.first_name,
        last_name: createFormData.last_name,
        email: createFormData.email,
        phone: createFormData.phone,
        date_of_birth: createFormData.date_of_birth || undefined,
        grade_level: createFormData.grade_level,
        school: createFormData.school,
        address: createFormData.address,
        parent_name: createFormData.parent_name,
        parent_contact: createFormData.parent_contact,
      });
      
      // Add new student to list
      setStudents([...students, response.data]);
      
      setSuccess('Student created successfully! Credentials sent to ' + createFormData.email);
      setShowCreateModal(false);
      setCreateFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        grade_level: '',
        school: '',
        address: '',
        parent_name: '',
        parent_contact: '',
        language: 'English',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.editStudentDetails(selectedStudent.id, {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        phone: editFormData.phone,
        date_of_birth: editFormData.date_of_birth,
        grade_level: editFormData.grade_level,
        school: editFormData.school,
        address: editFormData.address,
        parent_name: editFormData.parent_name,
        parent_contact: editFormData.parent_contact,
      });
      
      // Update in students list
      const updatedStudent = {
        ...selectedStudent,
        ...editFormData,
        full_name: `${editFormData.first_name} ${editFormData.last_name}`,
      };
      
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...editFormData } : s));
      setSelectedStudent(updatedStudent);
      setSuccess('Student details updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await studentAPI.resetStudentPassword(selectedStudent.id, true);
      
      setResetPasswordData({
        email: response.data.email,
        temporary_password: response.data.temporary_password,
      });
      setShowResetPasswordModal(true);
      setSuccess('Password reset successfully! Email sent to student.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = () => {
    setEditFormData({
      first_name: selectedStudent.first_name,
      last_name: selectedStudent.last_name,
      email: selectedStudent.email,
      phone: selectedStudent.phone,
      date_of_birth: selectedStudent.date_of_birth,
      grade_level: selectedStudent.grade_level,
      school: selectedStudent.school,
      address: selectedStudent.address,
      parent_name: selectedStudent.parent_name,
      parent_contact: selectedStudent.parent_contact,
      language: selectedStudent.language,
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    if (status.is_active && !status.is_banned) return 'bg-green-100 text-green-700'; // Active
    if (!status.is_active && !status.is_banned) return 'bg-yellow-100 text-yellow-700'; // Pending
    if (status.is_banned) return 'bg-red-100 text-red-700'; // Banned
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

  const statsData = [
    { 
      label: 'Total Students', 
      value: stats?.total_students || 0, 
      icon: FaUserGraduate, 
      color: 'bg-blue-100 text-blue-700',
      borderColor: 'border-blue-500'
    },
    { 
      label: 'Active Students', 
      value: stats?.active_students || 0, 
      icon: FaCheckCircle, 
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-500'
    },
    { 
      label: 'Pending Approval', 
      value: stats?.pending_students || 0, 
      icon: BiLoader, 
      color: 'bg-yellow-100 text-yellow-700',
      borderColor: 'border-yellow-500'
    },
    { 
      label: 'Banned', 
      value: stats?.banned_students || 0, 
      icon: FaExclamationTriangle, 
      color: 'bg-red-100 text-red-700',
      borderColor: 'border-red-500'
    },
  ];

  const teacherStudentsMetricsConfig = [
    {
      label: 'Total Students',
      statsKey: 'total',
      icon: FaUserGraduate,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'All students enrolled',
    },
    {
      label: 'Active Students',
      statsKey: 'active',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Currently active',
    },
    {
      label: 'Pending Approval',
      statsKey: 'pending',
      icon: BiLoader,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Awaiting action',
    },
    {
      label: 'Banned',
      statsKey: 'banned',
      icon: FaExclamationTriangle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      description: 'Suspended accounts',
    },
  ];

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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
          <p className="text-gray-600">Manage all student accounts and approvals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FaUserPlus /> Add Verified Student
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
      <StatCard 
        stats={{
          total: (stats?.total_students || 0).toString(),
          active: (stats?.active_students || 0).toString(),
          pending: (stats?.pending_students || 0).toString(),
          banned: (stats?.banned_students || 0).toString(),
        }}
        metricsConfig={teacherStudentsMetricsConfig}
      />

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
          <div className="flex-1 max-w-md relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, school..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={filterStatus} 
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }} 
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <BiLoader className="animate-spin text-4xl text-primary-600" />
              <span className="ml-3 text-gray-600">Loading students...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <FaUserGraduate className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No students found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">School & Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Info</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => {
                    const StatusIcon = getStatusIcon(student.account_status);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {student.profile_picture ? (
                              <img 
                                src={student.profile_picture} 
                                alt={student.full_name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p>
                              <p className="text-sm text-gray-500">{student.grade_level}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <p className="text-gray-900">{student.email}</p>
                          <p className="text-gray-500">{student.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <p className="text-gray-900">{student.school}</p>
                          <p className="text-gray-500">Grade {student.grade_level}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <p className="text-gray-900">{student.parent_name}</p>
                          <p className="text-gray-500">{student.parent_contact}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(student.account_status)}`}>
                            <StatusIcon className="text-xs" />
                            {student.account_status.is_active && !student.account_status.is_banned && 'Active'}
                            {student.account_status.is_banned && 'Banned'}
                            {!student.account_status.is_active && !student.account_status.is_banned && 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(student.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            <button
                              onClick={() => handleViewDetails(student)}
                              className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs flex items-center gap-1 transition whitespace-nowrap"
                              title="View details"
                            >
                              <FaEye /> View
                            </button>
                            
                            {/* Reset Password button - always available */}
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                handleResetPassword();
                              }}
                              disabled={actionLoading}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs flex items-center gap-1 transition disabled:opacity-50 whitespace-nowrap"
                              title="Reset password"
                            >
                              <FaKey /> Reset
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * pagination.page_size) + 1} to {Math.min(currentPage * pagination.page_size, pagination.total_count)} of {pagination.total_count} students
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.has_previous}
                      className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {[...Array(pagination.total_pages)].map((_, i) => (
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
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.has_next}
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

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
              <button 
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedStudent(null);
                }} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 pb-6 border-b">
                {selectedStudent.profile_picture ? (
                  <img 
                    src={selectedStudent.profile_picture} 
                    alt={selectedStudent.full_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {selectedStudent.first_name?.charAt(0)}{selectedStudent.last_name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedStudent.full_name}</h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.account_status)}`}>
                      {selectedStudent.account_status.is_active && !selectedStudent.account_status.is_banned && 'Active'}
                      {!selectedStudent.account_status.is_active && !selectedStudent.account_status.is_banned && 'Pending'}
                      {selectedStudent.account_status.is_banned && 'Banned'}
                    </span>
                    {selectedStudent.email_verified && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Email Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900 font-medium">
                      {selectedStudent.date_of_birth ? new Date(selectedStudent.date_of_birth).toLocaleDateString() : 'N/A'}
                      {selectedStudent.age && ` (${selectedStudent.age} years)`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Grade Level</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.grade_level}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">School</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.school}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Language</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.language}</p>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Parent Name</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.parent_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Parent Contact</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.parent_contact}</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedStudent.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedStudent.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <p className="text-gray-900 font-medium">
                      {selectedStudent.account_status.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.username}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                { selectedStudent.account_status.is_active === false && selectedStudent.account_status.is_banned === false && (
                  <>
                    <button 
                      onClick={() => handleApprove(selectedStudent.id)}
                      disabled={actionLoading}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <FaCheck /> Approve Student
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
                
                {selectedStudent.account_status.is_active === true && selectedStudent.account_status.is_banned === false && (
                  <>
                    <button 
                      onClick={() => setShowSuspendModal(true)}
                      disabled={actionLoading}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaBan /> Suspend Student
                    </button>
                    <button 
                      onClick={openEditModal}
                      disabled={actionLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit Details
                    </button>
                    <button 
                      onClick={() => handleResetPassword(selectedStudent.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaKey /> Reset Password
                    </button>
                  </>
                )}
                
                {(selectedStudent.account_status.is_active === true && selectedStudent.account_status.is_banned === true) && (
                  <>
                    <button 
                      onClick={() => handleActivate(selectedStudent.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaUndo /> Activate Student
                    </button>
                    <button 
                      onClick={openEditModal}
                      disabled={actionLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit Details
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Student</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting <strong>{selectedStudent.full_name}</strong>:
            </p>
            <textarea
              value={reason}
              onChange={(e) => setreason(e.target.value)}
              className="input-field w-full h-24"
              placeholder="Enter rejection reason..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Ban will be permanent. You can activate the student later if needed.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={actionLoading || !reason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setreason('');
                }}
                disabled={actionLoading}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Suspend Student</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for suspending <strong>{selectedStudent.full_name}</strong>:
            </p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="input-field w-full h-24"
              placeholder="Enter suspension reason..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSuspend}
                disabled={actionLoading || !suspendReason.trim()}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Confirm Suspend'}
              </button>
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendReason('');
                }}
                disabled={actionLoading}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Student Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Create Verified Student</h3>
            <button 
              onClick={() => setShowCreateModal(false)} 
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleCreateStudent} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={createFormData.first_name}
                  onChange={(e) => setCreateFormData({...createFormData, first_name: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={createFormData.last_name}
                  onChange={(e) => setCreateFormData({...createFormData, last_name: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={createFormData.phone}
                  onChange={(e) => setCreateFormData({...createFormData, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={createFormData.date_of_birth}
                  onChange={(e) => setCreateFormData({...createFormData, date_of_birth: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
                <select
                  required
                  value={createFormData.grade_level}
                  onChange={(e) => setCreateFormData({...createFormData, grade_level: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select Grade Level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
                <input
                  type="text"
                  required
                  value={createFormData.school}
                  onChange={(e) => setCreateFormData({...createFormData, school: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  required
                  value={createFormData.address}
                  onChange={(e) => setCreateFormData({...createFormData, address: e.target.value})}
                  className="input-field"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name *</label>
                <input
                  type="text"
                  required
                  value={createFormData.parent_name}
                  onChange={(e) => setCreateFormData({...createFormData, parent_name: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact *</label>
                <input
                  type="tel"
                  required
                  value={createFormData.parent_contact}
                  onChange={(e) => setCreateFormData({...createFormData, parent_contact: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={createFormData.language}
                  onChange={(e) => setCreateFormData({...createFormData, language: e.target.value})}
                  className="input-field"
                >
                  <option value="English">English</option>
                  <option value="Sinhala">Sinhala</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                  className="input-field"
                />
              </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {actionLoading ? 'Creating...' : 'Create Student'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={actionLoading}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Student Details</h3>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditStudent} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                <div className="flex items-center gap-4">
                  {editFormData.profile_picture_preview ? (
                    <img 
                      src={editFormData.profile_picture_preview} 
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : selectedStudent.profile_picture ? (
                    <img 
                      src={selectedStudent.profile_picture} 
                      alt="Current"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaGraduationCap className="text-2xl text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditFormData({...editFormData, profile_picture: file, profile_picture_preview: URL.createObjectURL(file)});
                        }
                      }}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current picture</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={(e) => setEditFormData({...editFormData, last_name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editFormData.date_of_birth}
                    onChange={(e) => setEditFormData({...editFormData, date_of_birth: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                  <input
                    type="text"
                    value={editFormData.grade_level}
                    onChange={(e) => setEditFormData({...editFormData, grade_level: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input
                    type="text"
                    value={editFormData.school}
                    onChange={(e) => setEditFormData({...editFormData, school: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    className="input-field"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={editFormData.parent_name}
                    onChange={(e) => setEditFormData({...editFormData, parent_name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact</label>
                  <input
                    type="tel"
                    value={editFormData.parent_contact}
                    onChange={(e) => setEditFormData({...editFormData, parent_contact: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={editFormData.language}
                    onChange={(e) => setEditFormData({...editFormData, language: e.target.value})}
                    className="input-field"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {actionLoading ? 'Updating...' : 'Update Student'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={actionLoading}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && resetPasswordData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Password Reset Successful</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                A new password has been generated and sent to:
              </p>
              <p className="text-gray-900 font-medium mb-3">{resetPasswordData.email}</p>
              <div className="bg-white border border-blue-300 rounded p-3">
                <p className="text-xs text-gray-600 mb-1">Temporary Password:</p>
                <p className="text-lg font-mono font-bold text-blue-700 break-all">
                  {resetPasswordData.temporary_password}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              The student has been notified via email with instructions to change their password.
            </p>
            <button
              onClick={() => {
                setShowResetPasswordModal(false);
                setResetPasswordData(null);
              }}
              className="w-full btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
