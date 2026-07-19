import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { ROUTES } from '@/constants/routes';

const ClientNavbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();

  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.CLIENT.DASHBOARD} className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-heading font-bold text-lg text-gradient">Matrimony</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: ROUTES.CLIENT.DASHBOARD, label: 'Dashboard' },
              { to: ROUTES.CLIENT.SEARCH,    label: 'Search' },
              { to: ROUTES.CLIENT.INTERESTS, label: 'Interests' },
              { to: ROUTES.CLIENT.SHORTLIST, label: 'Shortlist' },
              { to: ROUTES.CLIENT.PLANS,     label: 'Plans' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-primary-700 hover:bg-primary-50 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link to={ROUTES.CLIENT.NOTIFICATIONS} className="btn-ghost btn-icon relative" aria-label="Notifications">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 gradient-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to={ROUTES.CLIENT.MY_PROFILE} className="flex items-center gap-2 pl-2 ml-1 border-l border-neutral-100">
              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </Link>
            <button onClick={logout} className="btn-ghost btn-sm hidden md:flex">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientNavbar;
