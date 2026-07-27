import { Link, useLocation } from 'react-router-dom'
import { User, X, Sparkles, Menu } from 'lucide-react'
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
    color: isActive(path) ? '#B88E4C' : '#475467',
    textDecoration: 'none',
    borderBottom: isActive(path) ? '2px solid #B88E4C' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'all 0.2s ease-in-out'
  })

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
          gap: '10px',
          textDecoration: 'none',
          color: '#1B2535',
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: '25px',
          fontWeight: 700,
          letterSpacing: '-0.02em'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1A273D 0%, #2A3B56 100%)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 2px 8px rgba(26, 39, 61, 0.2)'
          }}>
            <Sparkles size={18} color="#C59B4E" fill="#C59B4E" />
          </div>
          <span style={{ fontWeight: 700, color: '#1B2535' }}>SJC Matrimony</span>
        </Link>

        {/* Center Links (Logo links to Home; center links contain Members & Subscription) */}
        <div className="navbar-links hide-on-mobile" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/browse" style={navItemStyle('/browse')}>
            Members
          </Link>
          <Link to="/subscription" style={navItemStyle('/subscription')}>
            Subscription
          </Link>
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
          ) : (
            /* User Greeting & Profile Icon Button on Right Side */
            <Link 
              to="/profile" 
              title="View My Profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '24px',
                background: isActive('/profile') ? '#1A273D' : '#F3F0E9',
                border: '1.5px solid #EAE5DC',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <span style={{ 
                fontSize: '13.5px', 
                fontWeight: 600, 
                color: isActive('/profile') ? '#FFFFFF' : '#1B2535',
                whiteSpace: 'nowrap'
              }}>
                Hi, {user?.firstName || user?.name?.split(' ')[0] || 'Member'} 👋
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isActive('/profile') ? '#C59B4E' : '#1A273D',
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
              color: '#1B2535'
            }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer" style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #EAE5DC',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Link to="/browse" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: isActive('/browse') ? 700 : 500, color: isActive('/browse') ? '#B88E4C' : '#1B2535', textDecoration: 'none' }}>
            Members
          </Link>
          <Link to="/subscription" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: isActive('/subscription') ? 700 : 500, color: isActive('/subscription') ? '#B88E4C' : '#1B2535', textDecoration: 'none' }}>
            Subscription
          </Link>
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: isActive('/profile') ? 700 : 500, color: isActive('/profile') ? '#B88E4C' : '#1B2535', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#B88E4C" />
            <span>My Profile</span>
          </Link>
          {!user && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #EAE5DC' }} />
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', background: '#1A273D', padding: '10px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none' }}>
                Sign In / Join Now
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}




