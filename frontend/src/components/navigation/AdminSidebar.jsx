import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';

const navItems = [
  { path: ROUTES.ADMIN.DASHBOARD,     label: 'Dashboard',     icon: '📊' },
  { path: ROUTES.ADMIN.PROFILES,      label: 'Profiles',      icon: '👤' },
  { path: ROUTES.ADMIN.SUBSCRIPTIONS, label: 'Subscriptions', icon: '💳' },
  { path: ROUTES.ADMIN.PAYMENTS,      label: 'Payments',      icon: '💰' },
  { path: ROUTES.ADMIN.REPORTS,       label: 'Reports',       icon: '🚩' },
  { path: ROUTES.ADMIN.SETTINGS,      label: 'Settings',      icon: '⚙️' },
  { path: ROUTES.ADMIN.ADMINS,        label: 'Team',          icon: '👥' },
];

const AdminSidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 flex flex-col text-white transition-all duration-300 overflow-hidden"
      style={{
        width: isOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)',
        backgroundColor: 'var(--bg-sidebar)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <p className="font-heading font-bold text-base leading-tight truncate">Matrimony</p>
            <p className="text-white/40 text-xs truncate">Admin Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${!isOpen ? 'justify-center px-2' : ''}`
            }
            title={!isOpen ? item.label : undefined}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {isOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        {isOpen ? (
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-white/40 text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={logout}
              className="text-white/40 hover:text-white transition-colors flex-shrink-0"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="sidebar-link w-full justify-center"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
