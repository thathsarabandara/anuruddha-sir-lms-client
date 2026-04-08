import { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaGraduationCap, FaTimes, FaUserGraduate, FaTimesCircle, FaClock, FaEye, FaCheck, FaBan, FaUndo, FaUserPlus, FaEdit, FaKey } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';

import { studentAPI } from '../../api/student';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Individual loading states for each action
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
      showNotification(err.response?.data?.message || 'Failed to fetch students', 'error');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    // Fetch students when search, filter, or page changes
    fetchStudents();
  }, [fetchStudents]);

  const handleViewDetails = async (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleApprove = async () => {
    setApproveLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.activateStudent(selectedStudent.id);
      
      // Update local state
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, account_status: { ...s.account_status, is_active: true, is_banned: false } } : s
      ));
      
      setSuccess('Student approved and activated successfully!');
      showNotification('Student approved and activated successfully!', 'success');
      setShowDetailsModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve student');
      showNotification(err.response?.data?.message || 'Failed to approve student', 'error');
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      showNotification('Please provide a reason for rejection', 'error');
      return;
    }
    
    setRejectLoading(true);
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
      showNotification('Student rejected successfully!', 'success');
      setShowRejectModal(false);
      setreason('');
      setShowDetailsModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject student');
      showNotification(err.response?.data?.message || 'Failed to reject student', 'error');
    } finally {
      setRejectLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      setError('Please provide a reason for suspension');
      showNotification('Please provide a reason for suspension', 'error');
      return;
    }
    
    setSuspendLoading(true);
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
      showNotification('Student suspended successfully!', 'success');
      setShowSuspendModal(false);
      setSuspendReason('');
      setShowDetailsModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to suspend student');
      showNotification(err.response?.data?.message || 'Failed to suspend student', 'error');
    } finally {
      setSuspendLoading(false);
    }
  };

  const handleActivate = async () => {
    setActivateLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.activateStudent(selectedStudent.id);
      
      // Update local state
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, account_status: { ...s.account_status, is_active: true, is_banned: false } } : s
      ));
      
      setSuccess('Student activated successfully!');
      showNotification('Student activated successfully!', 'success');
      setShowDetailsModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to activate student');
    } finally {
      setActivateLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!createFormData.first_name.trim() || !createFormData.last_name.trim() || !createFormData.email.trim()) {
      setError('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }
    
    setCreateLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('first_name', createFormData.first_name);
      formData.append('last_name', createFormData.last_name);
      formData.append('email', createFormData.email);
      formData.append('phone', createFormData.phone);
      if (createFormData.date_of_birth) {
        formData.append('date_of_birth', createFormData.date_of_birth);
      }
      formData.append('grade_level', createFormData.grade_level);
      formData.append('school', createFormData.school);
      formData.append('address', createFormData.address);
      formData.append('parent_name', createFormData.parent_name);
      formData.append('parent_contact', createFormData.parent_contact);
      
      // Add profile picture if provided
      if (createFormData.profile_picture) {
        formData.append('profile_picture', createFormData.profile_picture);
      }
      
      const response = await studentAPI.createStudent(formData);
      
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
      setCreateLoading(false);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    
    setEditLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('first_name', editFormData.first_name);
      formData.append('last_name', editFormData.last_name);
      formData.append('phone', editFormData.phone);
      formData.append('date_of_birth', editFormData.date_of_birth);
      formData.append('grade_level', editFormData.grade_level);
      formData.append('school', editFormData.school);
      formData.append('address', editFormData.address);
      formData.append('parent_name', editFormData.parent_name);
      formData.append('parent_contact', editFormData.parent_contact);
      
      // Add profile picture only if a new one was selected
      if (editFormData.profile_picture) {
        formData.append('profile_picture', editFormData.profile_picture);
      }
      
      await studentAPI.editStudentDetails(selectedStudent.id, formData);
      
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
      setEditLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetPasswordLoading(true);
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
      setResetPasswordLoading(false);
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


  const studentsMetricsConfig = [
    {
      label: 'Total Students',
      statsKey: 'total',
      icon: FaUserGraduate,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'All registered students',
    },
    {
      label: 'Active Students',
      statsKey: 'active',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Currently enrolled',
    },
    {
      label: 'Pending Approval',
      statsKey: 'pending',
      icon: BiLoader,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Awaiting verification',
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
      {/* Notification Component */}
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm">
          <Notification 
            {...notification} 
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
        metricsConfig={studentsMetricsConfig}
      />

      {/* Students Table with Integrated Filters */}
      <DataTable
        data={students}
        columns={[
          {
            key: 'full_name',
            label: 'Student',
            searchable: true,
            render: (value, student) => (
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
            ),
          },
          {
            key: 'email',
            label: 'Contact',
            searchable: true,
            render: (value, student) => (
              <div className="text-sm">
                <p className="text-gray-900">{student.email}</p>
                <p className="text-gray-500">{student.phone}</p>
              </div>
            ),
          },
          {
            key: 'school',
            label: 'School & Grade',
            searchable: true,
            render: (value, student) => (
              <div className="text-sm">
                <p className="text-gray-900">{student.school}</p>
                <p className="text-gray-500">Grade {student.grade_level}</p>
              </div>
            ),
          },
          {
            key: 'parent_name',
            label: 'Parent Info',
            render: (value, student) => (
              <div className="text-sm">
                <p className="text-gray-900">{student.parent_name}</p>
                <p className="text-gray-500">{student.parent_contact}</p>
              </div>
            ),
          },
          {
            key: 'account_status',
            label: 'Status',
            render: (value) => {
              const StatusIcon = getStatusIcon(value);
              return (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(value)}`}>
                  <StatusIcon className="text-xs" />
                  {value.is_active && !value.is_banned && 'Active'}
                  {value.is_banned && 'Banned'}
                  {!value.is_active && !value.is_banned && 'Pending'}
                </span>
              );
            },
          },
          {
            key: 'created_at',
            label: 'Join Date',
            render: (value) => <p className="text-sm text-gray-600">{new Date(value).toLocaleDateString()}</p>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, student) => (
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => handleViewDetails(student)}
                  className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs flex items-center gap-1 transition whitespace-nowrap"
                  title="View details"
                >
                  <FaEye /> View
                </button>
                
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setResetPasswordLoading(false);
                    handleResetPassword();
                  }}
                  disabled={resetPasswordLoading}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs flex items-center gap-1 transition disabled:opacity-50 whitespace-nowrap"
                  title="Reset password"
                >
                  <FaKey /> Reset
                </button>
              </div>
            ),
          },
        ]}
        config={{
          itemsPerPage: 10,
          searchPlaceholder: 'Search by name, email, phone, school...',
          hideSearch: false,
          emptyMessage: 'No students found',
          searchValue: searchTerm,
          onSearchChange: (value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          },
          statusFilterLabel: 'Filter by Status',
          statusFilterOptions: [
            { label: 'All Statuses', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Pending', value: 'pending' },
            { label: 'Banned', value: 'banned' },
          ],
          statusFilterValue: filterStatus,
          onStatusFilterChange: (value) => {
            setFilterStatus(value);
            setCurrentPage(1);
          },
        }}
        loading={loading}
      />

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
                    <ButtonWithLoader 
                      label="Approve Student"
                      loadingLabel="Approving..."
                      isLoading={approveLoading}
                      onClick={() => handleApprove(selectedStudent.id)}
                      icon={<FaCheck />}
                      variant="success"
                      fullWidth
                    />
                    <ButtonWithLoader 
                      label="Reject"
                      loadingLabel="Processing..."
                      isLoading={rejectLoading}
                      onClick={() => setShowRejectModal(true)}
                      icon={<FaTimes />}
                      variant="danger"
                      fullWidth
                    />
                  </>
                )}
                
                {selectedStudent.account_status.is_active === true && selectedStudent.account_status.is_banned === false && (
                  <>
                    <ButtonWithLoader 
                      label="Suspend Student"
                      loadingLabel="Suspending..."
                      isLoading={suspendLoading}
                      onClick={() => setShowSuspendModal(true)}
                      icon={<FaBan />}
                      variant="warning"
                      fullWidth
                    />
                    <ButtonWithLoader 
                      label="Edit Details"
                      loadingLabel="Preparing..."
                      isLoading={editLoading}
                      onClick={openEditModal}
                      icon={<FaEdit />}
                      variant="info"
                      fullWidth
                    />
                    <ButtonWithLoader 
                      label="Reset Password"
                      loadingLabel="Resetting..."
                      isLoading={resetPasswordLoading}
                      onClick={() => handleResetPassword(selectedStudent.id)}
                      icon={<FaKey />}
                      variant="secondary"
                      fullWidth
                    />
                  </>
                )}
                
                {(selectedStudent.account_status.is_active === true && selectedStudent.account_status.is_banned === true) && (
                  <>
                    <ButtonWithLoader 
                      label="Activate Student"
                      loadingLabel="Activating..."
                      isLoading={activateLoading}
                      onClick={() => handleActivate(selectedStudent.id)}
                      icon={<FaUndo />}
                      variant="success"
                      fullWidth
                    />
                    <ButtonWithLoader 
                      label="Edit Details"
                      loadingLabel="Preparing..."
                      isLoading={editLoading}
                      onClick={openEditModal}
                      icon={<FaEdit />}
                      variant="info"
                      fullWidth
                    />
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
              <ButtonWithLoader
                label="Confirm Reject"
                loadingLabel="Rejecting..."
                isLoading={rejectLoading}
                onClick={handleReject}
                disabled={!reason.trim()}
                variant="danger"
                fullWidth
              />
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setreason('');
                }}
                disabled={rejectLoading}
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
              <ButtonWithLoader
                label="Confirm Suspend"
                loadingLabel="Suspending..."
                isLoading={suspendLoading}
                onClick={handleSuspend}
                disabled={!suspendReason.trim()}
                variant="warning"
                fullWidth
              />
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendReason('');
                }}
                disabled={suspendLoading}
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
                <ButtonWithLoader
                  type="submit"
                  label="Create Student"
                  loadingLabel="Creating..."
                  isLoading={createLoading}
                  variant="success"
                  fullWidth
                />
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createLoading}
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
                <ButtonWithLoader
                  type="submit"
                  label="Update Student"
                  loadingLabel="Updating..."
                  isLoading={editLoading}
                  variant="success"
                  fullWidth
                />
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
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

export default AdminStudents;
