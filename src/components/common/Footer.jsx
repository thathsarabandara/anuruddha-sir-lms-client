import { FaPhone } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { MdMail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Anuruddha Sir LMS</h3>
            <p className="text-gray-400 text-sm">
              Excellence in Grade 5 Scholarship Education. Empowering students to achieve their dreams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/courses" className="text-gray-400 hover:text-white">Courses</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Other Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/gallery" className="text-gray-400 hover:text-white">Gallery</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="/testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400 flex flex-col items-start">
              <li className="flex items-center justify-center"><MdMail className="mr-2" /> anuruddharathnayaka40@gmail.com</li>
              <li className="flex items-center justify-center"><FaPhone className="mr-2" /> +94 70 265 6024</li>
              <li className="flex items-center justify-center"><FaLocationPin className="mr-2" /> Kandy, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Anuruddha Sir LMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
