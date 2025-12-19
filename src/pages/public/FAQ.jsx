import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { FaPhone, FaQuestion } from 'react-icons/fa';
import { SlEnergy } from 'react-icons/sl';
import { MdChat, MdMail } from 'react-icons/md';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'General Questions',
      questions: [
        {
          question: 'What is this Learning Management System?',
          answer: 'Our LMS is a comprehensive online platform designed specifically for Grade 5 Scholarship examination preparation. It offers live interactive classes, recorded sessions, practice quizzes, progress tracking, and digital certificates - everything your child needs to excel in the scholarship exam.'
        },
        {
          question: 'Who is Anuruddha Sir?',
          answer: 'Anuruddha Sir is an experienced educator with over 12 years of teaching experience in Grade 5 Scholarship preparation. He has helped hundreds of students achieve outstanding results with his proven teaching methods and personalized approach to education.'
        },
        {
          question: 'What subjects are covered?',
          answer: 'We cover all four subjects required for the Grade 5 Scholarship examination: Sinhala , Mathematics, Environment Studies, and English. Each subject is taught by experienced teachers with specialized knowledge in their field.'
        },
        {
          question: 'How do I register?',
          answer: 'Click the "Register" button on the homepage, fill in your details including student name, grade, parent contact information, and email. After registration, you\'ll receive an OTP for verification. Once verified, you can access your dashboard and start learning immediately.'
        },
      ]
    },
    {
      category: 'Classes & Learning',
      questions: [
        {
          question: 'How do live classes work?',
          answer: 'Live classes are conducted via Zoom at scheduled times. You\'ll receive notifications before each class. Simply click the "Join Class" button in your dashboard to attend. Classes are interactive - students can ask questions, participate in discussions, and engage with classmates in real-time.'
        },
        {
          question: 'What if I miss a live class?',
          answer: 'No worries! All live classes are automatically recorded and made available in the Recordings section. You can watch them anytime at your convenience, pause, rewind, and review as many times as you need to fully understand the concepts.'
        },
        {
          question: 'How long are the classes?',
          answer: 'Each live class typically runs for 60-90 minutes, depending on the subject and topic. Classes are scheduled to be engaging and age-appropriate, with breaks for younger students to maintain focus and energy.'
        },
        {
          question: 'Can I download study materials?',
          answer: 'Yes! All study materials, practice papers, worksheets, and notes are available for download in PDF format. You can access them from your course dashboard and print them if needed for offline study.'
        },
        {
          question: 'How do quizzes work?',
          answer: 'Quizzes are available after completing lessons. They include multiple-choice, true/false, and short answer questions. You\'ll get instant feedback on your answers, see correct solutions, and receive a detailed performance report to track your progress.'
        },
      ]
    },
    {
      category: 'Payments & Pricing',
      questions: [
        {
          question: 'What are the course fees?',
          answer: 'We offer flexible pricing: Individual subjects cost Rs. 8,000 for 3 months (24 classes), while the Complete Scholarship Package covering all subjects costs Rs. 15,000 for 6 months (48 classes). Special discounts are available for siblings and early registrations.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept multiple payment methods for your convenience: PayHere online payment (credit/debit cards), bank transfers to our registered account, and cash payments at our office. All payment methods are secure and verified by administrators.'
        },
        {
          question: 'How do I make a payment?',
          answer: 'Go to the Payments section in your dashboard, select your course, choose a payment method, and follow the instructions. For online payments via PayHere, you\'ll be redirected to a secure payment gateway. For bank transfers, upload your bank slip for verification.'
        },
        {
          question: 'Is there a refund policy?',
          answer: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied with the course. Refund requests after 7 days are evaluated on a case-by-case basis. Please contact our support team for refund inquiries.'
        },
        {
          question: 'Are there any hidden charges?',
          answer: 'No! The course fee includes everything - live classes, recorded sessions, study materials, quizzes, progress reports, and certificates. There are no additional or hidden charges whatsoever.'
        },
      ]
    },
    {
      category: 'Technical & Support',
      questions: [
        {
          question: 'What devices can I use?',
          answer: 'Our platform works on any device with an internet connection - computers, laptops, tablets, and smartphones. We recommend using a laptop or tablet for the best learning experience during live classes.'
        },
        {
          question: 'What internet speed do I need?',
          answer: 'A minimum of 2 Mbps internet connection is recommended for smooth video streaming during live classes. For recorded sessions, even slower connections work fine as videos can be buffered.'
        },
        {
          question: 'Is the platform easy to use?',
          answer: 'Absolutely! Our platform is designed to be user-friendly for both parents and students. We provide a detailed tutorial video and user guide upon registration. Our support team is also available to help with any technical issues.'
        },
        {
          question: 'How do I contact support?',
          answer: 'You can contact our support team via email at support@anuruddhasir.com, call us at 0771234567, or use the Contact Form on our website. We typically respond within 24 hours on weekdays.'
        },
        {
          question: 'Can I access the platform on mobile?',
          answer: 'Yes! Our platform is fully mobile-responsive. You can access all features, watch classes, take quizzes, and view progress reports on your smartphone or tablet using any web browser.'
        },
      ]
    },
    {
      category: 'Progress & Performance',
      questions: [
        {
          question: 'How do I track my child\'s progress?',
          answer: 'Parents have access to a comprehensive dashboard showing attendance records, quiz scores, completed lessons, time spent learning, and overall performance analytics. Regular progress reports are also emailed to parents.'
        },
        {
          question: 'What are certificates?',
          answer: 'Students earn digital certificates for completing courses, achieving high scores, perfect attendance, and other milestones. Certificates can be downloaded, printed, and shared. They serve as motivation and recognition of achievements.'
        },
        {
          question: 'How does the reward system work?',
          answer: 'Students earn coins for attending classes, completing quizzes, and achieving good scores. They also earn gems for special achievements. These virtual rewards appear on leaderboards, creating friendly competition and motivation.'
        },
        {
          question: 'Are there practice exams?',
          answer: 'Yes! We provide regular mock exams that simulate the actual scholarship examination format. These help students get familiar with exam patterns, manage time effectively, and identify areas needing improvement.'
        },
        {
          question: 'Can teachers provide individual attention?',
          answer: 'Yes! Teachers are available during live classes to answer questions. Additionally, students can message teachers through the platform for clarifications. We also offer optional one-on-one tutoring sessions for students needing extra help.'
        },
      ]
    },
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Find answers to common questions about our Grade 5 Scholarship preparation platform
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: FaQuestion, number: '25+', label: 'FAQs Answered' },
              { icon: SlEnergy, number: '24/7', label: 'Support Available' },
              { icon: FaPhone, number: '+94 70 265 6024', label: 'Call Us'},
              { icon: MdMail, number: 'anuruddharathnaya40@gmail.com', label: 'Email Us' },
            ].map((item, index) => (
              <div key={index}>
                <item.icon className="mx-auto text-4xl text-primary-600 mb-4" />
                {item.isPhone || item.isEmail ? (
                  <div className="text-sm text-gray-700 font-medium">{item.label}</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{item.number}</div>
                    <div className="text-gray-600 text-sm">{item.label}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl mr-4">
                  {categoryIndex + 1}
                </span>
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;
                  
                  return (
                    <div key={questionIndex} className="card bg-white border-2 border-gray-100">
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full text-left flex items-center justify-between"
                      >
                        <h3 className="text-lg font-bold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        <span className={`text-2xl flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help! Reach out to us anytime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-4xl mb-4"><MdMail className="mx-auto text-4xl text-primary-600 mb-4" /></div>
              <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-700 text-sm mb-3">support@anuruddhasir.com</p>
              <p className="text-xs text-gray-600">Response within 24 hours</p>
            </div>
            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-4xl mb-4"><FaPhone className="mx-auto text-4xl text-primary-600 mb-4" /></div>
              <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-700 text-sm mb-3">+94 70 265 6024</p>
              <p className="text-xs text-gray-600">Mon-Fri: 9 AM - 6 PM</p>
            </div>
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-4xl mb-4"><MdChat className="mx-auto text-4xl text-primary-600 mb-4" /></div>
              <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-700 text-sm mb-3">Coming Soon</p>
              <p className="text-xs text-gray-600">Instant support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-6">
            Join our platform and start your success journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.REGISTER}
              className="bg-white text-primary-600 hover:bg-yellow-300 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Register Now - Free Trial
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-10 rounded-full transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
