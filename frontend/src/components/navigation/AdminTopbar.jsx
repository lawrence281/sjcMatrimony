import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';

const AdminTopbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className="fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-6 bg-white/90 backdrop-blur-sm border-b border-neutral-100"
      style={{ height: 'var(--topbar-height)' }}
    >
      {/* Menu Toggle */}
      <button
        onClick={onMenuToggle}
        className="btn-ghost btn-icon text-neutral-600"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="btn-ghost btn-icon text-neutral-600" aria-label="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <button className="btn-ghost btn-icon text-neutral-600 relative" aria-label="Notifications">
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 gradient-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-neutral-100">
          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-neutral-800 leading-tight">{user?.email}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
