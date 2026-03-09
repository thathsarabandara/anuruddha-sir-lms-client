import React, { useState } from 'react';
import { adminRewardsAPI } from '../../api/rewardsApi';

const AdminRewardManager = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Send Reward Form
  const [sendForm, setSendForm] = useState({
    student_id: '',
    gems: 10,
    reason: ''
  });

  // Deduct Gems Form
  const [deductForm, setDeductForm] = useState({
    student_id: '',
    gems: 10,
    reason: ''
  });

  // Create Coupon Form
  const [couponForm, setCouponForm] = useState({
    gems_reward: 10,
    discount_percentage: 0,
    description: '',
    max_usage: 5,
    expiry_days: 30
  });

  const handleSendReward = async (e) => {
    e.preventDefault();
    if (!sendForm.student_id || sendForm.gems <= 0) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await adminRewardsAPI.sendReward(
        sendForm.student_id,
        sendForm.gems,
        sendForm.reason
      );
      setSuccess(`Reward of ${sendForm.gems} gems sent successfully!`);
      setSendForm({ student_id: '', gems: 10, reason: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reward');
    } finally {
      setLoading(false);
    }
  };

  const handleDeductGems = async (e) => {
    e.preventDefault();
    if (!deductForm.student_id || deductForm.gems <= 0) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await adminRewardsAPI.deductGems(
        deductForm.student_id,
        deductForm.gems,
        deductForm.reason
      );
      setSuccess(`${deductForm.gems} gems deducted successfully!`);
      setDeductForm({ student_id: '', gems: 10, reason: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deduct gems');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.gems_reward && !couponForm.discount_percentage) {
      setError('Please set either gems reward or discount percentage');
      return;
    }

    try {
      setLoading(true);
      const response = await adminRewardsAPI.createCoupon(couponForm);
      setSuccess(`Coupon created! Code: ${response.data.data.code}`);
      setCouponForm({
        gems_reward: 10,
        discount_percentage: 0,
        description: '',
        max_usage: 5,
        expiry_days: 30
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🎁 Admin Reward Manager</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('send')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'send'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Send Reward
        </button>
        <button
          onClick={() => setActiveTab('deduct')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'deduct'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Deduct Gems
        </button>
        <button
          onClick={() => setActiveTab('coupon')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'coupon'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Create Coupon
        </button>
      </div>

      {/* Send Reward Tab */}
      {activeTab === 'send' && (
        <div className="bg-white border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Send Reward to Student</h2>
          <form onSubmit={handleSendReward} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Student ID</label>
              <input
                type="text"
                value={sendForm.student_id}
                onChange={(e) => setSendForm({ ...sendForm, student_id: e.target.value })}
                placeholder="Enter student UUID"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gems to Send</label>
              <input
                type="number"
                value={sendForm.gems}
                onChange={(e) => setSendForm({ ...sendForm, gems: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason</label>
              <textarea
                value={sendForm.reason}
                onChange={(e) => setSendForm({ ...sendForm, reason: e.target.value })}
                placeholder="Why are you sending this reward?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Sending...' : '✓ Send Reward'}
            </button>
          </form>
        </div>
      )}

      {/* Deduct Gems Tab */}
      {activeTab === 'deduct' && (
        <div className="bg-white border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Deduct Gems from Student</h2>
          <form onSubmit={handleDeductGems} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Student ID</label>
              <input
                type="text"
                value={deductForm.student_id}
                onChange={(e) => setDeductForm({ ...deductForm, student_id: e.target.value })}
                placeholder="Enter student UUID"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gems to Deduct</label>
              <input
                type="number"
                value={deductForm.gems}
                onChange={(e) => setDeductForm({ ...deductForm, gems: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason</label>
              <textarea
                value={deductForm.reason}
                onChange={(e) => setDeductForm({ ...deductForm, reason: e.target.value })}
                placeholder="Why are you deducting gems?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
            >
              {loading ? 'Deducting...' : '✗ Deduct Gems'}
            </button>
          </form>
        </div>
      )}

      {/* Create Coupon Tab */}
      {activeTab === 'coupon' && (
        <div className="bg-white border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Create Promotional Coupon</h2>
          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Gems Reward</label>
                <input
                  type="number"
                  value={couponForm.gems_reward}
                  onChange={(e) => setCouponForm({ ...couponForm, gems_reward: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Discount (%)</label>
                <input
                  type="number"
                  value={couponForm.discount_percentage}
                  onChange={(e) => setCouponForm({ ...couponForm, discount_percentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={couponForm.description}
                onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                placeholder="What does this coupon offer?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Max Usage</label>
                <input
                  type="number"
                  value={couponForm.max_usage}
                  onChange={(e) => setCouponForm({ ...couponForm, max_usage: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Days</label>
                <input
                  type="number"
                  value={couponForm.expiry_days}
                  onChange={(e) => setCouponForm({ ...couponForm, expiry_days: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating...' : '🎟️ Create Coupon'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRewardManager;
