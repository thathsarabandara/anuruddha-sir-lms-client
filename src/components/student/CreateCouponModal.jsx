import React, { useState } from 'react';
import { studentRewardsAPI } from '../../api/rewardsApi';

const CreateCouponModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    gems_cost: 10,
    gems_reward: 0,
    discount_percentage: 0,
    description: '',
    max_usage: 1,
    expiry_days: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'description' ? value : parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.gems_cost && !formData.gems_reward && !formData.discount_percentage) {
      setError('Please set either gems reward or discount percentage');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await studentRewardsAPI.createCoupon(formData);
      setSuccess(`Coupon created! Code: ${response.data.data.code}`);
      setFormData({
        gems_cost: 10,
        gems_reward: 0,
        discount_percentage: 0,
        description: '',
        max_usage: 1,
        expiry_days: 30,
      });
      onSuccess?.();
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Create Coupon Code</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Gems Cost</label>
            <input
              type="number"
              name="gems_cost"
              value={formData.gems_cost}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Gems needed to create this coupon</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gems Reward</label>
            <input
              type="number"
              name="gems_reward"
              value={formData.gems_reward}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Gems given when coupon is used</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="What does this coupon offer?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Max Usage</label>
              <input
                type="number"
                name="max_usage"
                value={formData.max_usage}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Days</label>
              <input
                type="number"
                name="expiry_days"
                value={formData.expiry_days}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCouponModal;
