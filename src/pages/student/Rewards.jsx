import { useState, useMemo } from 'react';
import { FaBook, FaCheck, FaFilePdf, FaGem, FaGraduationCap, FaTrophy, FaVideo, FaCoins, FaStar, FaHandshake, FaAward, FaWallet } from 'react-icons/fa';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';

const StudentRewards = () => {
  const [selectedTab, setSelectedTab] = useState('earnings');
  const [searchTerm, setSearchTerm] = useState('');
  const [redeemSearchTerm, setRedeemSearchTerm] = useState('');
  const [redeemTypeFilter, setRedeemTypeFilter] = useState('all');

  const rewardBalance = useMemo(() => ({
    coins: 1250,
    gems: 30,
    totalValue: 1250 * 5 + 30 * 100, // Assuming 1 coin = Rs.5 and 1 gem = Rs.100
  }), []);

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
      icon: FaStar,
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
      icon: FaHandshake,
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

  const redeemableItems = useMemo(() => [
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
      icon: FaAward,
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
      icon: FaTrophy,
      available: false,
    },
    {
      id: 6,
      title: 'Exclusive Webinar Access',
      description: 'Access to special exam preparation webinar',
      cost: 20,
      type: 'gems',
      icon: FaStar,
      available: true,
    },
  ], []);

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

  // Calculate metrics for stat cards
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stats = {
    coins: rewardBalance.coins,
    gems: rewardBalance.gems,
    totalValue: rewardBalance.totalValue,
    activitiesCompleted: recentEarnings.length,
    itemsRedeemed: rewardHistory.filter(item => item.amount < 0).length,
  };

  const rewardsMetricsConfig = useMemo(() => [
    {
      label: 'Reward Coins',
      statsKey: 'coins',
      icon: FaCoins,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: `≈ Rs. ${(stats.coins * 5).toLocaleString()}`,
      formatter: (value) => `${value} pts`,
    },
    {
      label: 'Premium Gems',
      statsKey: 'gems',
      icon: FaGem,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: `≈ Rs. ${(stats.gems * 100).toLocaleString()}`,
      formatter: (value) => `${value} pts`,
    },
    {
      label: 'Total Value',
      statsKey: 'totalValue',
      icon: FaWallet,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'from all rewards',
      formatter: (value) => `Rs. ${(value / 1000).toFixed(1)}k`,
    },
    {
      label: 'Activities',
      statsKey: 'activitiesCompleted',
      icon: FaTrophy,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: `${stats.itemsRedeemed} items redeemed`,
      formatter: (value) => `${value} done`,
    },
  ], [stats]);

  const earnMethods = [
    { title: 'Complete a Quiz', reward: '25-100 coins', icon: FaFilePdf },
    { title: 'Perfect Attendance (Weekly)', reward: '5 gems', icon: FaStar },
    { title: 'Top 3 in Leaderboard', reward: '100 coins', icon: FaTrophy },
    { title: 'Help a Classmate', reward: '25 coins', icon: FaHandshake },
    { title: 'Complete All Homework', reward: '3 gems', icon: FaCheck },
    { title: 'Watch All Class Recordings', reward: '50 coins', icon: FaVideo },
  ];

  // Earnings Columns for DataTable
  const earningsColumns = useMemo(() => [
    {
      key: 'title',
      label: 'Activity',
      width: '35%',
      render: (_, row) => {
        const Icon = row.icon;
        return (
          <div className="flex items-center space-x-3">
            <div className="text-2xl text-gray-700">
              <Icon />
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.title}</div>
              <div className="text-sm text-gray-600">{row.date}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      width: '20%',
      render: (_, row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 w-fit ${
          row.type === 'coins' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {row.type === 'coins' ? <FaCoins /> : <FaGem />}
          <span>{row.type === 'coins' ? 'Coins' : 'Gems'}</span>
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '25%',
      render: (_, row) => (
        <div className={`text-lg font-bold ${row.type === 'coins' ? 'text-yellow-600' : 'text-blue-600'}`}>
          +{row.amount}
        </div>
      ),
    },
  ], []);

  // History Columns for DataTable
  const historyColumns = useMemo(() => [
    {
      key: 'title',
      label: 'Description',
      width: '40%',
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-sm text-gray-600">{row.date}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '25%',
      render: (_, row) => (
        <div className={`font-bold flex items-center space-x-2 ${row.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span>{row.amount > 0 ? '+' : ''}{row.amount}</span>
          {row.type === 'coins' ? <FaCoins /> : <FaGem />}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '25%',
      render: (_, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.status === 'delivered' || row.status === 'completed'
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {row.status.toUpperCase()}
        </span>
      ),
    },
  ], []);

  // Redeem Columns for DataTable
  const redeemColumns = useMemo(() => [
    {
      key: 'title',
      label: 'Reward Item',
      width: '30%',
      render: (_, row) => {
        const Icon = row.icon;
        return (
          <div className="flex items-center space-x-3">
            <div className="text-3xl text-gray-700">
              <Icon />
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.title}</div>
              <div className="text-xs text-gray-600">{row.description}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'cost',
      label: 'Cost',
      width: '20%',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          {row.type === 'coins' ? <FaCoins className="text-yellow-600" /> : <FaGem className="text-blue-600" />}
          <span className="font-bold text-gray-900">{row.cost}</span>
        </div>
      ),
    },
    {
      key: 'availability',
      label: 'Availability',
      width: '20%',
      render: (_, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
          row.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {row.available ? <FaCheck /> : null}
          <span>{row.available ? 'Available' : 'Coming Soon'}</span>
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      width: '30%',
      render: (_, row) => (
        <button
          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
            row.available && (
              (row.type === 'coins' && rewardBalance.coins >= row.cost) ||
              (row.type === 'gems' && rewardBalance.gems >= row.cost)
            )
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          disabled={
            !row.available || (
              (row.type === 'coins' && rewardBalance.coins < row.cost) ||
              (row.type === 'gems' && rewardBalance.gems < row.cost)
            )
          }
        >
          {!row.available ? 'Coming Soon' : 
           (row.type === 'coins' && rewardBalance.coins >= row.cost) ||
           (row.type === 'gems' && rewardBalance.gems >= row.cost)
            ? 'Redeem Now' : 'Insufficient'}
        </button>
      ),
    },
  ], [rewardBalance.coins, rewardBalance.gems]);

  // Filter redeem items by search and type
  const filteredRedeemItems = useMemo(() => {
    return redeemableItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(redeemSearchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(redeemSearchTerm.toLowerCase());
      const matchesType = redeemTypeFilter === 'all' || item.type === redeemTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [redeemSearchTerm, redeemTypeFilter, redeemableItems]);

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

      {/* Balance StatCards - 4 Metrics */}
      <StatCard
        stats={stats}
        metricsConfig={rewardsMetricsConfig}
      />

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => {
            setSelectedTab('earnings');
            setSearchTerm('');
          }}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'earnings'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recent Earnings ({recentEarnings.length})
        </button>
        <button
          onClick={() => {
            setSelectedTab('history');
            setSearchTerm('');
          }}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'history'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          History ({rewardHistory.length})
        </button>
        <button
          onClick={() => {
            setSelectedTab('redeem');
            setRedeemSearchTerm('');
            setRedeemTypeFilter('all');
          }}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'redeem'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Redeem Rewards ({redeemableItems.length})
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

      {/* Recent Earnings DataTable */}
      {selectedTab === 'earnings' && (
        <DataTable
          columns={earningsColumns}
          data={recentEarnings}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          pagination={{ itemsPerPage: 10 }}
          searchPlaceholder="Search earnings..."
        />
      )}

      {/* History DataTable */}
      {selectedTab === 'history' && (
        <DataTable
          columns={historyColumns}
          data={rewardHistory}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          pagination={{ itemsPerPage: 10 }}
          searchPlaceholder="Search history..."
        />
      )}

      {/* Redeem Rewards DataTable with Filters */}
      {selectedTab === 'redeem' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search rewards..."
                value={redeemSearchTerm}
                onChange={(e) => setRedeemSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={redeemTypeFilter}
              onChange={(e) => setRedeemTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="coins">Coins Only</option>
              <option value="gems">Gems Only</option>
            </select>
          </div>
          <DataTable
            columns={redeemColumns}
            data={filteredRedeemItems}
            pagination={{ itemsPerPage: 10 }}
            showSearch={false}
          />
        </div>
      )}

      {/* How to Earn Grid */}
      {selectedTab === 'earn' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-3 text-gray-700 flex justify-center">
                  <Icon />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{method.title}</h3>
                <div className="text-primary-600 font-bold">{method.reward}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentRewards;
