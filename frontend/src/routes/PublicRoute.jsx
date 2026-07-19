import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import Loader from '@/components/common/Loader/Loader';

/**
 * Public-only routes (login, register).
 * Redirects authenticated users to their appropriate dashboard.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) return <Loader fullScreen />;

  if (isAuthenticated) {
    const redirect = isAdmin ? ROUTES.ADMIN.DASHBOARD : ROUTES.CLIENT.DASHBOARD;
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default PublicRoute;
