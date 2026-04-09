import { useCallback, useEffect, useState } from 'react';
import {
  FaGraduationCap,
  FaTimes,
  FaChartLine,
  FaEye,
} from 'react-icons/fa';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { certificateAPI } from '../../api/certificate';

const AdminCertificates = () => {
  const [notification, setNotification] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewingCertId, setViewingCertId] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [statsData, setStatsData] = useState({
    total_issued: 0,
    this_month: 0,
    pending: 0,
  });

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
      description: 'awaiting issuance',
    },
  ];

  const getCertTypeColor = (type) => {
    const colors = {
      completion: 'bg-green-100 text-green-700',
      participation: 'bg-blue-100 text-blue-700',
    };
    return colors[type] || colors.participation;
  };

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(filterType !== 'all' ? { type: filterType } : {}),
        ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      };

      const [statsResponse, listResponse] = await Promise.all([
        certificateAPI.getAdminStats(),
        certificateAPI.getAdminCertificates(params),
      ]);

      const statsPayload = statsResponse?.data?.data || {};
      const listPayload = listResponse?.data?.data || {};

      setStatsData({
        total_issued: statsPayload.total_issued || 0,
        this_month: statsPayload.this_month || 0,
        pending: statsPayload.pending || 0,
      });

      setCertificates(Array.isArray(listPayload.certificates) ? listPayload.certificates : []);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error?.message || 'Failed to load certificate data',
      });
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, [filterType, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCertificates();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadCertificates]);

  const handleIssueCertificate = async () => {
    setActionLoading(true);
    try {
      const response = await certificateAPI.issuePendingCertificates();
      const issuedCount = response?.data?.data?.issued_count || 0;
      setNotification({
        type: 'success',
        message:
          issuedCount > 0
            ? `${issuedCount} certificate${issuedCount > 1 ? 's' : ''} issued successfully!`
            : 'No pending certificates found to issue.',
      });
      await loadCertificates();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to issue certificate: ' + error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewCertificate = async (certId) => {
    setViewingCertId(certId);
    try {
      const response = await certificateAPI.getCertificateDetails(certId);
      const cert = response?.data?.data;
      setNotification({
        type: 'info',
        message: cert
          ? `Certificate: ${cert.certificate_code || cert.id} | ${cert.student_name || cert.student} - ${cert.course_title || cert.course}`
          : 'Certificate details loaded.',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to view certificate: ' + error.message,
      });
    } finally {
      setViewingCertId(null);
    }
  };

  return (
    <div className="p-8">
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm">
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Management</h1>
          <p className="text-gray-600">Issue and manage certificates</p>
        </div>
        <ButtonWithLoader
          label="+ Issue Certificate"
          loadingLabel="Processing..."
          isLoading={actionLoading}
          onClick={handleIssueCertificate}
          icon={<FaGraduationCap />}
          variant="primary"
        />
      </div>

      <StatCard stats={statsData} metricsConfig={metricsConfig} loading={loading} />
      {/* Certificates DataTable */}
      <DataTable
        data={certificates}
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
              <ButtonWithLoader
                label="View"
                loadingLabel="Loading..."
                isLoading={viewingCertId === cert.certificate_id}
                onClick={() => handleViewCertificate(cert.certificate_id)}
                icon={<FaEye />}
                variant="primary"
              />
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
            { label: 'Participation', value: 'participation' },
          ],
          statusFilterValue: filterType,
          onStatusFilterChange: (value) => setFilterType(value),
        }}
        loading={loading}
      />
    </div>
  );
};

export default AdminCertificates;
