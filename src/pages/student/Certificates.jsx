import { FaAward, FaCheck, FaFilePdf, FaGraduationCap, FaLink, FaTrophy } from 'react-icons/fa';

const StudentCertificates = () => {
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
    },
  ];

  const upcomingCertificates = [
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

  const achievements = [
    { id: 1, title: 'Top Performer', icon: FaTrophy, earned: 'Dec 15, 2025' },
    { id: 2, title: 'Quiz Champion', icon: FaFilePdf, earned: 'Dec 10, 2025' },
    { id: 3, title: 'Consistent Learner', icon: '⭐', earned: 'Dec 5, 2025' },
    { id: 4, title: 'Quick Learner', icon: '⚡', earned: 'Nov 28, 2025' },
  ];

  return (
    <div className="p-8">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Certificates</div>
          <div className="text-2xl font-bold text-gray-900">{certificates.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Course Completions</div>
          <div className="text-2xl font-bold text-green-600">2</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Achievements</div>
          <div className="text-2xl font-bold text-yellow-600">{achievements.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Average Score</div>
          <div className="text-2xl font-bold text-primary-600">91.5%</div>
        </div>
      </div>

      {/* Issued Certificates */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="card hover:shadow-lg transition-shadow">
              {/* Certificate Preview */}
              <div className={`${cert.color} text-white p-6 -m-6 mb-4 rounded-t-xl`}>
                <div className="text-center">
                  <FaGraduationCap className="text-4xl mb-3" />
                  <h3 className="text-lg font-bold mb-2">{cert.title}</h3>
                  <div className="text-white/90 text-sm">{cert.course}</div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600">Issue Date</div>
                    <div className="font-medium text-gray-900">{cert.issueDate}</div>
                  </div>
                  {cert.score && (
                    <div>
                      <div className="text-gray-600">Score</div>
                      <div className="font-medium text-gray-900">
                        {cert.score}% ({cert.grade})
                      </div>
                    </div>
                  )}
                  {cert.attendance && (
                    <div>
                      <div className="text-gray-600">Attendance</div>
                      <div className="font-medium text-gray-900">{cert.attendance}</div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <div className="text-gray-600">Certificate No.</div>
                    <div className="font-medium text-gray-900 text-xs">{cert.certificateNumber}</div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 btn-primary text-sm py-2">
                    Download PDF
                  </button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                    👁️
                  </button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                    🔗
                  </button>
                </div>

                <div className="flex items-center justify-center text-xs text-green-600 pt-2">
                  <FaCheck className="mr-1" />
                  Verified Certificate
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Certificates */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">In Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingCertificates.map((cert) => (
            <div key={cert.id} className="card">
              <div className="flex items-start space-x-4">
                <div className={`${cert.color} text-white p-4 rounded-lg`}>
                  <FaAward className="text-3xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{cert.course}</p>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{cert.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${cert.color} h-2 rounded-full transition-all`}
                        style={{ width: `${cert.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="text-gray-600">
                      <span className="font-medium">Requirement:</span> {cert.requirement}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Est. Date:</span> {cert.estimatedDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievement Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="card text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-3">{achievement.icon}</div>
              <h4 className="font-bold text-gray-900 mb-1">{achievement.title}</h4>
              <p className="text-xs text-gray-600">Earned {achievement.earned}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Share Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 mt-8">
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Achievements!</h3>
          <p className="text-gray-600 mb-4">
            Let your friends and family know about your success
          </p>
          <div className="flex justify-center space-x-3">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              Share on Facebook
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificates;
