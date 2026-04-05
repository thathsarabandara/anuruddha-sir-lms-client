import { useState } from 'react';
import { MdClose, MdAdd, MdDelete } from 'react-icons/md';
import Notification from '../common/Notification';

const QuestionModal = ({ isOpen, onClose, onSave, question, quizId, onNotification }) => {
  const getInitialFormData = () => ({
    question_type: question?.question_type || 'multiple_choice',
    question_text: question?.question_text || '',
    points: question?.points || '1',
    explanation: question?.explanation || '',
    difficulty: question?.difficulty || 'medium',
    category: question?.category || '',
    question_order: question?.question_order || null,
    image: question?.image_url ? null : null,
    existing_image: question?.image_url || null,
    remove_image: false,
    options: question?.options?.length > 0 ? question.options : [
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ],
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [imagePreview, setImagePreview] = useState(question?.image_url || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    onSave(formData, quizId, question?.id)
      .then(() => {
        setIsLoading(false);
        onClose();
        onNotification('Question saved successfully', 'success');
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || 'Failed to save question');
      });
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
    
    if (field === 'is_correct' && value && formData.question_type === 'multiple_choice') {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }
    
    setFormData({ ...formData, options: newOptions });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setFormData({
        ...formData,
        image: file,
        remove_image: false,
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      remove_image: true,
      existing_image: null,
    });
    setImagePreview(null);
  };

  if (!isOpen) return null;

  const questionTypes = [
    { value: 'multiple_choice', label: 'Single Choice' },
    { value: 'multiple_answer', label: 'Multiple Choice' },
    { value: 'short_answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' },
  ];

  const difficulties = ['easy', 'medium', 'hard'];
  const showOptions = ['multiple_choice', 'multiple_answer'].includes(formData.question_type);

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
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

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Order</label>
              <input
                type="number"
                value={formData.question_order || ''}
                onChange={(e) => setFormData({ ...formData, question_order: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                min="1"
                placeholder="Auto"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="">Select Category</option>
              <option value="environment">පරිසරය (Environment)</option>
              <option value="sinhala">සිංහල (Sinhala Language)</option>
              <option value="mathematics">ගණිතය (Mathematics)</option>
              <option value="all">සියලු වර්ග (All Types)</option>
            </select>
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

          {/* Image Upload Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Question Image (Optional)</label>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 group">
                  <img 
                    src={imagePreview} 
                    alt="Question preview" 
                    className="w-full h-48 object-contain p-2"
                    onError={(e) => {
                      e.target.alt = 'Image failed to load';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 cursor-pointer transition-colors shadow-lg">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">Upload an image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Answer Options */}
          {showOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  {formData.question_type === 'multiple_choice' ? 'Answers (Select one correct)' : 'Answers (Select all correct)'}
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <MdAdd size={16} /> Add option
                </button>
              </div>

              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input
                      type={formData.question_type === 'multiple_choice' ? 'radio' : 'checkbox'}
                      name={`correct-${formData.question_type === 'multiple_choice' ? 'group' : index}`}
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
                    {formData.options.length > 2 && (
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

          {/* Explanation */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Explanation</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="Explain the correct answer..."
            />
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
