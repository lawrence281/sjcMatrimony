import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Heart, User, X, Zap, Menu } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartDrawer from './CartDrawer'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const { t } = useLanguage()
  const { count, isOpen, setIsOpen } = useCart()
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`)
      setSearch('')
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="navbar-logo-icon"><Zap size={18} fill="currentColor" /></div>
            DK Ignite
          </Link>

          <div className="navbar-links">
            <Link to="/products">{t('shop_all')}</Link>
            <Link to="/combos">{t('combo_pack')}</Link>
            <Link to="/contact">{t('contact_support')}</Link>
          </div>

          <div className="navbar-right">
            <form onSubmit={handleSearch} className="navbar-search-form">
              <input className="search-input" placeholder={t('search_placeholder')} value={search}
                onChange={e => setSearch(e.target.value)} />
            </form>
            <button className="navbar-icon-btn" onClick={() => setIsOpen(true)}>
              <ShoppingBag size={20} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
            <Link to="/wishlist" className="navbar-icon-btn hide-on-mobile">
              <Heart size={20} />
            </Link>
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
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>{t('shop_all')}</Link>
            <Link to="/combos" onClick={() => setMobileMenuOpen(false)}>{t('combo_pack')}</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>{t('contact_support')}</Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>{t('my_wishlist')}</Link>
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

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
