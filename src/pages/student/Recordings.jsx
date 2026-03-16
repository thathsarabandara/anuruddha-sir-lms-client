import { useState, useEffect } from 'react';
import { FaBook, FaCalendar, FaCheck, FaGraduationCap, FaTimes, FaVideo, FaEye, FaList } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

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

  const recordingsMetricsConfig = [
    {
      label: 'Total Recordings',
      statsKey: 'totalRecordings',
      icon: FaVideo,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'All available recordings',
    },
    {
      label: 'Watched',
      statsKey: 'watched',
      icon: FaEye,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Viewed recordings',
    },
    {
      label: 'Enrolled Courses',
      statsKey: 'enrolledCourses',
      icon: FaBook,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Courses with recordings',
    },
    {
      label: 'Available to Watch',
      statsKey: 'available',
      icon: FaList,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Unwatched recordings',
    },
  ];

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
      <StatCard 
        stats={{
          totalRecordings: recordings.length.toString(),
          watched: recordings.filter(r => r.is_watched).length.toString(),
          enrolledCourses: courses.length.toString(),
          available: filteredRecordings.length.toString(),
        }}
        metricsConfig={recordingsMetricsConfig}
      />

      {/* Recordings DataTable */}
      <DataTable
        data={filteredRecordings}
        columns={[
          {
            key: 'title',
            label: 'Recording Title',
            searchable: true,
            render: (value, recording) => (
              <div>
                <p className="text-sm font-medium text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{formatDate(recording.date)}</p>
              </div>
            ),
          },
          {
            key: 'instructor',
            label: 'Instructor',
            searchable: true,
            render: (value) => <p className="text-sm text-gray-600">{value}</p>,
          },
          {
            key: 'subject',
            label: 'Subject',
            searchable: true,
            filterable: true,
            filterOptions: subjects.map(subject => ({ label: subject, value: subject })),
            render: (value) => (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {value}
              </span>
            ),
          },
          {
            key: 'is_watched',
            label: 'View Status',
            render: (value) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {value ? 'Watched' : 'Unw atched'}
              </span>
            ),
          },
          {
            key: 'duration',
            label: 'Duration',
            render: (value) => <p className="text-sm text-gray-600">{formatDuration(value)}</p>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, recording) => (
              <button onClick={() => console.log('Watch recording:', recording.id)} className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs flex items-center gap-1 transition whitespace-nowrap">
                <FaEye /> Watch
              </button>
            ),
          },
        ]}
        config={{
          itemsPerPage: 10,
          searchPlaceholder: 'Search recordings by title, instructor...',
          hideSearch: false,
          emptyMessage: 'No recordings found',
          searchValue: searchTerm,
          onSearchChange: (value) => {
            setSearchTerm(value);
          },
          statusFilterOptions: subjects.map(subject => ({ label: subject, value: subject })),
          statusFilterValue: filterSubject,
          onStatusFilterChange: (value) => setFilterSubject(value),
        }}
        loading={loading}
      />

    </div>
  );
};

export default StudentRecordings;
