import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaGraduationCap, FaChalkboardTeacher, FaCheck, FaTimes, FaBook, FaCamera, FaCalendar } from 'react-icons/fa';
import { authAPI } from '../../api';
import { ROUTES, getAuthRoute } from '../../utils/constants';
import { isValidEmail, isValidPhone } from '../../utils/helpers';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'STUDENT';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: roleParam.toUpperCase(),
    // Profile picture
    profilePicture: null,
    profilePicturePreview: null,
    // Teacher-specific fields
    qualifications: '',
    subjectsTaught: '',
    yearsOfExperience: '',
    bio: '',
    address: '',
    language: '',
    // Student-specific fields
    dateOfBirth: '',
    gradeLevel: '',
    school: '',
    parentName: '',
    parentContact: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentTab, setCurrentTab] = useState(1); // Tab 1: Basic Info, Tab 2: Security, Tab 3: Teacher Info (if teacher)

  useEffect(() => {
    const role = roleParam.toUpperCase();
    if (['STUDENT', 'TEACHER'].includes(role)) {
      setFormData(prev => ({ ...prev, role }));
    } else {
      navigate(`${ROUTES.REGISTER}?role=student`, { replace: true });
    }
  }, [roleParam, navigate]);



  const roles = [
    { 
      value: 'STUDENT', 
      label: 'Student', 
      icon: FaGraduationCap, 
      gradient: 'from-blue-500 to-blue-600',
      image: '/assets/images/auth/student-register.png',
      title: 'Start Your Learning Journey',
      subtitle: 'Join thousands of successful students'
    },
    { 
      value: 'TEACHER', 
      label: 'Teacher', 
      icon: FaChalkboardTeacher, 
      gradient: 'from-green-500 to-green-600',
      image: '/assets/images/auth/teacher-register.png',
      title: 'Share Your Knowledge',
      subtitle: 'Empower students with your expertise'
    }
  ];

  const currentRole = roles.find(r => r.value === formData.role) || roles[0];

  const gradientStyles = {
    'from-blue-500 to-blue-600': 'linear-gradient(to right, #3b82f6, #2563eb)',
    'from-green-500 to-green-600': 'linear-gradient(to right, #10b981, #059669)',
  };

  // Helper to get input state (valid/invalid/default)
  const getInputState = (fieldName) => {
    const value = formData[fieldName];
    const error = fieldErrors[fieldName];
    
    if (!value) return 'default';
    if (error) return 'invalid';
    return 'valid';
  };

  const getInputClassName = (fieldName) => {
    const state = getInputState(fieldName);
    const baseClasses = 'block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-all';
    
    if (state === 'invalid') {
      return `${baseClasses} border-red-500 focus:ring-red-500 focus:border-transparent bg-red-50`;
    }
    if (state === 'valid') {
      return `${baseClasses} border-green-500 focus:ring-green-500 focus:border-transparent bg-green-50`;
    }
    return `${baseClasses} border-gray-300 focus:ring-gray-900 focus:border-transparent`;
  };

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /(?=.*[a-z])/.test(password),
      uppercase: /(?=.*[A-Z])/.test(password),
      number: /(?=.*\d)/.test(password),
      special: /(?=.*[@$!%*?&#])/.test(password),
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    
    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength === 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength === 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    
    // Live validation
    validateField(name, value);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, profilePicture: 'File size must be less than 5MB' }));
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setFieldErrors(prev => ({ ...prev, profilePicture: 'Only image files are allowed' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: reader.result,
        }));
        setFieldErrors(prev => ({ ...prev, profilePicture: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!isValidEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!isValidPhone(value)) {
          error = 'Please enter a valid Sri Lankan phone number (e.g., 0771234567)';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        } else if (!/(?=.*[@$!%*?&#])/.test(value)) {
          error = 'Password must contain at least one special character (@$!%*?&#)';
        }
        // Also validate confirm password if it has value
        if (formData.confirmPassword) {
          validateField('confirmPassword', formData.confirmPassword);
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'qualifications':
        if (formData.role === 'TEACHER' && !value.trim()) {
          error = 'Qualifications are required for teachers';
        } else if (value.trim().length > 0 && value.trim().length < 5) {
          error = 'Qualifications must be at least 5 characters';
        }
        break;

      case 'subjectsTaught':
        if (formData.role === 'TEACHER' && !value.trim()) {
          error = 'Please specify the subjects you teach';
        }
        break;

      case 'yearsOfExperience':
        if (formData.role === 'TEACHER' && value) {
          const experience = parseInt(value);
          if (isNaN(experience) || experience < 0 || experience > 70) {
            error = 'Please enter a valid number of years (0-70)';
          }
        }
        break;

      case 'bio':
        if (formData.role === 'TEACHER' && value.trim().length > 0 && value.trim().length < 10) {
          error = 'Bio must be at least 10 characters';
        }
        break;

      case 'address':
        if (formData.role === 'TEACHER' && value.trim().length > 0 && value.trim().length < 5) {
          error = 'Address must be at least 5 characters';
        } else if (formData.role === 'STUDENT' && !value.trim()) {
          error = 'Address is required';
        }
        break;

      case 'dateOfBirth':
        if (formData.role === 'STUDENT' && !value) {
          error = 'Date of birth is required';
        }
        break;

      case 'gradeLevel':
        if (formData.role === 'STUDENT' && !value.trim()) {
          error = 'Grade level is required';
        }
        break;

      case 'school':
        if (formData.role === 'STUDENT' && !value.trim()) {
          error = 'School is required';
        }
        break;

      case 'parentName':
        if (formData.role === 'STUDENT' && !value.trim()) {
          error = 'Parent name is required';
        }
        break;

      case 'parentContact':
        if (formData.role === 'STUDENT' && !value.trim()) {
          error = 'Parent contact is required';
        } else if (formData.role === 'STUDENT' && value && !isValidPhone(value)) {
          error = 'Please enter a valid phone number';
        }
        break;

      default:
        break;
    }

    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    return error === '';
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid Sri Lankan phone number';
    }

    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[@$!%*?&#])/.test(formData.password)) {
      errors.password = 'Password must contain at least one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Profile picture validation
    if (!formData.profilePicture) {
      errors.profilePicture = 'Profile picture is required';
    }

    // Teacher-specific validation
    if (formData.role === 'TEACHER') {
      if (!formData.qualifications.trim()) {
        errors.qualifications = 'Qualifications are required';
      }
      if (!formData.subjectsTaught.trim()) {
        errors.subjectsTaught = 'Subjects taught are required';
      }
      if (!formData.yearsOfExperience) {
        errors.yearsOfExperience = 'Years of experience is required';
      } else {
        const experience = parseInt(formData.yearsOfExperience);
        if (isNaN(experience) || experience < 0 || experience > 70) {
          errors.yearsOfExperience = 'Please enter a valid number of years';
        }
      }
      if (!formData.bio.trim()) {
        errors.bio = 'Professional bio is required';
      }
      if (!formData.address.trim()) {
        errors.address = 'Address is required';
      }
      if (!formData.language) {
        errors.language = 'Language is required';
      }
    }

    // Student-specific validation
    if (formData.role === 'STUDENT') {
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
      }
      if (!formData.gradeLevel.trim()) {
        errors.gradeLevel = 'Grade level is required';
      }
      if (!formData.school.trim()) {
        errors.school = 'School is required';
      }
      if (!formData.address.trim()) {
        errors.address = 'Address is required';
      }
      if (!formData.parentName.trim()) {
        errors.parentName = 'Parent name is required';
      }
      if (!formData.parentContact.trim()) {
        errors.parentContact = 'Parent contact is required';
      } else if (!isValidPhone(formData.parentContact)) {
        errors.parentContact = 'Please enter a valid phone number';
      }
      if (!formData.language) {
        errors.language = 'Language is required';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      
      // Add all form fields except confirmPassword and profilePicturePreview
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword' && key !== 'profilePicturePreview') {
          if (key === 'profilePicture' && formData[key]) {
            formDataToSend.append(key, formData[key]);
          } else if (key !== 'profilePicture') {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      
      await authAPI.register(formDataToSend);

      // Redirect to OTP verification
      navigate(`${ROUTES.VERIFY_OTP}?email=${formData.email}&role=${formData.role.toLowerCase()}`);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
          {/* Form Section */}
          <div className="register-form p-8 lg:p-12 flex flex-col justify-center overflow-y-auto ">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-6 group">
              <img src='/assets/images/logo.png' alt='logo' className='w-10 h-10'/>
              <span className="font-bold text-xl text-gray-900">Anuruddha Sir</span>
            </Link>

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{currentRole.title}</h1>
              <p className="text-gray-600">{currentRole.subtitle}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form with Tabs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentTab(1)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    currentTab === 1
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab(2)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    currentTab === 2
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Security
                </button>
                {formData.role === 'TEACHER' && (
                  <button
                    type="button"
                    onClick={() => setCurrentTab(3)}
                    className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                      currentTab === 3
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Professional
                  </button>
                )}
                {formData.role === 'STUDENT' && (
                  <button
                    type="button"
                    onClick={() => setCurrentTab(3)}
                    className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                      currentTab === 3
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Academic
                  </button>
                )}
              </div>

              {/* Tab 1: Basic Information */}
              {currentTab === 1 && (
                <div className="space-y-4">
                  {/* Profile Picture Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Profile Picture <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {formData.profilePicturePreview ? (
                          <img
                            src={formData.profilePicturePreview}
                            alt="Profile preview"
                            className="h-24 w-24 rounded-lg object-cover border-2 border-green-500"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                            <FaCamera className="text-gray-400 text-2xl" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <label className="relative block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                          />
                          <div className="bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg p-4 text-center cursor-pointer hover:bg-primary-100 transition-colors">
                            <FaCamera className="mx-auto text-primary-500 mb-2 text-xl" />
                            <p className="text-sm font-medium text-primary-700">Click to upload photo</p>
                            <p className="text-xs text-primary-600">or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    {fieldErrors.profilePicture && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.profilePicture}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className={getInputState('firstName') === 'invalid' ? 'text-red-400' : getInputState('firstName') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                        </div>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className={getInputClassName('firstName')}
                          placeholder="John"
                        />
                        {formData.firstName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {getInputState('firstName') === 'valid' ? (
                              <FaCheck className="text-green-500" />
                            ) : getInputState('firstName') === 'invalid' ? (
                              <FaTimes className="text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {fieldErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="flex-shrink-0" />
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className={getInputState('lastName') === 'invalid' ? 'text-red-400' : getInputState('lastName') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                        </div>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className={getInputClassName('lastName')}
                          placeholder="Doe"
                        />
                        {formData.lastName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {getInputState('lastName') === 'valid' ? (
                              <FaCheck className="text-green-500" />
                            ) : getInputState('lastName') === 'invalid' ? (
                              <FaTimes className="text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {fieldErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="flex-shrink-0" />
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className={getInputState('email') === 'invalid' ? 'text-red-400' : getInputState('email') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={getInputClassName('email')}
                        placeholder="john@example.com"
                      />
                      {formData.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {getInputState('email') === 'valid' ? (
                            <FaCheck className="text-green-500" />
                          ) : getInputState('email') === 'invalid' ? (
                            <FaTimes className="text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className={getInputState('phone') === 'invalid' ? 'text-red-400' : getInputState('phone') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={getInputClassName('phone')}
                        placeholder="0771234567"
                      />
                      {formData.phone && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {getInputState('phone') === 'valid' ? (
                            <FaCheck className="text-green-500" />
                          ) : getInputState('phone') === 'invalid' ? (
                            <FaTimes className="text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Security */}
              {currentTab === 2 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className={getInputState('password') === 'invalid' ? 'text-red-400' : getInputState('password') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={getInputClassName('password')}
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                        {formData.password && getInputState('password') === 'valid' && (
                          <FaCheck className="text-green-500" />
                        )}
                        {formData.password && getInputState('password') === 'invalid' && (
                          <FaTimes className="text-red-500" />
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Password Strength:</span>
                          <span className={`text-xs font-semibold ${
                            getPasswordStrength(formData.password).strength <= 2 ? 'text-red-600' :
                            getPasswordStrength(formData.password).strength === 3 ? 'text-yellow-600' :
                            getPasswordStrength(formData.password).strength === 4 ? 'text-blue-600' :
                            'text-green-600'
                          }`}>
                            {getPasswordStrength(formData.password).label}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((bar) => (
                            <div
                              key={bar}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                bar <= getPasswordStrength(formData.password).strength
                                  ? getPasswordStrength(formData.password).color
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-medium text-gray-700">Password must contain:</p>
                        <div className="space-y-1">
                          <div className={`flex items-center gap-2 text-xs ${
                            formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {formData.password.length >= 8 ? (
                              <FaCheck className="flex-shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span>At least 8 characters</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            /(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {/(?=.*[a-z])/.test(formData.password) ? (
                              <FaCheck className="flex-shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span>One lowercase letter (a-z)</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            /(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {/(?=.*[A-Z])/.test(formData.password) ? (
                              <FaCheck className="flex-shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span>One uppercase letter (A-Z)</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            /(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {/(?=.*\d)/.test(formData.password) ? (
                              <FaCheck className="flex-shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span>One number (0-9)</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            /(?=.*[@$!%*?&#])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {/(?=.*[@$!%*?&#])/.test(formData.password) ? (
                              <FaCheck className="flex-shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span>One special character (@$!%*?&#)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {fieldErrors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className={getInputState('confirmPassword') === 'invalid' ? 'text-red-400' : getInputState('confirmPassword') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={getInputClassName('confirmPassword')}
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                        {formData.confirmPassword && getInputState('confirmPassword') === 'valid' && (
                          <FaCheck className="text-green-500" />
                        )}
                        {formData.confirmPassword && getInputState('confirmPassword') === 'invalid' && (
                          <FaTimes className="text-red-500" />
                        )}
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Professional Information (Teacher Only) */}
              {formData.role === 'TEACHER' && currentTab === 3 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
                      Qualifications <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                        <FaGraduationCap className={getInputState('qualifications') === 'invalid' ? 'text-red-400' : getInputState('qualifications') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                      </div>
                      <input
                        id="qualifications"
                        name="qualifications"
                        type="text"
                        required
                        value={formData.qualifications}
                        onChange={handleChange}
                        className={getInputClassName('qualifications')}
                        placeholder="e.g., B.Ed. (Hons) Mathematics, M.A. History"
                      />
                      {formData.qualifications && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {getInputState('qualifications') === 'valid' ? (
                            <FaCheck className="text-green-500" />
                          ) : getInputState('qualifications') === 'invalid' ? (
                            <FaTimes className="text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {fieldErrors.qualifications && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.qualifications}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subjectsTaught" className="block text-sm font-medium text-gray-700 mb-2">
                      Subjects Taught <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBook className={getInputState('subjectsTaught') === 'invalid' ? 'text-red-400' : getInputState('subjectsTaught') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                      </div>
                      <input
                        id="subjectsTaught"
                        name="subjectsTaught"
                        type="text"
                        required
                        value={formData.subjectsTaught}
                        onChange={handleChange}
                        className={getInputClassName('subjectsTaught')}
                        placeholder="e.g., Mathematics, Science, English (comma-separated)"
                      />
                      {formData.subjectsTaught && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {getInputState('subjectsTaught') === 'valid' ? (
                            <FaCheck className="text-green-500" />
                          ) : getInputState('subjectsTaught') === 'invalid' ? (
                            <FaTimes className="text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {fieldErrors.subjectsTaught && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.subjectsTaught}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <div className="relative">
                        <input
                          id="yearsOfExperience"
                          name="yearsOfExperience"
                          type="number"
                          min="0"
                          max="70"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          className={getInputClassName('yearsOfExperience')}
                          placeholder="e.g., 10"
                        />
                        {formData.yearsOfExperience && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {getInputState('yearsOfExperience') === 'valid' ? (
                              <FaCheck className="text-green-500" />
                            ) : getInputState('yearsOfExperience') === 'invalid' ? (
                              <FaTimes className="text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {fieldErrors.yearsOfExperience && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="flex-shrink-0" />
                          {fieldErrors.yearsOfExperience}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                        Language of Instruction
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="">Select Language</option>
                        <option value="Sinhala">Sinhala</option>
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Multiple">Multiple Languages</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none ${
                        fieldErrors.bio ? 'border-red-500 bg-red-50' : formData.bio && !fieldErrors.bio ? 'border-green-500 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your teaching experience and expertise..."
                      rows="3"
                    />
                    {fieldErrors.bio && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.bio}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none ${
                        fieldErrors.address ? 'border-red-500 bg-red-50' : formData.address && !fieldErrors.address ? 'border-green-500 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Your address"
                      rows="2"
                    />
                    {fieldErrors.address && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.address}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Student Academic Information */}
              {formData.role === 'STUDENT' && currentTab === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendar className={getInputState('dateOfBirth') === 'invalid' ? 'text-red-400' : getInputState('dateOfBirth') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                        </div>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={getInputClassName('dateOfBirth')}
                        />
                        {formData.dateOfBirth && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {getInputState('dateOfBirth') === 'valid' ? (
                              <FaCheck className="text-green-500" />
                            ) : getInputState('dateOfBirth') === 'invalid' ? (
                              <FaTimes className="text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {fieldErrors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="flex-shrink-0" />
                          {fieldErrors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="gradeLevel"
                          name="gradeLevel"
                          required
                          value={formData.gradeLevel}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        >
                          <option value="">Select Grade Level</option>
                          <option value="Grade 1">Grade 1</option>
                          <option value="Grade 2">Grade 2</option>
                          <option value="Grade 3">Grade 3</option>
                          <option value="Grade 4">Grade 4</option>
                          <option value="Grade 5">Grade 5</option>
                        </select>
                      </div>
                      {fieldErrors.gradeLevel && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="flex-shrink-0" />
                          {fieldErrors.gradeLevel}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                      School <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaGraduationCap className={getInputState('school') === 'invalid' ? 'text-red-400' : getInputState('school') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                      </div>
                      <input
                        id="school"
                        name="school"
                        type="text"
                        required
                        value={formData.school}
                        onChange={handleChange}
                        className={getInputClassName('school')}
                        placeholder="School name"
                      />
                      {formData.school && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {getInputState('school') === 'valid' ? (
                            <FaCheck className="text-green-500" />
                          ) : getInputState('school') === 'invalid' ? (
                            <FaTimes className="text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {fieldErrors.school && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.school}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none ${
                        fieldErrors.address ? 'border-red-500 bg-red-50' : formData.address && !fieldErrors.address ? 'border-green-500 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Your address"
                      rows="2"
                      required
                    />
                    {fieldErrors.address && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className={getInputState('parentName') === 'invalid' ? 'text-red-400' : getInputState('parentName') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                        </div>
                        <input
                          id="parentName"
                          name="parentName"
                          type="text"
                          required
                          value={formData.parentName}
                          onChange={handleChange}
                          className={getInputClassName('parentName')}
                          placeholder="Parent or guardian name"
                        />
                        {formData.parentName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {getInputState('parentName') === 'valid' ? (
                              <FaCheck className="text-green-500" />
                            ) : getInputState('parentName') === 'invalid' ? (
                              <FaTimes className="text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {fieldErrors.parentName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="flex-shrink-0" />
                          {fieldErrors.parentName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="parentContact" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Contact <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className={getInputState('parentContact') === 'invalid' ? 'text-red-400' : getInputState('parentContact') === 'valid' ? 'text-green-400' : 'text-gray-400'} />
                        </div>
                        <input
                          id="parentContact"
                          name="parentContact"
                          type="tel"
                          required
                          value={formData.parentContact}
                          onChange={handleChange}
                          className={getInputClassName('parentContact')}
                          placeholder="0771234567"
                        />
                        {formData.parentContact && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {getInputState('parentContact') === 'valid' ? (
                              <FaCheck className="text-green-500" />
                            ) : getInputState('parentContact') === 'invalid' ? (
                              <FaTimes className="text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {fieldErrors.parentContact && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="flex-shrink-0" />
                          {fieldErrors.parentContact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="language"
                      name="language"
                      required
                      value={formData.language}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Select Language</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                    {fieldErrors.language && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FaTimes className="flex-shrink-0" />
                        {fieldErrors.language}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {currentTab > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentTab(currentTab - 1)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                {currentTab < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentTab(currentTab + 1)}
                    className="flex-1 px-6 py-3 rounded-lg font-medium text-white hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200"
                    style={{ background: gradientStyles[currentRole.gradient] }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ background: gradientStyles[currentRole.gradient] }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to={getAuthRoute('login', formData.role.toLowerCase())}
                  className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="register-image hidden lg:flex items-center justify-centerrelative overflow-hidden" style={{ background: gradientStyles[currentRole.gradient] }}>
              <img 
                src={currentRole.image} 
                alt={currentRole.label}
                className="w-full h-full object-cover drop-shadow-2xl"
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
