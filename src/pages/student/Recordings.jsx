import { useState, useEffect } from 'react';
import { FaBook, FaCalendar, FaCheck, FaGraduationCap, FaSearch, FaTimes } from 'react-icons/fa';

const dummyRecordings = [
  { id: 1, title: 'Intro to React', instructor: 'John Doe', date: '2024-03-10', subject: 'JavaScript' },
  { id: 2, title: 'Advanced CSS', instructor: 'Jane Smith', date: '2024-03-09', subject: 'CSS' },
];

const StudentRecordings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [recordings, setRecordings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  const fetchStudentData = () => {
    setLoading(true);
    setTimeout(() => {
      setCourses([{ id: 1, title: 'JavaScript' }, { id: 2, title: 'CSS' }]);
      setSubjects(['JavaScript', 'CSS']);
      setRecordings(dummyRecordings);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudentData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredRecordings = recordings.filter((rec) => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.description && rec.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rec.course_title && rec.course_title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = filterSubject === 'all' || 
      (rec.course_title && rec.course_title === filterSubject) ||
      (rec.subject && rec.subject === filterSubject);
    
    return matchesSearch && matchesSubject;
  });

  const getThumbnailColor = (index) => {
    const colors = ['bg-green-600', 'bg-purple-600', 'bg-yellow-600', 'bg-red-600', 'bg-blue-600', 'bg-indigo-600'];
    return colors[index % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

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
            {recordings.filter((r) => r.is_watched).length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">From Enrolled Courses</div>
          <div className="text-2xl font-bold text-primary-600">{courses.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Available Recordings</div>
          <div className="text-2xl font-bold text-gray-900">{filteredRecordings.length}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search recordings by title, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex space-x-2 flex-wrap gap-2">
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
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setFilterSubject(subject)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    filterSubject === subject
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subject.length > 15 ? subject.substring(0, 15) + '...' : subject}
                </button>
              ))
            ) : (
              <span className="text-gray-500 px-4 py-2">No courses available</span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading recordings...</p>
        </div>
      ) : (
      <div>
      {/* Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecordings.map((recording, index) => (
          <div key={recording.id} className="card hover:shadow-lg transition-shadow">
            {/* Thumbnail */}
            <div className={`${getThumbnailColor(index)} text-white p-8 -m-6 mb-4 rounded-t-xl relative`}>
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl">▶️</div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm">
                {formatDuration(recording.duration)}
              </div>
              {recording.is_watched && recording.watch_progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div
                    className="h-1 bg-white"
                    style={{ width: `${recording.watch_progress}%` }}
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
                <span>📅 {formatDate(recording.created_at || recording.date)}</span>
                <span>👁️ {recording.views || 0} views</span>
              </div>

              {recording.is_watched && recording.watch_progress > 0 && recording.watch_progress < 100 && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${recording.watch_progress}%` }}
                    />
                  </div>
                  <span className="text-gray-600 font-medium">{recording.watch_progress}%</span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  {recording.is_watched && recording.watch_progress > 0 && recording.watch_progress < 100
                    ? 'Continue Watching'
                    : recording.is_watched && recording.watch_progress === 100
                    ? 'Watch Again'
                    : 'Watch Now'}
                </button>
                <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                  📥
                </button>
              </div>

              {recording.is_watched && (
                <div className="flex items-center text-xs text-green-600">
                  <FaCheck className="mr-1" />
                  Watched {recording.watch_progress === 100 ? 'completely' : 'partially'}
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
      )}
    </div>
  );
};

export default StudentRecordings;
