import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

/**
 * Auth Layout — Centered card layout for login/register/forgot password pages.
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex gradient-hero">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-white font-heading font-bold text-2xl">Matrimony</span>
        </Link>

        <div>
          <blockquote className="text-white/90 text-2xl font-light font-heading leading-relaxed mb-6">
            "Finding your life partner is one of the most important decisions.
            We're here to make it beautiful."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white/30 bg-gradient-to-br from-primary-400 to-secondary-400"
                />
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">50,000+ Happy Couples</p>
              <p className="text-white/60 text-xs">Found their match on our platform</p>
            </div>
          </div>
        </div>

        <p className="text-white/40 text-sm">© {new Date().getFullYear()} Matrimony Platform. All rights reserved.</p>
      </div>

      {/* Right — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-white font-heading font-bold text-xl">Matrimony</span>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
