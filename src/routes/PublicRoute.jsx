import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../utils/constants';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.role) {
    const dashboardRoutes = {
      STUDENT: ROUTES.STUDENT_DASHBOARD,
      TEACHER: ROUTES.TEACHER_DASHBOARD,
      ADMIN: ROUTES.ADMIN_DASHBOARD,
      SUPER_ADMIN: ROUTES.ADMIN_DASHBOARD,
      DEVELOPER: ROUTES.DEVELOPER_DASHBOARD,
    };
    console.log('Redirecting to:', dashboardRoutes[user.role]);
    return <Navigate to={dashboardRoutes[user.role] || ROUTES.HOME} replace />;
  }

  return children;
};

export default PublicRoute;
