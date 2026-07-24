import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import api from '../services/api'
import { Zap, Instagram, PhoneCall, Sparkles, Info } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import FireworksCanvas from '../components/FireworksCanvas'

export default function Home() {
  const { t } = useLanguage()
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [dynamicTrending, setDynamicTrending] = useState([])
  const [categories, setCategories] = useState([])
  const [email, setEmail] = useState('')

  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3009';

  const resolveMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${BACKEND_URL}${url}`;
  };

  useEffect(() => {
    api.get('/products?featured=true&limit=4').then(r => setFeatured(r.data.products))
    api.get('/products?sort=-salesCount&limit=6').then(r => setTrending(r.data.products))
    api.get('/categories').then(r => setCategories(r.data.categories.filter(c => c.isActive)))
    api.get('/trending').then(r => setDynamicTrending(r.data.items)).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <FireworksCanvas />
        <div className="hero-bg-text">DK Ignite</div>
        <div className="hero-content">
          <div className="hero-grid">
            <div>
              <div className="hero-tag">{t('hero_tag')}</div>
              <h1 className="hero-title">{t('hero_title')}</h1>
              <p className="hero-subtitle">
                {t('hero_subtitle')}
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-dark btn-hero">
                  {t('shop_now')}
                </Link>
              </div>
            </div>
            <div className="hero-features">
              <div className="hero-feature">Professional Display Grade</div>
              <div className="hero-feature">Vibrant Color Saturation</div>
              <div className="hero-feature">Safety-First Manufacturing</div>
              <div className="hero-feature">Unbeatable Boom Factor</div>
            </div>
          </div>
        </div>
        
        {/* Hero Bottom-Left Context Icons */}
        <div className="hero-socials" style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          gap: '16px',
          zIndex: 10
        }}>
          <Link to="/contact" title="Support" style={{ color: 'var(--text-dark)', opacity: 0.8, transition: 'all 0.2s', padding: '6px', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'grid', placeItems: 'center', backdropFilter: 'blur(10px)' }} onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.transform = 'none' }}><Instagram size={20} /></Link>
          <Link to="/contact" title="Contact Us" style={{ color: 'var(--text-dark)', opacity: 0.8, transition: 'all 0.2s', padding: '6px', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'grid', placeItems: 'center', backdropFilter: 'blur(10px)' }} onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.transform = 'none' }}><PhoneCall size={20} /></Link>
          <Link to="/safety" title="Safety Rules" style={{ color: 'var(--text-dark)', opacity: 0.8, transition: 'all 0.2s', padding: '6px', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'grid', placeItems: 'center', backdropFilter: 'blur(10px)' }} onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.transform = 'none' }}><Sparkles size={20} /></Link>
        </div>
      </section>

      {/* Trending Now Refined */}
      <section className="trending-section-refined">
        <div className="container">
          <div className="trending-header-refined">
            <div>
              <h2 className="trending-title-main">{t('trending_now')}</h2>
              <p className="trending-subtitle-sub">{t('hero_subtitle')}</p>
            </div>
            <Link to="/products?sort=-salesCount" className="trending-view-all">{t('view_all')} →</Link>
          </div>

          <div className="trending-grid-refined">
            {/* Large Card */}
            <div className="trending-card-large">
              <div className="trending-card-large-bg">
                {dynamicTrending[0] ? (
                  dynamicTrending[0].mediaType === 'video' ? (
                    <video src={resolveMediaUrl(dynamicTrending[0].mediaUrl)} autoPlay loop muted playsInline className="trending-media-full" />
                  ) : (
                    <img src={resolveMediaUrl(dynamicTrending[0].mediaUrl)} alt={dynamicTrending[0].title || ''} className="trending-media-full" />
                  )
                ) : null}
              </div>
            </div>

            {/* Small Items Grid (2x2) */}
            <div className="trending-small-grid">
              {[0, 1, 2, 3].map(i => {
                const p = dynamicTrending[i + 1];
                return (
                  <div key={i} className={`trending-card-small card-bg-${i % 4}`}>
                    <div className="trending-small-item-content">
                      {p ? (
                        p.mediaType === 'video' ? (
                          <video src={resolveMediaUrl(p.mediaUrl)} autoPlay loop muted playsInline className="trending-media-full" />
                        ) : (
                          <img src={resolveMediaUrl(p.mediaUrl)} alt={p.title || ''} className="trending-media-full" />
                        )
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Display Series</div>
            <h2 className="section-title">Specialty Collections</h2>
            <p className="section-sub">Engineered for perfection. Browse our specialized series for every type of event.</p>
          </div>
          <div className="categories-horizontal-scroll">
            {categories.map((cat, i) => (
              <Link key={cat._id} to={`/products?category=${cat.slug}`} className="category-scroll-card">
                <div className="category-card-inner">
                  {cat.image && (
                    <img 
                      src={resolveMediaUrl(cat.image)} 
                      alt={cat.name} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  )}
                  <div 
                    className="category-card-placeholder" 
                    style={{ 
                      background: ['#1a1a2e', '#0f0f23', '#2d2d50', '#1a1a1a'][i % 4],
                      display: cat.image ? 'none' : 'flex'
                    }}>
                    {['🚀', '🧨', '✨', '🌪️'][i % 4]}
                  </div>
                  {i === 0 && <span className="category-card-badge">HOT</span>}
                  <div className="category-card-info">
                    <h3>{cat.name}</h3>
                    <p>{cat.description || 'Professional effects.'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section section-muted">
          <div className="container">
            <div className="section-header-row">
              <div>
                <div className="section-tag">Expert Choice</div>
                <div className="section-header-title">Must-Have Effects</div>
              </div>
              <Link to="/products?featured=true" className="view-all-link">Shop All →</Link>
            </div>
            <div className="products-grid products-grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <div className="section">
        <div className="newsletter-section newsletter-container">
          <h2>{t('newsletter_title')}</h2>
          <p>{t('newsletter_desc')}</p>
          <form className="newsletter-form" onSubmit={e => { e.preventDefault(); alert('Safety first! Welcome to the crew.'); setEmail('') }}>
            <input className="newsletter-input newsletter-input-dark" type="email" placeholder={t('newsletter_placeholder')} value={email}
              onChange={e => setEmail(e.target.value)} required />
            <button type="submit" className="btn newsletter-btn">{t('notify_me')}</button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo"><div className="logo-icon"><Zap size={14} fill="currentColor" /></div><span>DK Ignite</span></div>
              <p>Leading the industry in professional pyrotechnics. Safety, intensity, and unforgettable displays.</p>
            </div>
            <div className="footer-col">
              <h4>Shop</h4>
              {categories.slice(0, 4).map(cat => (
                 <Link key={cat._id} to={`/products?category=${cat.slug}`}>{cat.name}</Link>
              ))}
              <Link to="/products">All Fireworks</Link>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link to="/safety">Safety Rules</Link>
              {/* <a href="#">Shipping Zones</a>
              <a href="#">Wholesale</a> */}
              <Link to="/contact">Contact Support</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Usage Policy</a>
              {/* <a href="#">Safety Waivers</a> */}
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
          <div className="footer-bottom" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <p>© 2024 DK Ignite Pyrotechnics Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
