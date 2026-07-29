import { NavLink } from 'react-router-dom'
import { LayoutDashboard, LogOut, Sparkles, Sun, Moon, Users, PhoneCall, CreditCard, BookOpen, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Sidebar() {
  const { admin, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Sparkles size={16} fill="currentColor" /></div>
        <div>
          <span>SJC Matrimony</span>
          <small>Admin Portal</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        <NavLink to="/" end>
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>
        <NavLink to="/users">
          <Users size={17} />
          Profile Management
        </NavLink>
        <NavLink to="/contact-requests">
          <PhoneCall size={17} />
          Contact Requests
        </NavLink>
        <NavLink to="/subscriptions">
          <CreditCard size={17} />
          Subscriptions
        </NavLink>
        <NavLink to="/marriage-register">
          <BookOpen size={17} />
          Marriage Register
        </NavLink>

        <div className="sidebar-section-label" style={{ marginTop: 12 }}>System</div>
        <NavLink to="/settings">
          <Settings size={17} />
          Configuration
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, truncate: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          Logged in as <strong style={{ color: 'var(--text-secondary)' }}>{admin?.name}</strong>
        </div>
        
        <button 
          className="btn btn-sm btn-outline" 
          onClick={toggleTheme} 
          style={{ width: '100%', justifyContent: 'center', marginBottom: 8, gap: 10 }}
        >
          {theme === 'dark' ? <><Sun size={14} /> Light Mode</> : <><Moon size={14} /> Dark Mode</>}
        </button>

        <button className="logout-btn" onClick={logout}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
