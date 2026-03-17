import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES, ROLES } from '../utils/constants';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const dashboardRoutes = {
      [ROLES.STUDENT]: ROUTES.STUDENT_DASHBOARD,
      [ROLES.TEACHER]: ROUTES.TEACHER_DASHBOARD,
      [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
      [ROLES.SUPERADMIN]: ROUTES.ADMIN_DASHBOARD,
      [ROLES.DEVELOPER]: ROUTES.DEVELOPER_DASHBOARD,
    };
    return <Navigate to={dashboardRoutes[user?.role] || ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
