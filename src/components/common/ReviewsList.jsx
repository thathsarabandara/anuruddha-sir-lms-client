import React, { useState, useEffect } from 'react';
import reviewApi from '../../api/reviewApi';

const ReviewsList = ({ courseId, isStudent = false, isTeacher = false, isAdmin = false }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterApproved, setFilterApproved] = useState(null);
  const [myReview, setMyReview] = useState(null);

  // Fetch reviews based on role
  const fetchReviews = async (page = 1, approved = null) => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (isTeacher) {
        response = await reviewApi.getTeacherCourseReviews(courseId, page, perPage, approved);
      } else if (isAdmin) {
        response = await reviewApi.getAllReviews(page, perPage, approved, courseId);
      } else {
        response = await reviewApi.getCourseReviews(courseId, page, perPage);
      }

      const data = response.data;
      setReviews(data.reviews || []);
      setStats(data.stats || null);
      setPagination(data.pagination || null);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Fetch student's own review
  const fetchMyReview = async () => {
    if (!isStudent) return;

    try {
      const response = await reviewApi.getMyReview(courseId);
      if (response.data.review) {
        setMyReview(response.data.review);
      }
    } catch (err) {
      console.error('Error fetching my review:', err);
    }
  };

  useEffect(() => {
    fetchReviews(1, filterApproved);
    if (isStudent) {
      fetchMyReview();
    }
  }, [courseId, filterApproved]);

  const handleApproveReview = async (reviewId) => {
    try {
      await reviewApi.approveReview(reviewId);
      // Refresh reviews
      fetchReviews(currentPage, filterApproved);
    } catch (err) {
        console.error('Error approving review:', err);
        alert('Failed to approve review');
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await reviewApi.rejectReview(reviewId);
      // Refresh reviews
      fetchReviews(currentPage, filterApproved);
    } catch (err) {
      console.error('Error rejecting review:', err);
      alert('Failed to reject review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewApi.deleteReview(reviewId);
        // Refresh reviews
        fetchReviews(currentPage, filterApproved);
      } catch (err) {
        console.error('Error deleting review:', err);
        alert('Failed to delete review');
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchReviews(newPage, filterApproved);
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && reviews.length === 0) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{stats.total_reviews}</div>
              <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-500">{stats.average_rating?.toFixed(1)}</span>
                <span className="text-yellow-400 text-xl">★</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">Average Rating</div>
            </div>
            {(isTeacher || isAdmin) && (
              <>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{stats.approved_count}</div>
                  <div className="text-sm text-gray-600 mt-1">Approved</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">{stats.pending_count}</div>
                  <div className="text-sm text-gray-600 mt-1">Pending</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Student's Own Review */}
      {isStudent && myReview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Review</h3>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-800">{myReview.student_name}</div>
                <div className="text-sm text-gray-600">{formatDate(myReview.created_at)}</div>
              </div>
              {getRatingStars(myReview.rating)}
            </div>
            {myReview.review_text && (
              <p className="text-gray-700 leading-relaxed">{myReview.review_text}</p>
            )}
          </div>
        </div>
      )}

      {/* Filter Section (Teacher/Admin) */}
      {(isTeacher || isAdmin) && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setFilterApproved(null)}
            className={`px-4 py-2 rounded-lg transition ${
              filterApproved === null
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All ({stats?.total_reviews || 0})
          </button>
          <button
            onClick={() => setFilterApproved(true)}
            className={`px-4 py-2 rounded-lg transition ${
              filterApproved === true
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Approved ({stats?.approved_count || 0})
          </button>
          <button
            onClick={() => setFilterApproved(false)}
            className={`px-4 py-2 rounded-lg transition ${
              filterApproved === false
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Pending ({stats?.pending_count || 0})
          </button>
        </div>
      )}

      {/* Reviews List */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className={`border rounded-lg p-6 ${
                !review.is_approved ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
              }`}
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  {review.student_profile_picture && (
                    <img
                      src={review.student_profile_picture}
                      alt={review.student_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-800">{review.student_name}</div>
                    <div className="text-sm text-gray-600">{formatDate(review.created_at)}</div>
                    {!review.is_approved && (
                      <div className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded inline-block mt-1">
                        Pending Approval
                      </div>
                    )}
                  </div>
                </div>
                <div>{getRatingStars(review.rating)}</div>
              </div>

              {/* Review Text */}
              {review.review_text && (
                <p className="text-gray-700 leading-relaxed mb-4">{review.review_text}</p>
              )}

              {/* Action Buttons (Teacher/Admin) */}
              {(isTeacher || isAdmin) && !review.is_approved && (
                <div className="flex gap-3 border-t pt-4 mt-4">
                  <button
                    onClick={() => handleApproveReview(review.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleRejectReview(review.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    ✕ Reject
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium ml-auto"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}

              {/* Admin Delete Button for Approved Reviews */}
              {isAdmin && review.is_approved && (
                <div className="flex justify-end gap-3 border-t pt-4 mt-4">
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No reviews yet.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {[...Array(pagination.total_pages)].map((_, i) => {
            const page = i + 1;
            // Show first 2, last 2, and current page with neighbors
            if (
              page === 1 ||
              page === pagination.total_pages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === 2 || page === pagination.total_pages - 1) {
              return (
                <span key={page} className="px-2 py-2">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.total_pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
