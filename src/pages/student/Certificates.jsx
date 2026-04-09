import { FaAward, FaCheck, FaGraduationCap, FaLink, FaEye, FaShareAlt, FaDownload } from 'react-icons/fa';
import { useState, useMemo, useCallback, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import { certificateAPI } from '../../api/certificate';
import { SOCIAL_LINKS } from '../../utils/constants';

const getApiOrigin = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  return baseUrl.replace(/\/api\/v1\/?$/, '');
};

const StudentCertificates = () => {
  const [filter, setFilter] = useState('issued');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [inProgressCertificates, setInProgressCertificates] = useState([]);
  const [stats, setStats] = useState({
    total_certificates: 0,
    issued_count: 0,
    in_progress_count: 0,
    avg_score: 0,
  });
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  }, []);

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
      label: 'Average Score',
      statsKey: 'avgScore',
      icon: FaAward,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Overall performance',
    },
  ];

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await certificateAPI.getMyCertificates({
        limit: 100,
        page: 1,
        sort: 'recent',
      });

      const payload = response?.data?.data || {};
      setCertificates(Array.isArray(payload.certificates) ? payload.certificates : []);
      setInProgressCertificates(Array.isArray(payload.in_progress_certificates) ? payload.in_progress_certificates : []);
      setStats(payload.stats || {
        total_certificates: 0,
        issued_count: 0,
        in_progress_count: 0,
        avg_score: 0,
      });
    } catch (error) {
      showNotification(error?.message || 'Failed to load certificates', 'error');
      setCertificates([]);
      setInProgressCertificates([]);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const normalizeSearchValue = (value) => (value || '').trim().toLowerCase();
  const searchValue = normalizeSearchValue(searchTerm);

  const filteredIssuedCertificates = useMemo(() => {
    if (!searchValue) return certificates;
    return certificates.filter((certificate) => {
      const haystack = [
        certificate.certificate_code,
        certificate.certificate_title,
        certificate.student_name,
        certificate.course_title,
        certificate.instructor_name,
        certificate.status,
        certificate.type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchValue);
    });
  }, [certificates, searchValue]);

  const filteredInProgressCertificates = useMemo(() => {
    if (!searchValue) return inProgressCertificates;
    return inProgressCertificates.filter((certificate) => {
      const haystack = [
        certificate.title,
        certificate.course,
        certificate.course_title,
        certificate.requirement,
        certificate.teacher,
        certificate.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchValue);
    });
  }, [inProgressCertificates, searchValue]);

  const handleDownload = useCallback(async (certificate) => {
    setDownloadingId(certificate.certificate_id);
    try {
      const response = await certificateAPI.downloadCertificate(certificate.certificate_id);
      const blob = response?.data;
      const fileName = `${certificate.certificate_code || certificate.certificate_id}.pdf`;
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      showNotification('Certificate download started', 'success', 2500);
    } catch (error) {
      showNotification(error?.message || 'Failed to download certificate', 'error');
    } finally {
      setDownloadingId(null);
    }
  }, [showNotification]);

  const handleViewCertificate = useCallback(async (certificate) => {
    setViewingId(certificate.certificate_id);
    try {
      const response = await certificateAPI.getCertificateDetails(certificate.certificate_id);
      const cert = response?.data?.data || certificate;
      showNotification(
        `${cert.certificate_code || cert.id} • ${cert.course_title || cert.course} • ${cert.status || 'issued'}`,
        'info',
        3500
      );
    } catch (error) {
      showNotification(error?.message || 'Failed to load certificate details', 'error');
    } finally {
      setViewingId(null);
    }
  }, [showNotification]);

  const handleVerify = useCallback((certificate) => {
    const certificateCode = certificate.certificate_code || certificate.id;
    certificateAPI.verifyCertificate(certificateCode)
      .then((response) => {
        const verification = response?.data?.data || {};
        showNotification(
          verification.valid
            ? `${certificateCode} is valid and verified`
            : `${certificateCode} could not be verified`,
          verification.valid ? 'success' : 'error',
          3000
        );
      })
      .catch((error) => {
        showNotification(error?.message || 'Failed to verify certificate', 'error');
      });
  }, [showNotification]);

  const handleShare = useCallback(async (certificate) => {
    setSharingId(certificate.certificate_id);
    try {
      const verifyUrl = `${getApiOrigin()}${certificate.verification_url || `/api/v1/certificates/verify/${certificate.certificate_code || certificate.id}`}`;
      const text = `I earned ${certificate.course_title || certificate.course || 'a certificate'}! Verify it here: ${verifyUrl}`;

      await certificateAPI.shareCertificate(certificate.certificate_id, {
        platform: 'whatsapp',
        message: text,
      });

      if (navigator.share) {
        await navigator.share({
          title: certificate.certificate_title || 'My Certificate',
          text,
          url: verifyUrl,
        });
      } else {
        window.open(`${SOCIAL_LINKS.WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      }

      showNotification('Certificate shared successfully', 'success', 2500);
    } catch (error) {
      showNotification(error?.message || 'Failed to share certificate', 'error');
    } finally {
      setSharingId(null);
    }
  }, [showNotification]);

  const issuedColumns = useMemo(() => [
    {
      key: 'title',
      label: 'Certificate',
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.certificate_title || row.id || row.certificate_code}</p>
          <p className="text-xs text-gray-500">{row.course_title || row.course}</p>
        </div>
      )
    },
    {
      key: 'issued_date',
      label: 'Issue Date',
      render: (_, row) => row.issued_date || row.issueDate || '-'
    },
    {
      key: 'score',
      label: 'Score',
      render: (_, row) => (row.score != null ? `${row.score}%` : 'N/A')
    },
    {
      key: 'certificate_code',
      label: 'Certificate No.',
      render: (_, row) => <span className="text-xs font-mono">{row.certificate_code || row.id}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
          <FaCheck className="text-xs" /> {String(row.status || 'issued').replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2 flex-wrap">
          <ButtonWithLoader
            label="Download"
            loadingLabel="Downloading..."
            isLoading={downloadingId === row.certificate_id}
            onClick={() => handleDownload(row)}
            variant="primary"
            size="sm"
            icon={<FaDownload />}
          />
          <ButtonWithLoader
            label="View"
            loadingLabel="Loading..."
            isLoading={viewingId === row.certificate_id}
            onClick={() => handleViewCertificate(row)}
            variant="secondary"
            size="sm"
            icon={<FaEye />}
          />
          <button
            type="button"
            onClick={() => handleVerify(row)}
            className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-md text-xs font-semibold transition-colors inline-flex items-center gap-2"
          >
            <FaLink /> Verify
          </button>
          <button
            type="button"
            onClick={() => handleShare(row)}
            disabled={sharingId === row.certificate_id}
            className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-md text-xs font-semibold transition-colors inline-flex items-center gap-2 disabled:opacity-60"
          >
            <FaShareAlt /> {sharingId === row.certificate_id ? 'Sharing...' : 'Share'}
          </button>
        </div>
      )
    }
  ], [downloadingId, handleDownload, handleShare, handleVerify, handleViewCertificate, sharingId, viewingId]);

  const inProgressColumns = useMemo(() => [
    {
      key: 'title',
      label: 'Certificate',
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.course_title || row.course}</p>
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
              className={`${row.color || 'bg-purple-600'} h-2 rounded-full transition-all`}
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
      render: (_, row) => row.estimatedDate || '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => showNotification(`Continuing ${row.course || row.course_title}`, 'info', 2500)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors"
        >
          {row.can_continue ? 'Continue' : 'View Certificate'}
        </button>
      )
    }
  ], [showNotification]);

  const metricsStats = {
    totalCertificates: String(stats.total_certificates ?? certificates.length ?? 0),
    completions: String(stats.issued_count ?? certificates.length ?? 0),
    avgScore: `${stats.avg_score ?? 0}%`,
  };

  const activeData = filter === 'issued' ? filteredIssuedCertificates : filteredInProgressCertificates;
  const activeColumns = filter === 'issued' ? issuedColumns : inProgressColumns;
  const emptyMessage = filter === 'issued' ? 'No certificates found' : 'No certificates in progress';
  const searchPlaceholder = 'Search certificates by title, code, or course...';

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

      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Certificates
              </h1>
              <p className="text-slate-600 mt-1">Track, download, verify, and share your certificates</p>
            </div>
            <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
          </div>
        </div>
      </div>

      <StatCard 
        stats={metricsStats}
        metricsConfig={certificatesMetricsConfig}
        loading={loading}
      />

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
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow mb-8">
        <DataTable
          columns={activeColumns}
          data={activeData}
          config={{
            itemsPerPage: 10,
            searchPlaceholder,
            hideSearch: false,
            emptyMessage,
            searchValue: searchTerm,
            onSearchChange: setSearchTerm,
          }}
          loading={loading}
        />
      </div>

      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 mt-8">
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Certificates!</h3>
          <p className="text-gray-600 mb-4">
            Let your friends and family know about your success
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
              onClick={() => showNotification('Use the share action on a certificate row to share it.', 'info', 3500)}
            >
              Share on Facebook
            </button>
            <button
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
              onClick={() => showNotification('Use the share action on a certificate row to share it.', 'info', 3500)}
            >
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificates;
