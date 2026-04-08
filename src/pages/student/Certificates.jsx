import { FaAward, FaCheck, FaFilePdf, FaGraduationCap, FaLink, FaTrophy, FaBook, FaEye } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';

const StudentCertificates = () => {
  const [filter, setFilter] = useState('issued');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  
  const certificatesMetricsConfig = [
    {
      label: 'Total Certificates',
      statsKey: 'totalCertificates',
      icon: FaGraduationCap,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'All earned certificates',
    },
    {
      label: 'Course Completions',
      statsKey: 'completions',
      icon: FaCheck,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Courses finished',
    },
    {
      label: 'Achievements',
      statsKey: 'achievements',
      icon: FaTrophy,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Special awards',
    },
    {
      label: 'Average Score',
      statsKey: 'avgScore',
      icon: FaAward,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Overall performance',
    },
  ];
  const certificates = [
    {
      id: 1,
      title: 'Mathematics Excellence Award',
      course: 'Mathematics Scholarship Course',
      issueDate: 'Dec 15, 2025',
      score: 95,
      grade: 'A+',
      certificateNumber: 'CERT-2025-MATH-001',
      status: 'issued',
      color: 'bg-green-600',
    },
    {
      id: 2,
      title: 'Course Completion Certificate',
      course: 'Complete Scholarship Package',
      issueDate: 'Dec 10, 2025',
      score: 88,
      grade: 'A',
      certificateNumber: 'CERT-2025-COMP-002',
      status: 'issued',
      color: 'bg-blue-600',
    },
    {
      id: 3,
      title: 'Perfect Attendance Award',
      course: 'All Courses',
      issueDate: 'Nov 30, 2025',
      attendance: '100%',
      certificateNumber: 'CERT-2025-ATT-003',
      status: 'issued',
      color: 'bg-yellow-600',
    }
  ];

  const inProgressCertificates = [
    {
      id: 4,
      title: 'Sinhala Language Certificate',
      course: 'Sinhala Language Course',
      progress: 65,
      requirement: 'Complete all lessons and score 75%+',
      estimatedDate: 'Jan 15, 2026',
      color: 'bg-purple-600',
    },
    {
      id: 5,
      title: 'Environment Studies Certificate',
      course: 'Environment Studies Course',
      progress: 45,
      requirement: 'Complete all lessons and score 75%+',
      estimatedDate: 'Feb 1, 2026',
      color: 'bg-yellow-600',
    },
  ];

  // Define table columns for issued certificates
  const issuedColumns = useMemo(() => [
    {
      key: 'title',
      label: 'Certificate',
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.course}</p>
        </div>
      )
    },
    {
      key: 'issueDate',
      label: 'Issue Date',
      render: (_, row) => row.issueDate
    },
    {
      key: 'score',
      label: 'Score',
      render: (_, row) => row.score ? `${row.score}% (${row.grade})` : 'N/A'
    },
    {
      key: 'certificateNumber',
      label: 'Certificate No.',
      render: (_, row) => <span className="text-xs font-mono">{row.certificateNumber}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: () => (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
          <FaCheck className="text-xs" /> Verified
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <ButtonWithLoader
            label="Download"
            loadingLabel="Downloading..."
            isLoading={downloadingId === 1}
            onClick={() => {
              setDownloadingId(1);
              setTimeout(() => setDownloadingId(null), 1000);
            }}
            variant="primary"
            size="sm"
          />
          <button className="px-2 py-1 border border-gray-300 hover:bg-gray-50 rounded text-xs">
            <FaEye />
          </button>
          <button className="px-2 py-1 border border-gray-300 hover:bg-gray-50 rounded text-xs">
            <FaLink />
          </button>
        </div>
      )
    }
  ], []);

  // Define table columns for in progress certificates
  const inProgressColumns = useMemo(() => [
    {
      key: 'title',
      label: 'Certificate',
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.course}</p>
        </div>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (_, row) => (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">{row.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${row.color} h-2 rounded-full transition-all`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'requirement',
      label: 'Requirement',
      render: (_, row) => <span className="text-xs text-gray-600">{row.requirement}</span>
    },
    {
      key: 'estimatedDate',
      label: 'Est. Date',
      render: (_, row) => row.estimatedDate
    }
  ], []);

  // Define table columns for achievements
  const achievementsColumns = useMemo(() => [
    {
      key: 'title',
      label: 'Achievement',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="text-2xl">{row.icon}</div>
          <p className="font-semibold text-gray-900">{row.title}</p>
        </div>
      )
    },
    {
      key: 'earned',
      label: 'Date Earned',
      render: (_, row) => row.earned
    }
  ], []);
    

  const achievements = [
    { id: 1, title: 'Top Performer', icon: '🏆', earned: 'Dec 15, 2025' },
    { id: 2, title: 'Quiz Champion', icon: '📚', earned: 'Dec 10, 2025' },
    { id: 3, title: 'Consistent Learner', icon: '⭐', earned: 'Dec 5, 2025' },
    { id: 4, title: 'Quick Learner', icon: '⚡', earned: 'Nov 28, 2025' },
  ];

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  return (
    <div className="p-8">
        {notification && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => setNotification(null)}
            />
          </div>
        )}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Certificates
                </h1>
                <p className="text-slate-600 mt-1">Showcase your achievements and download certificates</p>
              </div>
              <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
            </div>
          </div>
        </div>

      {/* Stats */}
      <StatCard 
        stats={{
          totalCertificates: (certificates.length + inProgressCertificates.length).toString(),
          completions: certificates.length.toString(),
          achievements: achievements.length.toString(),
          avgScore: '91.5%',
        }}
        metricsConfig={certificatesMetricsConfig}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
        <button
          onClick={() => setFilter('issued')}
          className={`pb-3 px-4 font-semibold transition-all ${
            filter === 'issued'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Issued ({certificates.length})
        </button>
        <button
          onClick={() => setFilter('inProgress')}
          className={`pb-3 px-4 font-semibold transition-all ${
            filter === 'inProgress'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          In Progress ({inProgressCertificates.length})
        </button>
        <button
          onClick={() => setFilter('achievements')}
          className={`pb-3 px-4 font-semibold transition-all ${
            filter === 'achievements'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Achievements ({achievements.length})
        </button>
      </div>

      {/* Issued Certificates Table */}
      {filter === 'issued' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow mb-8">
          <DataTable
            columns={issuedColumns}
            data={certificates}
            config={{
              itemsPerPage: 10,
              searchPlaceholder: 'Search certificates by title or course...',
              hideSearch: false,
              emptyMessage: 'No certificates found',
              searchValue: searchTerm,
              onSearchChange: (value) => setSearchTerm(value),
            }}
            loading={false}
          />
        </div>
      )}

      {/* In Progress Certificates Table */}
      {filter === 'inProgress' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow mb-8">
          <DataTable
            columns={inProgressColumns}
            data={inProgressCertificates}
            config={{
              itemsPerPage: 10,
              searchPlaceholder: 'Search certificates by title or course...',
              hideSearch: false,
              emptyMessage: 'No certificates in progress',
              searchValue: searchTerm,
              onSearchChange: (value) => setSearchTerm(value),
            }}
            loading={false}
          />
        </div>
      )}

      {/* Achievements Table */}
      {filter === 'achievements' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow mb-8">
          <DataTable
            columns={achievementsColumns}
            data={achievements}
            config={{
              itemsPerPage: 10,
              searchPlaceholder: 'Search achievements...',
              hideSearch: false,
              emptyMessage: 'No achievements yet',
              searchValue: searchTerm,
              onSearchChange: (value) => setSearchTerm(value),
            }}
            loading={false}
          />
        </div>
      )}

      {/* Share Section */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 mt-8">
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Achievements!</h3>
          <p className="text-gray-600 mb-4">
            Let your friends and family know about your success
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
              Share on Facebook
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all">
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificates;
