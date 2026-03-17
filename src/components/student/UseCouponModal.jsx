import React, { useState } from 'react';
import { studentRewardsAPI } from '../../api/rewardsApi';

const UseCouponModal = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await studentRewardsAPI.useCoupon(code.trim());
      setResult(response.data.data);
      setCode('');
      onSuccess?.();
      setTimeout(() => {
        setResult(null);
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to use coupon');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Use Coupon Code</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        {result && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4">
            <p className="font-semibold">Coupon Used Successfully! 🎉</p>
            {result.gems_reward > 0 && (
              <p className="text-sm">+{result.gems_reward} gems added</p>
            )}
            {result.discount_percentage > 0 && (
              <p className="text-sm">{result.discount_percentage}% discount applied</p>
            )}
            <p className="text-sm mt-2">Total Gems: {result.total_gems}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg tracking-widest font-mono"
              disabled={loading || !!result}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !!result}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Using...' : 'Use Coupon'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UseCouponModal;
