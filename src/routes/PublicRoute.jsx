import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES, ROLES } from '../utils/constants';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.role) {
    const dashboardRoutes = {
      [ROLES.STUDENT]: ROUTES.STUDENT_DASHBOARD,
      [ROLES.TEACHER]: ROUTES.TEACHER_DASHBOARD,
      [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
      [ROLES.SUPERADMIN]: ROUTES.ADMIN_DASHBOARD,
      [ROLES.DEVELOPER]: ROUTES.DEVELOPER_DASHBOARD,
    };
    console.log('Redirecting to:', dashboardRoutes[user.role]);
    return <Navigate to={dashboardRoutes[user.role] || ROUTES.HOME} replace />;
  }

  return children;
};

export default PublicRoute;
