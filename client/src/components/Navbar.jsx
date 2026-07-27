import { Link, useLocation } from 'react-router-dom'
import { User, X, Sparkles, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 400,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #EAE5DC',
      padding: '12px 0',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="navbar-inner" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: '#1B2535',
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '-0.02em'
        }}>
          <Sparkles size={20} color="#B88E4C" fill="#B88E4C" style={{ opacity: 0.9 }} />
          <span>Grace & Covenant</span>
        </Link>

        {/* Center Links */}
        <div className="navbar-links hide-on-mobile" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link 
            to="/browse" 
            style={{
              fontSize: '14px',
              fontWeight: isActive('/browse') ? 600 : 500,
              color: isActive('/browse') ? '#B88E4C' : '#475467',
              textDecoration: 'none',
              borderBottom: isActive('/browse') ? '2px solid #B88E4C' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'all 0.2s'
            }}
          >
            Browse Members
          </Link>
          <a 
            href="#success-stories" 
            style={{ fontSize: '14px', fontWeight: 500, color: '#475467', textDecoration: 'none', transition: 'color 0.2s' }}
            onClick={(e) => {
              if (location.pathname !== '/') {
                // allow navigating back home
              }
            }}
          >
            Success Stories
          </a>
          <a 
            href="#denominations" 
            style={{ fontSize: '14px', fontWeight: 500, color: '#475467', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            Denominations
          </a>
          <Link 
            to="/safety" 
            style={{ fontSize: '14px', fontWeight: 500, color: '#475467', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            About Us
          </Link>
        </div>

        {/* Right Actions */}
        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <Link 
                to="/profile" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1B2535',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: '#F3F0E9',
                  transition: 'background 0.2s'
                }}
              >
                <User size={16} color="#B88E4C" />
                <span>My Profile</span>
              </Link>
              <button 
                onClick={logout}
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#667085',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1B2535',
                  textDecoration: 'none',
                  padding: '6px 12px'
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/login" 
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  background: '#1A273D',
                  padding: '10px 22px',
                  borderRadius: '24px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(26, 39, 61, 0.15)',
                  transition: 'transform 0.2s, background 0.2s'
                }}
              >
                Join Now
              </Link>
            </>
          )}
          
          <button 
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'none',
              color: '#1B2535'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer" style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #EAE5DC',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Link to="/browse" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535', textDecoration: 'none' }}>
            Browse Members
          </Link>
          <Link to="/safety" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: 500, color: '#475467', textDecoration: 'none' }}>
            About Us & Safety
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: 500, color: '#475467', textDecoration: 'none' }}>
            Contact Support
          </Link>
          <hr style={{ border: 'none', borderTop: '1px solid #EAE5DC' }} />
          {user ? (
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: 600, color: '#B88E4C', textDecoration: 'none' }}>
              My Profile
            </Link>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', background: '#1A273D', padding: '10px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none' }}>
              Sign In / Join Now
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

