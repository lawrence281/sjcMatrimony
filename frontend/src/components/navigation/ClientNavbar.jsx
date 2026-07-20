import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/common/Icon/Icon';

const ClientNavbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const location = useLocation();

  const navLinks = [
    { to: ROUTES.CLIENT.DASHBOARD, label: 'Dashboard' },
    { to: ROUTES.CLIENT.SEARCH,    label: 'Search' },
    { to: ROUTES.CLIENT.INTERESTS, label: 'Interests' },
    { to: ROUTES.CLIENT.SHORTLIST, label: 'Shortlist' },
    { to: ROUTES.CLIENT.PLANS,     label: 'Premium' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-100 shadow-subtle transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={ROUTES.CLIENT.DASHBOARD} className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg font-serif">M</span>
            </div>
            <span className="font-heading font-bold text-xl text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">
              Matrimony<span className="text-primary-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5 bg-neutral-50/50 p-1 rounded-full border border-neutral-100">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-sm border border-neutral-200'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/80 border border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link 
              to={ROUTES.CLIENT.NOTIFICATIONS} 
              className="relative p-2.5 text-neutral-400 hover:text-primary-600 bg-neutral-50 hover:bg-primary-50 rounded-full transition-colors" 
              aria-label="Notifications"
            >
              <Icon name="bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white ring-2 ring-danger-light animate-pulse-slow"></span>
              )}
            </Link>

            <div className="h-6 w-px bg-neutral-200 hidden md:block mx-1"></div>

            <div className="flex items-center gap-3">
              <Link to={ROUTES.CLIENT.MY_PROFILE} className="group flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-primary-100 p-0.5 group-hover:border-primary-400 transition-colors">
                  {user?.profile?.avatar ? (
                    <img src={user.profile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-50 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </Link>
              
              <button 
                onClick={logout} 
                className="hidden md:flex p-2 text-neutral-400 hover:text-danger hover:bg-danger-light rounded-full transition-colors"
                aria-label="Logout"
              >
                <Icon name="logOut" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientNavbar;
