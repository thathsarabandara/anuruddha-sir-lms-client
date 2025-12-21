# 🎓 Anuruddha Sir LMS - Learning Management System

<div align="center">

![LMS Platform](https://img.shields.io/badge/LMS-Platform-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css)
![Redux](https://img.shields.io/badge/Redux-9.2.0-764ABC?style=for-the-badge&logo=redux)

A comprehensive Learning Management System designed for Grade 3-5 scholarship classes, featuring multi-language support (English & Sinhala) and role-based access control.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Anuruddha Sir LMS is a modern, feature-rich Learning Management System built specifically for scholarship preparation classes. It provides a seamless learning experience for students, comprehensive tools for teachers, powerful analytics for admins, and system monitoring for developers.

### 🎯 Key Highlights

- **Multi-Language Support**: English & Sinhala with i18next
- **Role-Based Access**: Student, Teacher, Admin, Developer, Super Admin
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-Time Features**: Live classes, quizzes, and instant notifications
- **Rich Analytics**: Performance tracking, progress monitoring, and detailed reports

---

## ✨ Features

### 👨‍🎓 For Students
- 📚 **Course Management**: Browse, enroll, and track course progress
- 🎥 **Live Classes**: Join scheduled live sessions
- 📝 **Quizzes & Assessments**: Take quizzes with detailed results and leaderboards
- 📊 **Progress Tracking**: Monitor learning progress with visual analytics
- 🏆 **Rewards System**: Earn badges and rewards for achievements
- 📜 **Certificates**: Download completion certificates
- 💳 **Payment Management**: Secure course payments and transaction history
- 🛒 **Shopping Cart**: Add multiple courses and checkout seamlessly

### 👨‍🏫 For Teachers
- 📖 **Course Creation**: Create and manage courses with multimedia content
- 👥 **Student Management**: Track student progress and performance
- 📝 **Quiz Creation**: Design assessments with multiple question types
- 🎥 **Live Class Hosting**: Conduct live sessions with students
- 📹 **Recording Management**: Upload and manage class recordings
- 📢 **Announcements**: Send notifications to students
- 💰 **Revenue Tracking**: Monitor earnings and payment statistics

### 🔧 For Admins
- 📊 **Dashboard Analytics**: Comprehensive overview of platform metrics
- 👤 **User Management**: Manage students, teachers, and permissions
- 💼 **Course Oversight**: Approve and monitor all courses
- 💳 **Payment Processing**: Handle transactions and refunds
- 📈 **Reports & Analytics**: Generate detailed performance reports
- ⚙️ **System Settings**: Configure platform-wide settings

### 💻 For Developers
- 🔍 **System Health Monitoring**: Real-time system performance metrics
- 📋 **API Logs**: Track and analyze API requests
- ⚠️ **Error Monitoring**: Identify and resolve system errors
- 🎚️ **Feature Flags**: Toggle features dynamically
- 🔗 **Integration Status**: Monitor third-party integrations

### 🌐 Public Features
- 🏠 **Landing Page**: Attractive homepage with course showcase
- 📖 **About Section**: Information about the institution
- 📞 **Contact Form**: Easy communication channel
- 🖼️ **Gallery**: Photo gallery of classes and events
- ⭐ **Testimonials**: Student and parent reviews
- ❓ **FAQ Section**: Frequently asked questions

---

## 🛠️ Tech Stack

### Frontend Framework & Libraries
- **React 19.2.0** - UI library with latest features
- **Vite 7.2.4** - Lightning-fast build tool
- **React Router DOM 7.10.1** - Client-side routing

### State Management
- **Redux Toolkit 9.2.0** - Efficient state management
- **React Redux 9.2.0** - React bindings for Redux

### Styling & UI
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **React Icons 5.5.0** - Icon library
- **GSAP 3.14.2** - Animation library

### Internationalization
- **i18next 25.7.3** - Internationalization framework
- **react-i18next 16.5.0** - React bindings for i18next
- **i18next-browser-languagedetector 8.2.0** - Language detection

### Data Visualization
- **Chart.js 4.5.1** - Charting library
- **react-chartjs-2 5.3.1** - React wrapper for Chart.js

### HTTP Client
- **Axios 1.13.2** - Promise-based HTTP client

### Development Tools
- **ESLint 9.39.1** - Code linting
- **PostCSS 8.4.49** - CSS transformations
- **Autoprefixer 10.4.20** - CSS vendor prefixing

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/thathsarabandara/anuruddha-sir-lms-client.git
cd lms-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` file with your configuration

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

---

## 🚀 Usage

### Development Mode
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR)

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist` folder

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally

### Lint Code
```bash
npm run lint
```
Run ESLint to check code quality

---

## 📁 Project Structure

```
lms-frontend/
├── public/                      # Static assets
│   └── assets/
│       ├── images/             # Image assets organized by section
│       │   ├── about/
│       │   ├── auth/
│       │   ├── contact/
│       │   ├── courses/
│       │   ├── gallery/
│       │   ├── home/
│       │   └── services/
│       └── videos/             # Video assets
├── src/
│   ├── api/                    # API configuration
│   │   ├── axios.js           # Axios instance setup
│   │   └── index.js           # API endpoints
│   ├── app/                    # Redux store
│   │   ├── slices/            # Redux slices
│   │   │   ├── authSlice.js
│   │   │   ├── languageSlice.js
│   │   │   └── notificationSlice.js
│   │   └── store/
│   │       └── index.js       # Redux store configuration
│   ├── components/            # Reusable components
│   │   ├── common/           # Common components
│   │   │   ├── ChatBot.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── PageLoader.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── SocialMediaFloating.jsx
│   │   ├── layout/           # Layout components
│   │   │   ├── AuthenticatedLayout.jsx
│   │   │   ├── DashboardFooter.jsx
│   │   │   ├── DashboardTopBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopNav.jsx
│   │   └── student/          # Student-specific components
│   │       ├── DashStat.jsx
│   │       └── PorgressStat.jsx
│   ├── features/             # Feature-specific code
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── developer/
│   │   ├── student/
│   │   └── teacher/
│   ├── hooks/                # Custom React hooks
│   │   └── usePageLoader.js
│   ├── i18n/                 # Internationalization
│   │   ├── config.js
│   │   └── locales/
│   │       ├── en.json       # English translations
│   │       └── si.json       # Sinhala translations
│   ├── pages/                # Page components
│   │   ├── admin/           # Admin pages
│   │   ├── auth/            # Authentication pages
│   │   ├── developer/       # Developer pages
│   │   ├── public/          # Public pages
│   │   ├── student/         # Student pages
│   │   └── teacher/         # Teacher pages
│   ├── routes/              # Route configuration
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx              # Main App component
│   ├── App.css              # App styles
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global CSS
├── .eslintrc.cjs            # ESLint configuration
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── package.json             # Project dependencies
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

---

## 👥 User Roles

### 🎓 Student
- Access to course materials and learning resources
- Participate in quizzes and live classes
- Track personal progress and performance
- Download certificates upon course completion

### 👨‍🏫 Teacher
- Create and manage courses
- Conduct live classes and upload recordings
- Design and grade assessments
- Monitor student performance

### 🔧 Admin
- Full system oversight and management
- User management (approve/suspend accounts)
- Financial management and reporting
- Platform configuration

### 🔐 Super Admin
- All admin privileges
- System-level configurations
- Role and permission management
- Critical system operations

### 💻 Developer
- System monitoring and diagnostics
- API and error logging
- Performance optimization
- Feature flag management

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint code linting |

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME="Anuruddha Sir LMS"
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_NOTIFICATIONS=true

# Payment Gateway (if applicable)
VITE_PAYMENT_GATEWAY_KEY=your_key_here

# Analytics (if applicable)
VITE_ANALYTICS_ID=your_analytics_id
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Follow ESLint rules
- Use meaningful variable and function names
- Write comments for complex logic
- Keep components small and focused
- Use custom hooks for reusable logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

- **Developer**: Thathsara Bandara
- **Email**: [thathsaraarumapperuma@gmail.com]
- **GitHub**: [@thathsarabandara](https://github.com/thathsarabandara)
- **Repository**: [anuruddha-sir-lms-client](https://github.com/thathsarabandara/anuruddha-sir-lms-client)

---

## 🙏 Acknowledgments

- React Team for the amazing framework
- Vite Team for the blazing-fast build tool
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

<div align="center">

**Made with ❤️ for quality education**

⭐ Star this repository if you find it helpful!

</div>
