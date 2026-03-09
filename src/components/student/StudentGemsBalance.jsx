import React, { useState, useEffect } from 'react';
import { studentRewardsAPI } from '../../api/rewardsApi';

const StudentGemsBalance = () => {
  const [gems, setGems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGems();
  }, []);

  const fetchGems = async () => {
    try {
      setLoading(true);
      const response = await studentRewardsAPI.getGems();
      setGems(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch gems');
      console.error('Error fetching gems:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-6 text-white">
        <div className="h-8 bg-white bg-opacity-20 rounded w-1/3"></div>
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
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white shadow-lg">
      <h3 className="text-lg font-semibold mb-4">💎 Your Gems</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-sm font-medium opacity-90">Total Gems</p>
          <p className="text-3xl font-bold">{gems?.total_gems || 0}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-sm font-medium opacity-90">Available</p>
          <p className="text-3xl font-bold text-yellow-300">{gems?.available_gems || 0}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-sm font-medium opacity-90">Locked</p>
          <p className="text-3xl font-bold text-orange-300">{gems?.locked_gems || 0}</p>
        </div>
      </div>
      <button
        onClick={fetchGems}
        className="mt-4 bg-white text-purple-600 px-4 py-2 rounded font-semibold hover:bg-opacity-90 transition"
      >
        Refresh
      </button>
    </div>
  );
};

export default StudentGemsBalance;
