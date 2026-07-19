import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import Loader from '@/components/common/Loader/Loader';

/**
 * Admin-only route guard.
 * Redirects clients and unauthenticated users appropriately.
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!isAdmin) return <Navigate to={ROUTES.UNAUTHORIZED} replace />;

  return children;
};

export default AdminRoute;
