import React, { useState, useEffect } from 'react';
import { studentRewardsAPI } from '../../api/rewardsApi';

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await studentRewardsAPI.getCoupons();
      setCoupons(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    if (filter === 'active') return coupon.status === 'ACTIVE';
    if (filter === 'used') return coupon.status === 'USED';
    if (filter === 'expired') return coupon.status === 'EXPIRED';
    return true;
  });

  const getCouponBadgeColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'USED': return 'bg-gray-100 text-gray-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg p-4 h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'all' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'active' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('used')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'used' 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Used
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {filteredCoupons.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg font-semibold">No coupons found</p>
          <p className="text-sm">Create your first coupon to get started!</p>
        </div>
      ) : (
        filteredCoupons.map(coupon => (
          <div key={coupon.id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg font-mono text-purple-600">{coupon.code}</h3>
                {coupon.description && (
                  <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCouponBadgeColor(coupon.status)}`}>
                {coupon.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              {coupon.gems_cost > 0 && (
                <div className="bg-orange-50 p-2 rounded">
                  <p className="text-gray-600">Cost</p>
                  <p className="font-semibold text-orange-600">{coupon.gems_cost} 💎</p>
                </div>
              )}
              {coupon.gems_reward > 0 && (
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-gray-600">Reward</p>
                  <p className="font-semibold text-green-600">+{coupon.gems_reward} 💎</p>
                </div>
              )}
              {coupon.discount_percentage > 0 && (
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-gray-600">Discount</p>
                  <p className="font-semibold text-blue-600">{coupon.discount_percentage}%</p>
                </div>
              )}
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-600">Usage</p>
                <p className="font-semibold">{coupon.current_usage}/{coupon.max_usage}</p>
              </div>
            </div>

            <div className="text-xs text-gray-500 border-t pt-2">
              <p>Expires: {new Date(coupon.expiry_date).toLocaleDateString()}</p>
              {coupon.is_valid ? (
                <p className="text-green-600 font-semibold">✓ Valid</p>
              ) : (
                <p className="text-red-600 font-semibold">✗ Expired or Invalid</p>
              )}
            </div>
          </div>
        ))
      )}

      <button
        onClick={fetchCoupons}
        className="w-full mt-4 bg-purple-100 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-200 transition"
      >
        Refresh
      </button>
    </div>
  );
};

export default CouponsList;
