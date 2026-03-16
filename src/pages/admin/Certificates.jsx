import { useState } from 'react';
import { FaFilePdf, FaGraduationCap, FaTimes, FaTrophy, FaChartLine, FaChartArea, FaStar, FaEye } from 'react-icons/fa';

import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const AdminCertificates = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  // const [showIssueModal, setShowIssueModal] = useState(false); // TODO: Implement modal for issuing certificates

  const certificates = [
    {
      id: 'CERT-2025-001',
      student: 'Dilshan Mendis',
      course: 'Complete Scholarship Package',
      type: 'completion',
      issueDate: 'Dec 15, 2025',
      teacher: 'Anuruddha Sir',
      score: 92,
      status: 'issued',
    },
    {
      id: 'CERT-2025-002',
      student: 'Kamal Perera',
      course: 'Mathematics Excellence',
      type: 'achievement',
      issueDate: 'Dec 14, 2025',
      teacher: 'Anuruddha Sir',
      score: 95,
      status: 'issued',
    },
    {
      id: 'CERT-2025-003',
      student: 'Sanduni Fernando',
      course: 'Science Mastery',
      type: 'completion',
      issueDate: 'Dec 12, 2025',
      teacher: 'Saman Fernando',
      score: 88,
      status: 'issued',
    },
    {
      id: 'CERT-2025-004',
      student: 'Nimal Silva',
      course: 'English Grammar',
      type: 'participation',
      issueDate: 'Dec 10, 2025',
      teacher: 'Saman Fernando',
      score: 78,
      status: 'issued',
    },
  ];

  const statsData = {
    total_issued: 1234,
    this_month: 89,
    pending: 12,
    achievements: 456,
  };

  const metricsConfig = [
    {
      label: 'Total Issued',
      statsKey: 'total_issued',
      icon: FaGraduationCap,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'certificates overall',
    },
    {
      label: 'This Month',
      statsKey: 'this_month',
      icon: FaChartLine,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'recent issuances',
    },
    {
      label: 'Pending',
      statsKey: 'pending',
      icon: FaTimes,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'awaiting approval',
    },
    {
      label: 'Achievements',
      statsKey: 'achievements',
      icon: FaTrophy,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'badge badges awarded',
    },
  ];

  const getCertTypeColor = (type) => {
    const colors = {
      completion: 'bg-green-100 text-green-700',
      achievement: 'bg-yellow-100 text-yellow-700',
      participation: 'bg-blue-100 text-blue-700',
    };
    return colors[type] || colors.participation;
  };

  const filteredCertificates = certificates.filter((cert) => {
    return filterType === 'all' || cert.type === filterType;
  });

  const achievements = [
    { name: 'Top Performer', count: 45, icon: FaTrophy, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Perfect Attendance', count: 78, icon: FaStar, color: 'bg-blue-100 text-blue-700' },
    { name: 'Quiz Master', count: 34, icon: FaFilePdf, color: 'bg-green-100 text-green-700' },
    { name: 'Fast Learner', count: 56, icon: FaChartArea, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Management</h1>
          <p className="text-gray-600">Issue and manage certificates and achievements</p>
        </div>
        <button onClick={() => console.log('Issue certificate - modal coming soon')} className="btn-primary px-6">
          + Issue Certificate
        </button>
      </div>

      <StatCard stats={statsData} metricsConfig={metricsConfig} />

      {/* Achievements Summary */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Achievement Badges Issued</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`p-4 rounded-lg ${achievement.color}`}>
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="font-bold text-gray-900">{achievement.name}</p>
              <p className="text-2xl font-bold">{achievement.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates DataTable */}
      <DataTable
        data={filteredCertificates}
        columns={[
          {
            key: 'id',
            label: 'Certificate ID',
            searchable: true,
            render: (value) => <p className="text-sm font-medium text-gray-900">{value}</p>,
          },
          {
            key: 'student',
            label: 'Student',
            searchable: true,
            render: (value) => <p className="text-sm text-gray-900">{value}</p>,
          },
          {
            key: 'course',
            label: 'Course',
            searchable: true,
            render: (value) => <p className="text-sm text-gray-900">{value}</p>,
          },
          {
            key: 'type',
            label: 'Type',
            filterable: true,
            filterOptions: [
              { label: 'Completion', value: 'completion' },
              { label: 'Achievement', value: 'achievement' },
              { label: 'Participation', value: 'participation' },
            ],
            render: (value) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCertTypeColor(value)}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ),
          },
          {
            key: 'teacher',
            label: 'Teacher',
            searchable: true,
            render: (value) => <p className="text-sm text-gray-600">{value}</p>,
          },
          {
            key: 'score',
            label: 'Score',
            render: (value) => <p className="text-sm font-medium text-gray-900">{value}%</p>,
          },
          {
            key: 'issueDate',
            label: 'Issue Date',
            render: (value) => <p className="text-sm text-gray-600">{value}</p>,
          },
          {
            key: 'status',
            label: 'Status',
            render: (value) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value === 'issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {value.toUpperCase()}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, cert) => (
              <button
                onClick={() => console.log('View certificate:', cert.id)}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs flex items-center gap-1 transition whitespace-nowrap"
              >
                <FaEye /> View
              </button>
            ),
          },
        ]}
        config={{
          itemsPerPage: 10,
          searchPlaceholder: 'Search by ID, student, course...',
          hideSearch: false,
          emptyMessage: 'No certificates found',
          searchValue: searchTerm,
          onSearchChange: (value) => {
            setSearchTerm(value);
          },
          statusFilterOptions: [
            { label: 'All Types', value: 'all' },
            { label: 'Course Completion', value: 'completion' },
            { label: 'Achievement', value: 'achievement' },
            { label: 'Participation', value: 'participation' },
          ],
          statusFilterValue: filterType,
          onStatusFilterChange: (value) => setFilterType(value),
        }}
        loading={false}
      />

      {/* Achievement Badges */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Achievement Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, idx) => {
            const IconComponent = achievement.icon;
            return (
              <div key={idx} className="card text-center p-6">
                <div className={`${achievement.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{achievement.name}</h3>
                <p className="text-2xl font-bold text-primary-600">{achievement.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminCertificates;
