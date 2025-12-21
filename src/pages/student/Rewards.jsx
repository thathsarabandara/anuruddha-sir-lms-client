import { useState } from 'react';
import { FaBook, FaCheck, FaFilePdf, FaGem, FaGraduationCap, FaTrophy, FaVideo } from 'react-icons/fa';

const StudentRewards = () => {
  const [selectedTab, setSelectedTab] = useState('balance');

  const rewardBalance = {
    coins: 1250,
    gems: 35,
    totalValue: 6250, // in Rs.
  };

  const recentEarnings = [
    {
      id: 1,
      title: 'Completed Mathematics Quiz',
      amount: 50,
      type: 'coins',
      date: 'Today',
      icon: FaFilePdf,
      color: 'text-yellow-600',
    },
    {
      id: 2,
      title: 'Perfect Attendance - Week 50',
      amount: 5,
      type: 'gems',
      date: 'Yesterday',
      icon: '⭐',
      color: 'text-blue-600',
    },
    {
      id: 3,
      title: 'Top 3 in Quiz Leaderboard',
      amount: 100,
      type: 'coins',
      date: '2 days ago',
      icon: FaTrophy,
      color: 'text-yellow-600',
    },
    {
      id: 4,
      title: 'Helped a Classmate',
      amount: 25,
      type: 'coins',
      date: '3 days ago',
      icon: '🤝',
      color: 'text-yellow-600',
    },
    {
      id: 5,
      title: 'Completed All Homework',
      amount: 3,
      type: 'gems',
      date: '4 days ago',
      icon: FaCheck,
      color: 'text-blue-600',
    },
  ];

  const redeemableItems = [
    {
      id: 1,
      title: 'Free Study Material Pack',
      description: 'Get access to premium study materials',
      cost: 500,
      type: 'coins',
      icon: FaBook,
      available: true,
    },
    {
      id: 2,
      title: 'One-on-One Session',
      description: '30-minute private session with teacher',
      cost: 10,
      type: 'gems',
      icon: FaBook,
      available: true,
    },
    {
      id: 3,
      title: 'Certificate Frame',
      description: 'Beautiful frame for your certificates',
      cost: 800,
      type: 'coins',
      icon: '🖼️',
      available: true,
    },
    {
      id: 4,
      title: 'Premium Recordings Access',
      description: '1 month access to all premium recordings',
      cost: 15,
      type: 'gems',
      icon: FaVideo,
      available: true,
    },
    {
      id: 5,
      title: 'Scholarship Hoodie',
      description: 'Official scholarship program hoodie',
      cost: 2000,
      type: 'coins',
      icon: '👕',
      available: false,
    },
    {
      id: 6,
      title: 'Exclusive Webinar Access',
      description: 'Access to special exam preparation webinar',
      cost: 20,
      type: 'gems',
      icon: '🌟',
      available: true,
    },
  ];

  const rewardHistory = [
    {
      id: 1,
      title: 'Redeemed Free Study Material Pack',
      amount: -500,
      type: 'coins',
      date: 'Dec 10, 2025',
      status: 'delivered',
    },
    {
      id: 2,
      title: 'Earned Quiz Champion Badge',
      amount: 100,
      type: 'coins',
      date: 'Dec 5, 2025',
      status: 'earned',
    },
    {
      id: 3,
      title: 'Redeemed One-on-One Session',
      amount: -10,
      type: 'gems',
      date: 'Nov 28, 2025',
      status: 'completed',
    },
  ];

  const earnMethods = [
    { title: 'Complete a Quiz', reward: '25-100 coins', icon: FaFilePdf },
    { title: 'Perfect Attendance (Weekly)', reward: '5 gems', icon: '⭐' },
    { title: 'Top 3 in Leaderboard', reward: '100 coins', icon: FaTrophy },
    { title: 'Help a Classmate', reward: '25 coins', icon: '🤝' },
    { title: 'Complete All Homework', reward: '3 gems', icon: FaCheck },
    { title: 'Watch All Class Recordings', reward: '50 coins', icon: FaVideo },
  ];

  return (
    <div className="p-8">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Rewards & Achievements
                </h1>
                <p className="text-slate-600 mt-1">Earn coins and gems, redeem exciting rewards</p>
              </div>
              <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
            </div>
          </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Reward Coins</span>
            <span className="text-3xl">🪙</span>
          </div>
          <div className="text-4xl font-bold mb-1">{rewardBalance.coins}</div>
          <div className="text-sm opacity-90">≈ Rs. {(rewardBalance.coins * 5).toLocaleString()}</div>
        </div>

        <div className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Premium Gems</span>
            <FaGem className="text-3xl" />
          </div>
          <div className="text-4xl font-bold mb-1">{rewardBalance.gems}</div>
          <div className="text-sm opacity-90">≈ Rs. {(rewardBalance.gems * 100).toLocaleString()}</div>
        </div>

        <div className="card bg-gradient-to-br from-green-400 to-green-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Total Value</span>
            <span className="text-3xl">💰</span>
          </div>
          <div className="text-4xl font-bold mb-1">Rs. {rewardBalance.totalValue.toLocaleString()}</div>
          <div className="text-sm opacity-90">in rewards earned</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setSelectedTab('balance')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'balance'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recent Earnings
        </button>
        <button
          onClick={() => setSelectedTab('redeem')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'redeem'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Redeem Rewards
        </button>
        <button
          onClick={() => setSelectedTab('history')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'history'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setSelectedTab('earn')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'earn'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          How to Earn
        </button>
      </div>

      {/* Recent Earnings */}
      {selectedTab === 'balance' && (
        <div className="space-y-3">
          {recentEarnings.map((earning) => (
            <div key={earning.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{earning.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{earning.title}</div>
                    <div className="text-sm text-gray-600">{earning.date}</div>
                  </div>
                </div>
                <div className={`text-right ${earning.color}`}>
                  <div className="text-2xl font-bold">
                    +{earning.amount} {earning.type === 'coins' ? '🪙' : '💎'}
                  </div>
                  <div className="text-xs">{earning.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Redeem Rewards */}
      {selectedTab === 'redeem' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {redeemableItems.map((item) => (
            <div
              key={item.id}
              className={`card ${!item.available ? 'opacity-60' : ''}`}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-3xl">{item.type === 'coins' ? '🪙' : '💎'}</span>
                  <span className="text-2xl font-bold text-gray-900">{item.cost}</span>
                </div>

                {item.available ? (
                  <button
                    className={`w-full py-2 rounded-lg font-medium ${
                      (item.type === 'coins' && rewardBalance.coins >= item.cost) ||
                      (item.type === 'gems' && rewardBalance.gems >= item.cost)
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={
                      (item.type === 'coins' && rewardBalance.coins < item.cost) ||
                      (item.type === 'gems' && rewardBalance.gems < item.cost)
                    }
                  >
                    {(item.type === 'coins' && rewardBalance.coins >= item.cost) ||
                    (item.type === 'gems' && rewardBalance.gems >= item.cost)
                      ? 'Redeem Now'
                      : 'Insufficient Balance'}
                  </button>
                ) : (
                  <div className="py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {selectedTab === 'history' && (
        <div className="space-y-3">
          {rewardHistory.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.date}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div
                    className={`text-xl font-bold ${
                      item.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.amount > 0 ? '+' : ''}
                    {item.amount} {item.type === 'coins' ? '🪙' : '💎'}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'delivered' || item.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How to Earn */}
      {selectedTab === 'earn' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnMethods.map((method, index) => (
            <div key={index} className="card text-center">
              <div className="text-5xl mb-3">{method.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{method.title}</h3>
              <div className="text-primary-600 font-bold">{method.reward}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentRewards;
