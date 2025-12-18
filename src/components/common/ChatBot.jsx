import { useState } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../../utils/constants';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChatBot = () => {
    setIsOpen(!isOpen);
  };

  const handleExternalChat = () => {
    window.open(SOCIAL_LINKS.CHATBOT, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* ChatBot Button */}
      <button
        onClick={handleChatBot}
        className="fixed right-6 bottom-24 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-2xl z-40"
        title="Chat with us"
        aria-label="Chatbot"
      >
        <FaComments className="text-2xl" />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed right-6 bottom-52 w-80 bg-white rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Anuruddha Sir Support</h3>
              <p className="text-sm text-purple-100">Always here to help!</p>
            </div>
            <button
              onClick={handleChatBot}
              className="hover:bg-purple-800 p-2 rounded-full transition"
              aria-label="Close chat"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="p-4 h-64 bg-gray-50 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-3">
              <div className="bg-purple-100 rounded-lg p-3 w-3/4">
                <p className="text-sm text-gray-800">Hi! 👋 How can we help you today?</p>
              </div>
              <div className="flex justify-end">
                <div className="bg-purple-600 text-white rounded-lg p-3 w-3/4">
                  <p className="text-sm">Ask us anything about our courses!</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <button
                onClick={handleExternalChat}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition font-semibold text-sm"
              >
                Open Full Chat
              </button>
              <button
                onClick={handleChatBot}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
