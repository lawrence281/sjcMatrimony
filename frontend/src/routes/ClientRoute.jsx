import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import Loader from '@/components/common/Loader/Loader';

/**
 * Client-only route guard.
 * Redirects admin users to admin dashboard.
 */
const ClientRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isClient, isAdmin } = useAuth();

  if (isLoading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (isAdmin) return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
  if (!isClient) return <Navigate to={ROUTES.UNAUTHORIZED} replace />;

  return children;
};

export default ClientRoute;
