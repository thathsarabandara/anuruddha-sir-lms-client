import { useState } from 'react';
import Notification from '../../components/common/Notification';
import { FaAward, FaCheck, FaFilePdf, FaGem, FaLightbulb, FaTimes, FaTrophy, FaUsers, FaCoins, FaFire } from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';

const TeacherRewards = () => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });

  const rewardStats = {
    coinsDistributed: 15420,
    gemsDistributed: 245,
    activeStudents: 245,
    thisMonth: 2850,
  };

  const recentRewards = [
    { id: 1, student: 'Kasun P.', reward: 50, type: 'coins', reason: 'Quiz Excellence', date: 'Today' },
    { id: 2, student: 'Nimal S.', reward: 5, type: 'gems', reason: 'Perfect Attendance', date: 'Today' },
    { id: 3, student: 'Saman W.', reward: 100, type: 'coins', reason: 'Top 3 Leaderboard', date: 'Yesterday' },
    { id: 4, student: 'Ruwan K.', reward: 25, type: 'coins', reason: 'Homework Completion', date: 'Yesterday' },
    { id: 5, student: 'Amila J.', reward: 3, type: 'gems', reason: 'Class Participation', date: '2 days ago' },
  ];

  const topEarners = [
    { rank: 1, student: 'Kasun Perera', coins: 1250, gems: 35, badge: '🥇' },
    { rank: 2, student: 'Nimal Silva', coins: 1180, gems: 32, badge: '🥈' },
    { rank: 3, student: 'Saman W.', coins: 1120, gems: 28, badge: '🥉' },
  ];

  const rewardTemplates = [
    { id: 1, title: 'Quiz Excellence', coins: 50, gems: 0, icon: FaFilePdf },
    { id: 2, title: 'Perfect Attendance', coins: 0, gems: 5, icon: '⭐' },
    { id: 3, title: 'Top 3 Leaderboard', coins: 100, gems: 0, icon: FaTrophy },
    { id: 4, title: 'Help a Classmate', coins: 25, gems: 0, icon: '🤝' },
    { id: 5, title: 'Homework Completion', coins: 0, gems: 3, icon: FaCheck },
    { id: 6, title: 'Class Participation', coins: 30, gems: 0, icon: FaAward },
  ];

  // Rewards metrics for StatCard
  const rewardsMetricsConfig = [
    {
      label: 'Total Coins',
      statsKey: 'coinsDistributed',
      icon: FaCoins,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'distributed to students',
    },
    {
      label: 'Total Gems',
      statsKey: 'gemsDistributed',
      icon: FaGem,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'premium rewards given',
    },
    {
      label: 'This Month',
      statsKey: 'thisMonth',
      icon: FaFire,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'rewards distributed',
    },
    {
      label: 'Active Students',
      statsKey: 'activeStudents',
      icon: FaUsers,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'earning rewards',
    },
  ];

  return (
    <div className="p-8">
      {notification && (
        <div className="mb-4">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Rewards</h1>
          <p className="text-gray-600">Manage and distribute rewards to students</p>
        </div>
        <button onClick={() => setShowAssignModal(true)} className="btn-primary px-6">
          + Assign Reward
        </button>
      </div>

      {/* Stats */}
      <StatCard stats={rewardStats} metricsConfig={rewardsMetricsConfig} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Rewards */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Reward Activity</h2>
            <div className="space-y-3">
              {recentRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`${reward.type === 'coins' ? 'bg-yellow-100' : 'bg-blue-100'} p-3 rounded-lg`}>
                      <div className="text-2xl">{reward.type === 'coins' ? '🪙' : '💎'}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{reward.student}</div>
                      <div className="text-sm text-gray-600">{reward.reason}</div>
                      <div className="text-xs text-gray-500">{reward.date}</div>
                    </div>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      reward.type === 'coins' ? 'text-yellow-600' : 'text-blue-600'
                    }`}
                  >
                    +{reward.reward}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reward Templates */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Reward Templates</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {rewardTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setShowAssignModal(true)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                >
                  <div className="text-4xl mb-2">{template.icon}</div>
                  <div className="font-medium text-gray-900 text-sm mb-2">{template.title}</div>
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    {template.coins > 0 && (
                      <span className="text-yellow-600 font-bold">{template.coins} 🪙</span>
                    )}
                    {template.gems > 0 && <span className="text-blue-600 font-bold">{template.gems} 💎</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Top Earners */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FaTrophy className="mr-2" />
              Top Reward Earners
            </h3>
            <div className="space-y-3">
              {topEarners.map((earner) => (
                <div key={earner.rank} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-2xl">{earner.badge}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{earner.student}</div>
                      <div className="text-xs text-gray-600">Rank #{earner.rank}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-600 font-bold">{earner.coins} 🪙</span>
                    <span className="text-blue-600 font-bold">{earner.gems} 💎</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reward Guide */}
          <div className="card bg-blue-50 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Reward Guidelines</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Coins:</strong> For regular achievements
              </p>
              <p>
                <strong>Gems:</strong> For exceptional performance
              </p>
              <p className="pt-2 border-t">
                <strong>Suggested Amounts:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Quiz completion: 25-50 coins</li>
                <li>Top 3 rank: 100 coins</li>
                <li>Perfect attendance: 5 gems</li>
                <li>Outstanding work: 10 gems</li>
              </ul>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Distribution Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Coins</span>
                  <span className="font-medium">86%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '86%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Gems</span>
                  <span className="font-medium">14%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Reward Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Assign Reward</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select className="input-field">
                  <option>Select a student...</option>
                  <option>Kasun Perera</option>
                  <option>Nimal Silva</option>
                  <option>Saman Wickramasinghe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="p-4 border-2 border-yellow-500 bg-yellow-50 rounded-lg text-center"
                  >
                    <div className="text-3xl mb-1">🪙</div>
                    <div className="text-sm font-medium">Coins</div>
                  </button>
                  <button type="button" className="p-4 border-2 border-gray-300 rounded-lg text-center">
                    <FaGem className="text-3xl mb-1" />
                    <div className="text-sm font-medium">Gems</div>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input type="number" className="input-field" placeholder="50" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea rows="3" className="input-field" placeholder="Excellent quiz performance" required />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Assign Reward
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 btn-outline"
                >
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

export default TeacherRewards;
