import { useState, useEffect } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const QuizFormModal = ({ isOpen, onClose, onSave, quiz }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    section_id: '',
    quiz_type: 'PRACTICE',
    total_marks: '100',
    passing_score: '50',
    time_limit_minutes: '60',
    max_attempts: '1',
    shuffle_questions: false,
    shuffle_answers: false,
    show_results: 'IMMEDIATELY',
    start_date: '',
    end_date: '',
    visibility: 'DRAFT',
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

      setFormData({
        title: quiz.title,
        description: quiz.description || '',
        instructions: quiz.instructions || '',
        section_id: quiz.section?.id || '',
        quiz_type: quiz.quiz_type,
        total_marks: quiz.total_marks,
        passing_score: quiz.passing_score,
        time_limit_minutes: quiz.time_limit_minutes,
        max_attempts: quiz.max_attempts,
        shuffle_questions: quiz.shuffle_questions,
        shuffle_answers: quiz.shuffle_answers,
        show_results: quiz.show_results,
        start_date: parseDateTime(quiz.start_date),
        end_date: parseDateTime(quiz.end_date),
        visibility: quiz.visibility,
      });
    }
  }, [quiz]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay with dummy data
    setTimeout(() => {
      toast.success(quiz?.id ? 'Quiz updated successfully' : 'Quiz created successfully');
      setLoading(false);
      onSave();
      onClose();
    }, 500);
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
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.quiz_type}
                onChange={(e) => setFormData({ ...formData, quiz_type: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="PRACTICE">Practice</option>
                <option value="GRADED">Graded</option>
                <option value="FINAL_EXAM">Final Exam</option>
              </select>
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

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              rows="2"
              placeholder="What students should know..."
            />
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
              <input
                type="number"
                value={formData.total_marks}
                onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, passing_score: e.target.value })}
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
                value={formData.time_limit_minutes}
                onChange={(e) => setFormData({ ...formData, time_limit_minutes: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, max_attempts: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Show Results</label>
              <select
                value={formData.show_results}
                onChange={(e) => setFormData({ ...formData, show_results: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="IMMEDIATELY">Immediately</option>
                <option value="AFTER_DEADLINE">After Deadline</option>
                <option value="MANUAL_REVIEW">Manual Review</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
