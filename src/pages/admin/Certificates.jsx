import { useState } from 'react';
import { FaFilePdf, FaGraduationCap, FaTimes, FaTrophy, FaChartLine } from 'react-icons/fa';
import PulseLoader from '../../components/common/PulseLoader';
import StatCard from '../../components/common/StatCard';

const AdminCertificates = () => {
  const [filterType, setFilterType] = useState('all');
  const [showIssueModal, setShowIssueModal] = useState(false);

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
      icon: '⏳',
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Management</h1>
          <p className="text-gray-600">Issue and manage certificates and achievements</p>
        </div>
        <button onClick={() => setShowIssueModal(true)} className="btn-primary px-6">
          + Issue Certificate
        </button>
      </div>

      <StatCard stats={statsData} metricsConfig={metricsConfig} />

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field max-w-xs">
            <option value="all">All Types</option>
            <option value="completion">Course Completion</option>
            <option value="achievement">Achievement</option>
            <option value="participation">Participation</option>
          </select>
          <button className="btn-outline px-4 py-2">Export Report</button>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{cert.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
                        {cert.student.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{cert.student}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{cert.course}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCertTypeColor(cert.type)}`}>
                      {cert.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${cert.score >= 90 ? 'text-green-600' : cert.score >= 75 ? 'text-blue-600' : 'text-gray-600'}`}>
                      {cert.score}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.teacher}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.issueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs">
                        View
                      </button>
                      <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-xs">
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Certificate Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Issue New Certificate</h2>
              <button onClick={() => setShowIssueModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select className="input-field">
                  <option>Select Student</option>
                  <option>Kamal Perera</option>
                  <option>Nimal Silva</option>
                  <option>Dilshan Mendis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select className="input-field">
                  <option>Select Course</option>
                  <option>Complete Scholarship Package</option>
                  <option>Mathematics Excellence</option>
                  <option>Science Mastery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type</label>
                <select className="input-field">
                  <option value="completion">Course Completion</option>
                  <option value="achievement">Achievement</option>
                  <option value="participation">Participation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Final Score (%)</label>
                  <input type="number" className="input-field" placeholder="85" min="0" max="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                  <input type="date" className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea rows="3" className="input-field" placeholder="Add any special notes or achievements..." />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> The certificate will be automatically sent to the student's email and will be
                  available in their profile.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Issue Certificate
                </button>
                <button type="button" onClick={() => setShowIssueModal(false)} className="btn-outline px-6">
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

export default AdminCertificates;
