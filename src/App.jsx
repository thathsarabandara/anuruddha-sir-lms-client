import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES, ROLES } from './utils/constants';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthExpiry from './hooks/useAuthExpiry';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';

// Global Components
import ScrollToTop from './components/common/ScrollToTop';
import ChatBot from './components/common/ChatBot';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Courses from './pages/public/Courses';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';
import Testimonials from './pages/public/Testimonials';
import FAQ from './pages/public/FAQ';
import Gallery from './pages/public/Gallery';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentDashboardModern from './pages/student/DashboardModern';
import StudentCourses from './pages/student/Courses';
import StudentCoursesDiscover from './pages/student/CoursesDiscover';
import StudentCourseLearning from './pages/student/CourseLearning';
import StudentLiveClasses from './pages/student/LiveClasses';
import StudentQuizzes from './pages/student/Quizzes';
import StudentQuizDetails from './pages/student/QuizDetails';
import TakeQuiz from './pages/student/TakeQuiz';
import QuizResults from './pages/student/QuizResults';
import StudentRecordings from './pages/student/Recordings';
import StudentCertificates from './pages/student/Certificates';
import StudentPayments from './pages/student/Payments';
import StudentRewards from './pages/student/Rewards';
import StudentProfile from './pages/student/Profile';
import StudentCart from './pages/student/Cart';
import StudentCheckout from './pages/student/Checkout';
import BankTransferPending from './pages/student/BankTransferPending';
import CashPaymentPending from './pages/student/CashPaymentPending';
import StudentCoursesView from './pages/student/CourseView';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherDashboardModern from './pages/teacher/DashboardModern';
import TeacherCourses from './pages/teacher/Courses';
import TeacherCourseDetail from './pages/teacher/CourseDetail';
import TeacherLiveClasses from './pages/teacher/LiveClasses';
import TeacherStudents from './pages/teacher/Students';
import TeacherQuizzes from './pages/teacher/Quizzes';
import ManageQuestions from './pages/teacher/ManageQuestions';
import GradeQuiz from './pages/teacher/GradeQuiz';
import QuizResultsDashboard from './pages/teacher/QuizResultsDashboard';
import TeacherRecordings from './pages/teacher/Recordings';
import TeacherRevenue from './pages/teacher/Revenue';
import TeacherRewards from './pages/teacher/Rewards';
import TeacherAnnouncements from './pages/teacher/Announcements';
import TeacherProfile from './pages/teacher/Profile';

// Admin Pages
import AdminDashboardModern from './pages/admin/DashboardModern';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminTeachers from './pages/admin/Teachers';
import AdminCourses from './pages/admin/Courses';
import AdminCourseModeration from './pages/admin/CourseModeration';
import AdminPayments from './pages/admin/Payments';
import AdminQuizzes from './pages/admin/Quizzes';
import AdminCertificates from './pages/admin/Certificates';
import AdminManagement from './pages/admin/Management';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// Developer Pages
import DeveloperDashboardModern from './pages/developer/DashboardModern';
import DeveloperDashboard from './pages/developer/Dashboard';
import SystemHealth from './pages/developer/SystemHealth';
import APILogs from './pages/developer/APILogs';
import ErrorMonitoring from './pages/developer/ErrorMonitoring';
import FeatureFlags from './pages/developer/FeatureFlags';
import IntegrationStatus from './pages/developer/IntegrationStatus';

