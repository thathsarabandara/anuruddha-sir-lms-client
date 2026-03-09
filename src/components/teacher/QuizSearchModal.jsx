import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { quizAPI } from '../../api/quizApi';
import { BiSearch, BiLoader } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import { FaCopy } from 'react-icons/fa';

const QuizSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchQuizzes();
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const searchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.searchPublishedQuizzes(searchQuery);
      
      if (response.data.success) {
        setSearchResults(response.data.quizzes || []);
        setHasSearched(true);
      } else {
        toast.error('Failed to search quizzes');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching quizzes:', err);
      toast.error('Error searching quizzes');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleCopyQuizId = (quizId) => {
    navigator.clipboard.writeText(quizId);
    setCopiedId(quizId);
    toast.success('Quiz ID copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirm = () => {
    if (selectedQuiz) {
      onSelect(selectedQuiz);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedQuiz(null);
      setHasSearched(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Search Published Quizzes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <BiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by quiz title or paste quiz ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Search by quiz title or paste the quiz ID to find published quizzes
          </p>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <BiLoader className="animate-spin text-blue-500" size={32} />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => handleSelectQuiz(quiz)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedQuiz?.id === quiz.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      checked={selectedQuiz?.id === quiz.id}
                      onChange={() => handleSelectQuiz(quiz)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                        <span>Type: {quiz.quiz_type}</span>
                        <span>Questions: {quiz.total_questions}</span>
                        <span>Marks: {quiz.total_marks}</span>
                        <span>Time: {quiz.time_limit_minutes} mins</span>
                      </div>
                      <div className="mt-3 p-2 bg-gray-100 rounded flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Quiz ID:</p>
                          <code className="text-xs font-mono text-gray-700 break-all">{quiz.id}</code>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyQuizId(quiz.id);
                          }}
                          className={`ml-2 p-2 rounded transition-colors ${
                            copiedId === quiz.id
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                          }`}
                          title="Copy Quiz ID"
                        >
                          <FaCopy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No published quizzes found</p>
              <p className="text-sm text-gray-400 mt-2">
                Make sure the quiz is published and the search query is correct
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Start typing to search for quizzes</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedQuiz}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Select Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSearchModal;
