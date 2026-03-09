import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../../api/rewardsApi';

const RewardsLeaderboard = ({ limit = 50 }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.getLeaderboard(limit);
      setLeaderboard(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg p-4 h-16"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">💎 Gems Leaderboard</h2>
        <button
          onClick={fetchLeaderboard}
          className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition"
        >
          Refresh
        </button>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No leaderboard data yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.student_id}
              className={`p-4 rounded-lg flex items-center gap-4 transition ${
                entry.rank <= 3
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`text-2xl font-bold w-12 text-center ${getMedalColor(entry.rank)}`}>
                {getMedalEmoji(entry.rank)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{entry.student_name}</p>
                <div className="flex gap-4 mt-1 text-xs text-gray-600">
                  <span>Total: {entry.total_gems} 💎</span>
                  <span>Available: {entry.available_gems} 💎</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {entry.total_gems}
                </div>
                <p className="text-xs text-gray-500">gems</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchLeaderboard}
        className="w-full mt-4 bg-purple-100 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-200 transition"
      >
        Refresh Leaderboard
      </button>
    </div>
  );
};

export default RewardsLeaderboard;
