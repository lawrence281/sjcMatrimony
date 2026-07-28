import { Link, useLocation } from 'react-router-dom'
import { User, X, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItemStyle = (path) => ({
    fontSize: '14px',
    fontWeight: isActive(path) ? 600 : 500,
    color: isActive(path) ? '#1E2B45' : '#475467',
    textDecoration: 'none',
    borderBottom: isActive(path) ? '2px solid #1E2B45' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'all 0.2s ease-in-out'
  })

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 400,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #EAE5DC',
      padding: '14px 0',
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
        {/* Brand Logo - Ave Maria Matrimony */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: '#1E2B45',
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '-0.01em'
        }}>
          <span style={{ fontWeight: 700, color: '#1E2B45' }}>Ave Maria Matrimony</span>
        </Link>

        {/* Center Nav Links (Centrally Positioned) */}
        <div className="navbar-links hide-on-mobile" style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}>
          <Link to="/" style={navItemStyle('/')}>
            Home
          </Link>
          <Link to="/browse" style={navItemStyle('/browse')}>
            Browse Members
          </Link>
          <Link to="/subscription" style={navItemStyle('/subscription')}>
            Membership
          </Link>
          {user && (
            <Link to="/my-contact-requests" style={navItemStyle('/my-contact-requests')}>
              Contact Requests
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!user ? (
            <>
              <Link 
                to="/login" 
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1E2B45',
                  textDecoration: 'none',
                  padding: '6px 12px'
                }}
              >
                Login
              </Link>
              <Link 
                to="/login" 
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  background: '#1E2B45',
                  padding: '10px 24px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(30, 43, 69, 0.15)',
                  transition: 'transform 0.2s, background 0.2s'
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <Link 
              to="/profile" 
              title="View My Profile"
              className="navbar-profile-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '24px',
                background: isActive('/profile') ? '#1E2B45' : '#F3F0E9',
                border: '1.5px solid #EAE5DC',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <span 
                className="hide-on-mobile"
                style={{ 
                  fontSize: '13.5px', 
                  fontWeight: 600, 
                  color: isActive('/profile') ? '#FFFFFF' : '#1B2535',
                  whiteSpace: 'nowrap'
                }}
              >
                Hi, {user?.firstName || user?.name?.split(' ')[0] || 'Member'} 👋
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isActive('/profile') ? '#C59B4E' : '#1E2B45',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                <User size={16} color="#FFFFFF" />
              </div>
            </Link>
          )}
          
          <button 
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'none',
              color: '#1E2B45'
            }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderBottom: '1px solid #EAE5DC',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 12px 32px rgba(30, 43, 69, 0.08)',
          zIndex: 350
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: isActive('/') ? 700 : 500, color: isActive('/') ? '#1E2B45' : '#475467', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/browse" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: isActive('/browse') ? 700 : 500, color: isActive('/browse') ? '#1E2B45' : '#475467', textDecoration: 'none' }}>
            Browse Members
          </Link>
          <Link to="/subscription" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: isActive('/subscription') ? 700 : 500, color: isActive('/subscription') ? '#1E2B45' : '#475467', textDecoration: 'none' }}>
            Membership
          </Link>
          {user && (
            <Link to="/my-contact-requests" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: isActive('/my-contact-requests') ? 700 : 500, color: isActive('/my-contact-requests') ? '#1E2B45' : '#475467', textDecoration: 'none' }}>
              Contact Requests
            </Link>
          )}
          {!user && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #EAE5DC' }} />
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', background: '#1E2B45', padding: '10px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none' }}>
                Login / Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
