import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="text-center max-w-md animate-scale-in">
        <div className="text-8xl mb-6 select-none">🔍</div>
        <h1 className="text-6xl font-extrabold font-heading text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-bold text-neutral-800 font-heading mb-3">Page Not Found</h2>
        <p className="text-neutral-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn-outline">
            ← Go Back
          </button>
          <Link to={ROUTES.HOME} className="btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
