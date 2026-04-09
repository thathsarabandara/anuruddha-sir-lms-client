import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaBolt,
  FaCoins,
  FaGraduationCap,
  FaHandHoldingUsd,
  FaListAlt,
  FaTrophy,
} from 'react-icons/fa';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import Notification from '../../components/common/Notification';
import ButtonWithLoader from '../../components/common/ButtonWithLoader';
import { rewardAPI } from '../../api/reward';

const prettyLabel = (value) => {
  if (!value) return 'Coin Activity';
  return String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

const StudentRewards = () => {
  const [selectedTab, setSelectedTab] = useState('transactions');
  const [transactionType, setTransactionType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState({
    coins: 0,
    current_level: 'Bronze',
    progress_percentage: 0,
    points_to_next_level: 0,
    next_level: 'Silver',
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const loadRewardsData = useCallback(async (forceRecalculate = false) => {
    try {
      if (forceRecalculate) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [summaryResponse, transactionsResponse] = await Promise.all([
        rewardAPI.getMyRewardCoins(forceRecalculate),
        rewardAPI.getMyRewardCoinTransactions(1, 100, transactionType),
      ]);

      const summaryData = summaryResponse?.data?.data || {};
      const transactionData = transactionsResponse?.data?.data?.transactions || [];

      setSummary({
        coins: Number(summaryData?.coins || 0),
        current_level: summaryData?.current_level || 'Bronze',
        progress_percentage: Number(summaryData?.progress_percentage || 0),
        points_to_next_level: Number(summaryData?.points_to_next_level || 0),
        next_level: summaryData?.next_level || null,
      });
      setTransactions(Array.isArray(transactionData) ? transactionData : []);
    } catch (error) {
      showNotification(error?.message || 'Failed to load reward coins', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [transactionType]);

  useEffect(() => {
    void loadRewardsData(false);
  }, [loadRewardsData]);

  const stats = useMemo(() => ({
    coins: summary.coins,
    currentLevel: summary.current_level,
    levelProgress: summary.progress_percentage,
    pointsToNext: summary.points_to_next_level,
  }), [summary]);

  const rewardsMetricsConfig = useMemo(() => ([
    {
      label: 'Reward Coins',
      statsKey: 'coins',
      icon: FaCoins,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Total earned coins',
      formatter: (value) => `${value} coins`,
    },
    {
      label: 'Current Level',
      statsKey: 'currentLevel',
      icon: FaTrophy,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: summary.next_level ? `Next: ${summary.next_level}` : 'Max level reached',
    },
    {
      label: 'Level Progress',
      statsKey: 'levelProgress',
      icon: FaBolt,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Progress to next level',
      formatter: (value) => `${value}%`,
    },
    {
      label: 'Points To Next',
      statsKey: 'pointsToNext',
      icon: FaHandHoldingUsd,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: summary.next_level ? `To ${summary.next_level}` : 'No next level',
      formatter: (value) => `${value} pts`,
    },
  ]), [summary.next_level]);

  const transactionColumns = useMemo(() => [
    {
      key: 'activity_description',
      label: 'Activity',
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.activity_description || prettyLabel(row.activity_type)}
          </p>
          <p className="text-xs text-gray-500">{prettyLabel(row.activity_type)}</p>
        </div>
      ),
    },
    {
      key: 'transaction_type',
      label: 'Type',
      render: (_, row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.transaction_type === 'earned'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.transaction_type === 'earned' ? 'EARNED' : 'SPENT'}
        </span>
      ),
    },
    {
      key: 'points',
      label: 'Points',
      render: (_, row) => (
        <span
          className={`font-bold ${Number(row.points) >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {Number(row.points) >= 0 ? '+' : ''}
          {row.points}
        </span>
      ),
    },
    {
      key: 'balance_after',
      label: 'Balance',
      render: (value) => <span className="font-medium text-gray-800">{value ?? '-'}</span>,
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (value) => <span className="text-sm text-gray-600">{formatDateTime(value)}</span>,
    },
  ], []);

  const earnMethods = [
    { title: 'Complete Quizzes', reward: 'Earn points for correct answers' },
    { title: 'Finish Courses', reward: 'Gain bonus coins on completion' },
    { title: 'Stay Active Daily', reward: 'Build streaks and collect rewards' },
    { title: 'Join Challenges', reward: 'Win extra points from events' },
  ];

  return (
    <div className="p-8">
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reward Coins
              </h1>
              <p className="text-slate-600 mt-1">Track your coin level and recent coin activities</p>
            </div>
            <div className="text-5xl"><FaGraduationCap className="text-blue-600" /></div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <ButtonWithLoader
          label="Recalculate Coins"
          loadingLabel="Updating..."
          isLoading={refreshing}
          onClick={() => void loadRewardsData(true)}
          variant="primary"
          size="sm"
        />
      </div>

      <StatCard stats={stats} metricsConfig={rewardsMetricsConfig} />

      <div className="flex items-center gap-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setSelectedTab('transactions')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'transactions'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <FaListAlt /> Transactions
          </span>
        </button>
        <button
          onClick={() => setSelectedTab('earn')}
          className={`pb-3 px-4 font-medium transition-colors ${
            selectedTab === 'earn'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          How To Earn
        </button>
      </div>

      {selectedTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Transactions</option>
              <option value="earned">Earned</option>
              <option value="spent">Spent</option>
            </select>
          </div>

          <DataTable
            columns={transactionColumns}
            data={transactions}
            loading={loading}
            config={{
              itemsPerPage: 10,
              searchPlaceholder: 'Search transaction activity...',
              searchValue: searchTerm,
              onSearchChange: setSearchTerm,
              emptyMessage: 'No coin transactions found.',
            }}
          />
        </div>
      )}

      {selectedTab === 'earn' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {earnMethods.map((method) => (
            <div
              key={method.title}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-primary-600 font-medium">{method.reward}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentRewards;
