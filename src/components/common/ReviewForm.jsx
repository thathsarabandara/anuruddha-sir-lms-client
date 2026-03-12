import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ReviewForm = ({ courseId, onReviewSubmitted, existingReview = null }) => {
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 5,
    review_text: existingReview?.review_text || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setFormData({
        rating: existingReview.rating,
        review_text: existingReview.review_text,
      });
    }
  }, [existingReview]);

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleTextChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      review_text: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API delay with dummy data
    setTimeout(() => {
      toast.success(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
      setLoading(false);
      
      // Reset form or notify parent
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Clear form
      setFormData({
        rating: 5,
        review_text: '',
      });
    }, 500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {existingReview ? 'Update Your Review' : 'Write a Review'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={`text-4xl transition-transform hover:scale-110 ${
                    rating <= formData.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700">
              {formData.rating}/5
            </span>
          </div>

          {/* Rating Labels */}
          <div className="mt-3 text-sm text-gray-600">
            {formData.rating === 1 && 'Poor'}
            {formData.rating === 2 && 'Fair'}
            {formData.rating === 3 && 'Good'}
            {formData.rating === 4 && 'Very Good'}
            {formData.rating === 5 && 'Excellent'}
          </div>
        </div>

        {/* Review Text Section */}
        <div>
          <label htmlFor="review_text" className="block text-sm font-medium text-gray-700 mb-3">
            Your Review
          </label>
          <textarea
            id="review_text"
            value={formData.review_text}
            onChange={handleTextChange}
            placeholder="Share your learning experience, what did you like, what could be improved? (Optional)"
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="text-sm text-gray-500 mt-2">
            {formData.review_text.length}/1000 characters
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            ✓ {existingReview ? 'Review updated successfully!' : 'Review submitted successfully!'}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
