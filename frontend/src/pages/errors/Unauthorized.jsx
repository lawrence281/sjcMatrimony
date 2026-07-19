import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

const Unauthorized = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="text-center max-w-md animate-scale-in">
        <div className="text-8xl mb-6 select-none">🚫</div>
        <h1 className="text-6xl font-extrabold font-heading text-gradient mb-4">403</h1>
        <h2 className="text-2xl font-bold text-neutral-800 font-heading mb-3">Access Denied</h2>
        <p className="text-neutral-500 mb-8 leading-relaxed">
          You don't have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link
          to={isAdmin ? ROUTES.ADMIN.DASHBOARD : ROUTES.CLIENT.DASHBOARD}
          className="btn-primary"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
