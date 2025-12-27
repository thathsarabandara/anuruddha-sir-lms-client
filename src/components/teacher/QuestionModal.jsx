import { useState, useEffect } from 'react';
import { MdClose, MdAdd, MdDelete } from 'react-icons/md';
import API from '../../api';
import Notification from '../common/Notification';

const QuestionModal = ({ isOpen, onClose, onSave, question, quizId }) => {
  const getInitialFormData = () => ({
    question_type: question?.question_type || 'MCQ_SINGLE',
    question_text: question?.question_text || '',
    marks: question?.marks || '1',
    explanation: question?.explanation || '',
    difficulty: question?.difficulty || 'MEDIUM',
    tags: question?.tags || '',
    options: question?.options?.length > 0 ? question.options : [
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ],
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [question?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (question?.id) {
        await API.quiz.teacherQuizAPI.updateQuestion(question.id, formData);
      } else {
        await API.quiz.teacherQuizAPI.createQuestion(quizId, formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving question:', error);
      setError(error.response?.data?.message || 'Failed to save question');
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { option_text: '', is_correct: false }],
    });
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    
    if (field === 'is_correct' && value && formData.question_type === 'MCQ_SINGLE') {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }
    
    setFormData({ ...formData, options: newOptions });
  };

  if (!isOpen) return null;

  const questionTypes = [
    { value: 'MCQ_SINGLE', label: 'Single Choice' },
    { value: 'MCQ_MULTIPLE', label: 'Multiple Choice' },
    { value: 'TRUE_FALSE', label: 'True / False' },
    { value: 'SHORT_ANSWER', label: 'Short Answer' },
    { value: 'LONG_ANSWER', label: 'Long Answer' },
  ];

  const difficulties = ['EASY', 'MEDIUM', 'HARD'];
  const showOptions = ['MCQ_SINGLE', 'MCQ_MULTIPLE', 'TRUE_FALSE'].includes(formData.question_type);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {question ? 'Edit Question' : 'Create Question'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {question ? 'Modify question details and answers' : 'Add a new question to your quiz'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-6 border-b border-red-200 bg-red-50">
            <Notification
              message={error}
              type="error"
              duration={0}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Question Type & Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Type</label>
              <select
                value={formData.question_type}
                onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {questionTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Marks</label>
              <input
                type="number"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                min="0"
                step="0.5"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff.charAt(0) + diff.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Question</label>
            <textarea
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              rows="3"
              placeholder="What would you like to ask?"
              required
            />
          </div>

          {/* Answer Options */}
          {showOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Answers
                </label>
                {formData.question_type !== 'TRUE_FALSE' && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <MdAdd size={16} /> Add option
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input
                      type={formData.question_type === 'MCQ_SINGLE' ? 'radio' : 'checkbox'}
                      name={`correct-${formData.question_type === 'MCQ_SINGLE' ? 'group' : index}`}
                      checked={option.is_correct}
                      onChange={(e) => updateOption(index, 'is_correct', e.target.checked)}
                      className="w-5 h-5 accent-primary-600 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={option.option_text}
                      onChange={(e) => updateOption(index, 'option_text', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {formData.question_type !== 'TRUE_FALSE' && formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <MdDelete size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., algebra, important"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Explanation</label>
              <input
                type="text"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Explain the correct answer..."
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : (question ? 'Update' : 'Add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
