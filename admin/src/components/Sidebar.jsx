import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Sparkles, LayoutGrid, Sun, Moon, Users } from 'lucide-react'
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
          <span>DK IGNITE</span>
          <small>Admin Portal</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        <NavLink to="/" end>
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>
        <NavLink to="/orders">
          <ShoppingCart size={17} />
          Orders
        </NavLink>
        <NavLink to="/users">
          <Users size={17} />
          Users Management
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
