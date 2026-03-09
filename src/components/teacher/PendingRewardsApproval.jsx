import React, { useState, useEffect } from 'react';
import { teacherRewardsAPI } from '../../api/rewardsApi';

const PendingRewardsApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [approvalMessage, setApprovalMessage] = useState({});
  const [rejectionReason, setRejectionReason] = useState({});

  useEffect(() => {
    fetchPendingRewards();
  }, []);

  const fetchPendingRewards = async () => {
    try {
      setLoading(true);
      const response = await teacherRewardsAPI.getPendingRewards();
      setRequests(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pending rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId);
      await teacherRewardsAPI.approveReward(
        requestId,
        approvalMessage[requestId] || ''
      );
      setRequests(requests.filter(r => r.id !== requestId));
      setApprovalMessage(prev => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve reward');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);
      await teacherRewardsAPI.rejectReward(
        requestId,
        rejectionReason[requestId] || ''
      );
      setRequests(requests.filter(r => r.id !== requestId));
      setRejectionReason(prev => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject reward');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Reward Cards Skeleton */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-5 w-40 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📋 Pending Reward Approvals</h2>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
          {requests.length} Pending
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">✓ All caught up!</p>
          <p className="text-gray-500 mt-2">No pending reward approvals</p>
        </div>
      ) : (
        requests.map(request => (
          <div key={request.id} className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{request.student_name}</h3>
                <p className="text-sm text-gray-600">{request.quiz_title || 'Quiz Attempt'}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">{request.gems_requested}</p>
                <p className="text-xs text-gray-500">gems requested</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Student ID:</span> {request.student_id}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Requested: {new Date(request.created_at).toLocaleString()}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Approval Message (Optional)</label>
                <textarea
                  value={approvalMessage[request.id] || ''}
                  onChange={(e) => setApprovalMessage(prev => ({
                    ...prev,
                    [request.id]: e.target.value
                  }))}
                  placeholder="Good performance! Keep it up!"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rejection Reason (if rejecting)</label>
                <textarea
                  value={rejectionReason[request.id] || ''}
                  onChange={(e) => setRejectionReason(prev => ({
                    ...prev,
                    [request.id]: e.target.value
                  }))}
                  placeholder="Reason for rejection..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  rows="2"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(request.id)}
                disabled={processingId === request.id}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {processingId === request.id ? 'Approving...' : '✓ Approve'}
              </button>
              <button
                onClick={() => handleReject(request.id)}
                disabled={processingId === request.id}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
              >
                {processingId === request.id ? 'Rejecting...' : '✗ Reject'}
              </button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={fetchPendingRewards}
        className="w-full mt-4 bg-purple-100 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-200 transition"
      >
        Refresh
      </button>
    </div>
  );
};

export default PendingRewardsApproval;
