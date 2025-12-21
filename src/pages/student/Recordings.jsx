import { useState } from 'react';
import { FaBook, FaCalendar,  FaCheck, FaGraduationCap } from 'react-icons/fa';

const StudentRecordings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const recordings = [
    {
      id: 1,
      title: 'Mathematics - Chapter 5: Fractions',
      subject: 'Mathematics',
      instructor: 'Anuruddha Sir',
      date: 'Dec 15, 2025',
      duration: '1:28:45',
      views: 156,
      watched: true,
      watchProgress: 100,
      thumbnail: 'bg-green-600',
      description: 'Complete lesson on fractions, addition and subtraction',
    },
    {
      id: 2,
      title: 'Sinhala - Essay Writing Techniques',
      subject: 'Sinhala',
      instructor: 'Anuruddha Sir',
      date: 'Dec 13, 2025',
      duration: '1:15:30',
      views: 142,
      watched: true,
      watchProgress: 65,
      thumbnail: 'bg-purple-600',
      description: 'How to write compelling essays for Grade 5',
    },
    {
      id: 3,
      title: 'Mathematics - Chapter 4: Multiplication',
      subject: 'Mathematics',
      instructor: 'Anuruddha Sir',
      date: 'Dec 11, 2025',
      duration: '1:35:20',
      views: 178,
      watched: false,
      watchProgress: 0,
      thumbnail: 'bg-green-600',
      description: 'Advanced multiplication techniques and shortcuts',
    },
    {
      id: 4,
      title: 'Environment - Ecosystem Balance',
      subject: 'Environment',
      instructor: 'Anuruddha Sir',
      date: 'Dec 10, 2025',
      duration: '1:20:15',
      views: 134,
      watched: true,
      watchProgress: 45,
      thumbnail: 'bg-yellow-600',
      description: 'Understanding food chains and natural balance',
    },
    {
      id: 5,
      title: 'English - Grammar Basics',
      subject: 'English',
      instructor: 'Anuruddha Sir',
      date: 'Dec 8, 2025',
      duration: '1:10:00',
      views: 98,
      watched: false,
      watchProgress: 0,
      thumbnail: 'bg-red-600',
      description: 'Essential grammar rules for scholarship exam',
    },
    {
      id: 6,
      title: 'Sinhala - Poetry Analysis',
      subject: 'Sinhala',
      instructor: 'Anuruddha Sir',
      date: 'Dec 6, 2025',
      duration: '1:05:45',
      views: 125,
      watched: false,
      watchProgress: 0,
      thumbnail: 'bg-purple-600',
      description: 'Analyzing classical Sinhala poetry',
    },
  ];

  const filteredRecordings = recordings.filter(
    (rec) =>
      (filterSubject === 'all' || rec.subject === filterSubject) &&
      rec.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Class Recordings
                </h1>
                <p className="text-slate-600 mt-1">Watch and review past live class sessions anytime</p>
              </div>
              <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
            </div>
          </div>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Recordings</div>
          <div className="text-2xl font-bold text-gray-900">{recordings.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Watched</div>
          <div className="text-2xl font-bold text-green-600">
            {recordings.filter((r) => r.watched).length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Watch Time</div>
          <div className="text-2xl font-bold text-primary-600">24.5 hrs</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">This Month</div>
          <div className="text-2xl font-bold text-gray-900">12 Videos</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterSubject('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterSubject === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterSubject('Mathematics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterSubject === 'Mathematics'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Maths
            </button>
            <button
              onClick={() => setFilterSubject('Sinhala')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterSubject === 'Sinhala'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sinhala
            </button>
            <button
              onClick={() => setFilterSubject('Environment')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterSubject === 'Environment'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Environment
            </button>
            <button
              onClick={() => setFilterSubject('English')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterSubject === 'English'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecordings.map((recording) => (
          <div key={recording.id} className="card hover:shadow-lg transition-shadow">
            {/* Thumbnail */}
            <div className={`${recording.thumbnail} text-white p-8 -m-6 mb-4 rounded-t-xl relative`}>
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl">▶️</div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm">
                {recording.duration}
              </div>
              {recording.watched && recording.watchProgress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div
                    className="h-1 bg-white"
                    style={{ width: `${recording.watchProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{recording.title}</h3>
                <p className="text-sm text-gray-600">{recording.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>📚 {recording.subject}</span>
                  <span>👨‍🏫 {recording.instructor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>📅 {recording.date}</span>
                <span>👁️ {recording.views} views</span>
              </div>

              {recording.watched && recording.watchProgress > 0 && recording.watchProgress < 100 && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${recording.watchProgress}%` }}
                    />
                  </div>
                  <span className="text-gray-600 font-medium">{recording.watchProgress}%</span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  {recording.watched && recording.watchProgress > 0 && recording.watchProgress < 100
                    ? 'Continue Watching'
                    : recording.watched && recording.watchProgress === 100
                    ? 'Watch Again'
                    : 'Watch Now'}
                </button>
                <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                  📥
                </button>
              </div>

              {recording.watched && (
                <div className="flex items-center text-xs text-green-600">
                  <FaCheck className="mr-1" />
                  Watched {recording.watchProgress === 100 ? 'completely' : 'partially'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRecordings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No recordings found</h3>
          <p className="text-gray-600">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
};

export default StudentRecordings;
