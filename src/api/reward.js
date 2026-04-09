import { API_ENDPOINTS } from '../utils/constants';
import axiosInstance from './axios';

export const rewardAPI = {
  /**
   * Get authenticated student's reward coin summary.
   * @param {boolean} recalculate - Recalculate from transactions before returning summary.
   * @returns {Promise} Student reward coin data
   */
  getMyRewardCoins: (recalculate = false) =>
    axiosInstance.get(`${API_ENDPOINTS.REWARDS}/student/coins`, {
      params: { recalculate },
    }),

  /**
   * Recalculate and persist authenticated student's coins and level.
   * @returns {Promise} Updated student reward coin data
   */
  recalculateMyRewardCoins: () =>
    axiosInstance.post(`${API_ENDPOINTS.REWARDS}/student/coins/recalculate`),

  /**
   * Get authenticated student's reward coin transaction history.
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * @param {string} type - all | earned | spent
   * @returns {Promise} Student reward coin transactions with pagination
   */
  getMyRewardCoinTransactions: (page = 1, limit = 20, type = 'all') =>
    axiosInstance.get(`${API_ENDPOINTS.REWARDS}/student/coins/transactions`, {
      params: { page, limit, type },
    }),
};

export default rewardAPI;
