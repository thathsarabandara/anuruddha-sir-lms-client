import { useState, useMemo, useCallback } from 'react';
import { FaBook, FaCalendar, FaCheck, FaClock, FaFileVideo, FaUsers, FaVideo, FaSearch, FaFilter, FaTimes, FaGraduationCap } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';

const StudentLiveClasses = () => {
  const [filter, setFilter] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const upcomingClasses = useMemo(() => [
    {
      id: 1,
      title: 'Mathematics - Chapter 5',
      subject: 'Mathematics',
      instructor: 'Anuruddha Sir',
      date: 'Today',
      time: '4:00 PM - 5:30 PM',
      duration: '1.5 hours',
      zoomLink: 'https://zoom.us/j/12345',
      status: 'starting-soon',
      attendees: 45,
      color: 'bg-green-600',
    },
    {
      id: 2,
      title: 'Sinhala Language - Grammar',
      subject: 'Sinhala',
      instructor: 'Anuruddha Sir',
      date: 'Tomorrow',
      time: '3:00 PM - 4:30 PM',
      duration: '1.5 hours',
      zoomLink: 'https://zoom.us/j/12346',
      status: 'scheduled',
      attendees: 38,
      color: 'bg-purple-600',
    },
    {
      id: 3,
      title: 'Environment Studies - Unit 3',
      subject: 'Environment',
      instructor: 'Anuruddha Sir',
      date: 'Friday, Dec 20',
      time: '2:00 PM - 3:30 PM',
      duration: '1.5 hours',
      zoomLink: 'https://zoom.us/j/12347',
      status: 'scheduled',
      attendees: 42,
      color: 'bg-yellow-600',
    },
  ], []);

  const completedClasses = useMemo(() => [
    {
      id: 4,
      title: 'Mathematics - Chapter 4',
      subject: 'Mathematics',
      instructor: 'Anuruddha Sir',
      date: 'Dec 15, 2025',
      time: '4:00 PM - 5:30 PM',
      duration: '1.5 hours',
      attended: true,
      recordingAvailable: true,
      color: 'bg-green-600',
    },
    {
      id: 5,
      title: 'Sinhala - Essay Writing',
      subject: 'Sinhala',
      instructor: 'Anuruddha Sir',
      date: 'Dec 13, 2025',
      time: '3:00 PM - 4:30 PM',
      duration: '1.5 hours',
      attended: true,
      recordingAvailable: true,
      color: 'bg-purple-600',
    },
    {
      id: 6,
      title: 'Mathematics - Chapter 3',
      subject: 'Mathematics',
      instructor: 'Anuruddha Sir',
      date: 'Dec 11, 2025',
      time: '4:00 PM - 5:30 PM',
      duration: '1.5 hours',
      attended: false,
      recordingAvailable: true,
      color: 'bg-green-600',
    }
  ], []);

  // Filter logic
  const applyFilters = useCallback((classes) => {
    return classes.filter(classItem => {
      // Search filter
      const matchesSearch = 
        classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.subject.toLowerCase().includes(searchQuery.toLowerCase());

      // Subject filter
      const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(classItem.subject);

      // Status filter (only for upcoming)
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(classItem.status);

      return matchesSearch && matchesSubject && (filter === 'upcoming' ? matchesStatus : true);
    });
  }, [searchQuery, selectedSubjects, selectedStatus, filter]);

  const filteredUpcomingClasses = useMemo(() => applyFilters(upcomingClasses), [applyFilters, upcomingClasses]);
  const filteredCompletedClasses = useMemo(() => applyFilters(completedClasses), [applyFilters, completedClasses]);

  const displayClasses = filter === 'upcoming' ? filteredUpcomingClasses : filteredCompletedClasses;
  const subjects = ['Mathematics', 'Sinhala', 'Environment', 'English', 'Tamil'];
  const statuses = ['starting-soon', 'scheduled'];

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleStatusToggle = (status) => {
    setSelectedStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubjects([]);
    setSelectedStatus([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 mb-5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Live Classes
                </h1>
                <p className="text-slate-600 mt-1">Join live interactive sessions with Anuruddha Sir</p>
              </div>
              <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
            </div>
          </div>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-600 font-semibold mb-1">This Month</div>
          <div className="text-3xl font-bold text-slate-900">12</div>
          <p className="text-xs text-slate-500 mt-1">Classes</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-600 font-semibold mb-1">Attended</div>
          <div className="text-3xl font-bold text-green-600">10</div>
          <p className="text-xs text-slate-500 mt-1">Classes</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-600 font-semibold mb-1">Attendance Rate</div>
          <div className="text-3xl font-bold text-blue-600">83%</div>
          <p className="text-xs text-slate-500 mt-1">This month</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-600 font-semibold mb-1">Next Class</div>
          <div className="text-3xl font-bold text-purple-600">Today</div>
          <p className="text-xs text-slate-500 mt-1">4:00 PM</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setFilter('upcoming')}
          className={`pb-3 px-4 font-semibold transition-all ${
            filter === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming ({filteredUpcomingClasses.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`pb-3 px-4 font-semibold transition-all ${
            filter === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed ({filteredCompletedClasses.length})
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search classes by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold text-slate-700"
          >
            <FaFilter /> Filters
          </button>

          {/* Clear Button */}
          {(searchQuery || selectedSubjects.length > 0 || selectedStatus.length > 0) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all font-semibold text-slate-700"
            >
              <FaTimes /> Clear
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Filter */}
              <div>
                <h6 className="font-bold text-slate-900 mb-3">Subject</h6>
                <div className="space-y-2">
                  {subjects.map(subject => (
                    <label key={subject} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        className="w-4 h-4 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-slate-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter (for upcoming classes) */}
              {filter === 'upcoming' && (
                <div>
                  <h6 className="font-bold text-slate-900 mb-3">Status</h6>
                  <div className="space-y-2">
                    {statuses.map(status => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatus.includes(status)}
                          onChange={() => handleStatusToggle(status)}
                          className="w-4 h-4 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-slate-700 capitalize">
                          {status === 'starting-soon' ? 'Starting Soon' : 'Scheduled'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Classes List */}

      {/* Upcoming Classes */}
      {filter === 'upcoming' && (
        <div>
          {displayClasses.length > 0 ? (
            <div className="space-y-4">
              {displayClasses.map((class_) => (
            <div key={class_.id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start gap-4 p-6">
                {/* Icon */}
                <div className={`${class_.color} text-white p-4 rounded-lg flex-shrink-0`}>
                  <FaVideo className="text-2xl" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{class_.title}</h3>
                    {class_.status === 'starting-soon' && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
                        <GoDotFill className='text-red-500 h-4 w-4' /> STARTING SOON
                      </span>
                    )}
                    {class_.status === 'scheduled' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full flex items-center gap-1">
                        <FaCalendar className='text-blue-500 h-3 w-3' /> SCHEDULED
                      </span>
                    )}
                  </div>

                  {/* Class Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaBook className="flex-shrink-0" />
                      <span className="font-semibold">{class_.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaUsers className="flex-shrink-0" />
                      <span>{class_.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaCalendar className="flex-shrink-0" />
                      <span>{class_.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaClock className="flex-shrink-0" />
                      <span>{class_.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaClock className="flex-shrink-0" />
                      <span>{class_.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaUsers className="flex-shrink-0" />
                      <span>{class_.attendees} students enrolled</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full lg:w-auto">
                  <button
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                      class_.status === 'starting-soon'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {class_.status === 'starting-soon' ? '✓ Join Now' : '🔔 Set Reminder'}
                  </button>
                  <button className="px-6 py-2.5 border-2 border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-slate-700 transition-all">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <FaSearch className="text-5xl text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold text-lg">No classes found</p>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Completed Classes */}
      {filter === 'completed' && (
        <div>
          {displayClasses.length > 0 ? (
            <div className="space-y-4">
              {displayClasses.map((class_) => (
                <div key={class_.id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden">
                  <div className="flex flex-col lg:flex-row items-start gap-4 p-6">
                    {/* Icon */}
                    <div className={`${class_.color} text-white p-4 rounded-lg flex-shrink-0 opacity-75`}>
                      <FaCheck className="text-2xl" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-lg font-bold text-slate-900">{class_.title}</h3>
                        {class_.attended ? (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">
                            ✓ ATTENDED
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                            ✗ MISSED
                          </span>
                        )}
                        {class_.recordingAvailable && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full flex items-center gap-1">
                            <FaVideo className='text-blue-500 h-3 w-3' /> RECORDING
                          </span>
                        )}
                      </div>

                      {/* Class Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaBook className="flex-shrink-0" />
                          <span className="font-semibold">{class_.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaUsers className="flex-shrink-0" />
                          <span>{class_.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaCalendar className="flex-shrink-0" />
                          <span>{class_.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaClock className="flex-shrink-0" />
                          <span>{class_.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 w-full lg:w-auto">
                      {class_.recordingAvailable && (
                        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all whitespace-nowrap">
                          <FaVideo className='inline-block mr-2 h-4 w-4' /> Watch Recording
                        </button>
                      )}
                      <button className="px-6 py-2.5 border-2 border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-slate-700 transition-all">
                        Materials
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <FaSearch className="text-5xl text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold text-lg">No classes found</p>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentLiveClasses;
