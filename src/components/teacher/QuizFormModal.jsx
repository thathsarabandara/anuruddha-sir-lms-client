import { useState, useEffect } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { quizAPI } from '../../api/quiz';

const QuizFormModal = ({ isOpen, onClose, onSave, quiz, onNotification }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_marks: 100,
    passing_score: 70,
    duration_minutes: 60,
    max_attempts: 1,
    shuffle_questions: false,
    shuffle_answers: false,
    show_answers_after: 'submission',
    available_from: '',
    available_until: '',
    is_published: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quiz) {
      // Parse ISO datetime format to datetime-local format (YYYY-MM-DDTHH:mm)
      const parseDateTime = (isoString) => {
        if (!isoString) return '';
        try {
          const date = new Date(isoString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (e) {
          console.log('Error parsing date:', e);
          return '';
        }
      };

      // Form initialization from quiz prop - setState in effect for form hydration
      // eslint-disable-next-line
      setFormData({
        title: quiz.title || '',
        description: quiz.description || '',
        total_marks: quiz.total_marks || 100,
        passing_score: quiz.passing_score || 70,
        duration_minutes: quiz.duration_minutes || 60,
        max_attempts: quiz.max_attempts || 1,
        shuffle_questions: quiz.shuffle_questions || false,
        shuffle_answers: quiz.shuffle_answers || false,
        show_answers_after: quiz.show_answers_after || 'submission',
        available_from: parseDateTime(quiz.available_from),
        available_until: parseDateTime(quiz.available_until),
        is_published: quiz.is_published || false,
      });
    }
  }, [quiz]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    quizAPI.createQuiz(formData)
      .then((response) => {
        onSave(response.data);
        onNotification('Quiz saved successfully!', 'success');
        onClose();
      })
      .catch((error) => {
        console.error('Error saving quiz:', error);
        onNotification('Failed to save quiz. Please try again.', 'error');
      })
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900">{quiz ? 'Edit Quiz' : 'New Quiz'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto space-y-5">
          {/* Title & Type Row */}
          <div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="e.g., Chapter 1 Quiz"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              rows="2"
              placeholder="Brief description..."
            />
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
              <input
                type="number"
                value={formData.total_marks}
                onChange={(e) => setFormData({ ...formData, total_marks: parseInt(e.target.value) || 100 })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
              <input
                type="number"
                value={formData.passing_score}
                onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (min)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
              <input
                type="number"
                value={formData.max_attempts}
                onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                min="1"
                required
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 py-3 border-t border-b border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.shuffle_questions}
                onChange={(e) => setFormData({ ...formData, shuffle_questions: e.target.checked })}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Shuffle Questions</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.shuffle_answers}
                onChange={(e) => setFormData({ ...formData, shuffle_answers: e.target.checked })}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Shuffle Answers</span>
            </label>
          </div>

          {/* Results & Visibility */}
          <div className="grid grid-cols-2 gap-4 pt-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Show Answers After</label>
              <select
                value={formData.show_answers_after}
                onChange={(e) => setFormData({ ...formData, show_answers_after: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="submission">After Submission</option>
                <option value="later">Later</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer group mt-8">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {formData.is_published ? 'Published' : 'Draft'}
                </span>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available From</label>
              <input
                type="datetime-local"
                value={formData.available_from}
                onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Until</label>
              <input
                type="datetime-local"
                value={formData.available_until}
                onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <FaCheck size={16} />
              {loading ? 'Saving...' : quiz ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizFormModal;
