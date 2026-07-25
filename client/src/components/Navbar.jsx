import { Link, useNavigate } from 'react-router-dom'
import { User, X, Heart, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="navbar-logo-icon">
              <Heart size={18} fill="currentColor" />
            </div>
            SJC Matrimony
          </Link>

          <div className="navbar-links">
            <Link to="/contact">{t('contact_support')}</Link>
            <Link to="/safety">{t('safety_guide')}</Link>
          </div>

          <div className="navbar-right">
            {user ? (
              <Link to="/profile" className="navbar-icon-btn hide-on-mobile" title={t('my_account')}>
                <User size={20} />
              </Link>
            ) : (
              <Link to="/login" className="navbar-icon-btn hide-on-mobile">
                <User size={20} />
              </Link>
            )}
            <button className="navbar-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-inner">
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>{t('contact_support')}</Link>
            <Link to="/safety" onClick={() => setMobileMenuOpen(false)}>{t('safety_guide')}</Link>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>{t('my_profile')}</Link>
                <button className="btn btn-dark" style={{ width: '100%', marginTop: 10, justifyContent: 'center' }} onClick={() => { logout(); setMobileMenuOpen(false); }}>{t('sign_out')}</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-dark" style={{ width: '100%', marginTop: 10, textAlign: 'center', justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>{t('sign_in')}</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
