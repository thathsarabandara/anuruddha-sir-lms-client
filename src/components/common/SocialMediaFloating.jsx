import { FaWhatsapp, FaFacebook, FaYoutube } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../../utils/constants';

const SocialMediaFloating = () => {
  const handleWhatsApp = () => {
    window.open(SOCIAL_LINKS.WHATSAPP, '_blank');
  };

  const handleFacebook = () => {
    window.open(SOCIAL_LINKS.FACEBOOK, '_blank');
  };

  const handleYouTube = () => {
    window.open(SOCIAL_LINKS.YOUTUBE, '_blank');
  };

  return (
    <div className="fixed left-6 bottom-32 flex flex-col gap-4 z-40">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-2xl"
        title="Chat on WhatsApp"
        aria-label="WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </button>

      {/* Facebook Button */}
      <button
        onClick={handleFacebook}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-2xl"
        title="Follow on Facebook"
        aria-label="Facebook"
      >
        <FaFacebook className="text-2xl" />
      </button>

      {/* YouTube Button */}
      <button
        onClick={handleYouTube}
        className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-2xl"
        title="Subscribe on YouTube"
        aria-label="YouTube"
      >
        <FaYoutube className="text-2xl" />
      </button>
    </div>
  );
};

export default SocialMediaFloating;