function App() {
  useAuthExpiry();

  return (
    <Router>
      <ScrollToTop />
      <ChatBot />
      
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.VERIFY_OTP} element={<VerifyOTP />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.COURSES} element={<Courses />} />
          <Route path={ROUTES.SERVICES} element={<Services />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.TESTIMONIALS} element={<Testimonials />} />
          <Route path={ROUTES.FAQ} element={<FAQ />} />
          <Route path={ROUTES.GALLERY} element={<Gallery />} />
        </Route>
        
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboardModern />} />
          <Route path={ROUTES.STUDENT_COURSES} element={<StudentCourses />} />
          <Route path="/student/courses/discover" element={<StudentCoursesDiscover />} />
          <Route path="/student/course/:courseId" element={<StudentCoursesDiscover />} />
          <Route path="/student/course/:courseId/learn" element={<StudentCourseLearning />} />
          <Route path={ROUTES.STUDENT_LIVE_CLASSES} element={<StudentLiveClasses />} />
          <Route path={ROUTES.STUDENT_QUIZZES} element={<StudentQuizzes />} />
          <Route path={ROUTES.STUDENT_QUIZ_DETAILS} element={<StudentQuizDetails />} />
          <Route path="/student/quiz/:quizId/take" element={<TakeQuiz />} />
          <Route path="/student/quiz/:quizId/results/:attemptId" element={<QuizResults />} />
          <Route path={ROUTES.STUDENT_RECORDINGS} element={<StudentRecordings />} />
          <Route path={ROUTES.STUDENT_CERTIFICATES} element={<StudentCertificates />} />
          <Route path={ROUTES.STUDENT_PAYMENTS} element={<StudentPayments />} />
          <Route path={ROUTES.STUDENT_REWARDS} element={<StudentRewards />} />
          <Route path={ROUTES.STUDENT_PROFILE} element={<StudentProfile />} />
          <Route path={ROUTES.STUDENT_CART} element={<StudentCart />} />
          <Route path={ROUTES.STUDENT_CHECKOUT} element={<StudentCheckout />} />
          <Route path="/checkout/bank-transfer-pending" element={<BankTransferPending />} />
          <Route path="/checkout/cash-payment-pending" element={<CashPaymentPending />} />
          <Route path={ROUTES.STUDENT_COURSE_VIEW} element={<StudentCoursesView />} />
        </Route>

        {/* Teacher Routes with Sidebar */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.TEACHER_DASHBOARD} element={<TeacherDashboardModern />} />
          <Route path={ROUTES.TEACHER_COURSES} element={<TeacherCourses />} />
          <Route path="/teacher/courses/:courseId" element={<TeacherCourseDetail />} />
          <Route path={ROUTES.TEACHER_LIVE_CLASSES} element={<TeacherLiveClasses />} />
          <Route path={ROUTES.TEACHER_STUDENTS} element={<TeacherStudents />} />
          <Route path={ROUTES.TEACHER_QUIZZES} element={<TeacherQuizzes />} />
          <Route path="/teacher/quizzes/:quizId/questions" element={<ManageQuestions />} />
          <Route path="/teacher/quizzes/:quizId/grade" element={<GradeQuiz />} />
          <Route path="/teacher/quizzes/:quizId/results" element={<QuizResultsDashboard />} />
          <Route path={ROUTES.TEACHER_RECORDINGS} element={<TeacherRecordings />} />
          <Route path={ROUTES.TEACHER_REVENUE} element={<TeacherRevenue />} />
          <Route path={ROUTES.TEACHER_REWARDS} element={<TeacherRewards />} />
          <Route path={ROUTES.TEACHER_ANNOUNCEMENTS} element={<TeacherAnnouncements />} />
          <Route path={ROUTES.TEACHER_PROFILE} element={<TeacherProfile />} />
        </Route>

        {/* Admin Routes with Sidebar */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardModern />} />
          <Route path={ROUTES.ADMIN_STUDENTS} element={<AdminStudents />} />
          <Route path={ROUTES.ADMIN_TEACHERS} element={<AdminTeachers />} />
          <Route path={ROUTES.ADMIN_COURSES} element={<AdminCourses />} />
          <Route path="/admin/courses/moderation" element={<AdminCourseModeration />} />
          <Route path={ROUTES.ADMIN_PAYMENTS} element={<AdminPayments />} />
          <Route path={ROUTES.ADMIN_QUIZZES} element={<AdminQuizzes />} />
          <Route path={ROUTES.ADMIN_CERTIFICATES} element={<AdminCertificates />} />
          <Route path={ROUTES.ADMIN_MANAGEMENT} element={<AdminManagement />} />
          <Route path={ROUTES.ADMIN_REPORTS} element={<AdminReports />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
        </Route>

        {/* Developer Routes with Sidebar */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.DEVELOPER]}>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DEVELOPER_DASHBOARD} element={<DeveloperDashboardModern />} />
          <Route path={ROUTES.DEVELOPER_SYSTEM_HEALTH} element={<SystemHealth />} />
          <Route path={ROUTES.DEVELOPER_API_LOGS} element={<APILogs />} />
          <Route path={ROUTES.DEVELOPER_ERROR_MONITORING} element={<ErrorMonitoring />} />
          <Route path={ROUTES.DEVELOPER_FEATURE_FLAGS} element={<FeatureFlags />} />
          <Route path={ROUTES.DEVELOPER_INTEGRATION_STATUS} element={<IntegrationStatus />} />
        </Route>
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
