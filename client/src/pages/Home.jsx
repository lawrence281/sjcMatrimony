import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Heart, Instagram, PhoneCall, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import FireworksCanvas from '../components/FireworksCanvas'

export default function Home() {
  const { t } = useLanguage()
  const [dynamicTrending, setDynamicTrending] = useState([])
  const [email, setEmail] = useState('')

  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3009';

  const resolveMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${BACKEND_URL}${url}`;
  };

  useEffect(() => {
    api.get('/trending').then(r => setDynamicTrending(r.data.items)).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <FireworksCanvas />
        <div className="hero-bg-text">SJC Matrimony</div>
        <div className="hero-content">
          <div className="hero-grid">
            <div>
              <div className="hero-tag">TRUSTED MATRIMONY PLATFORM</div>
              <h1 className="hero-title">Find Your Perfect Life Partner</h1>
              <p className="hero-subtitle">
                Connect with compatible matches within the SJC community. Safe, verified, and community-driven.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn btn-dark btn-hero">
                  Get Started
                </Link>
                <Link to="/contact" className="btn btn-outline btn-hero" style={{ marginLeft: 12 }}>
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hero-features">
              <div className="hero-feature">Verified Profiles</div>
              <div className="hero-feature">Community Driven</div>
              <div className="hero-feature">Safe & Private</div>
              <div className="hero-feature">Trusted Matches</div>
            </div>
          </div>
        </div>
        
        {/* Hero Bottom-Right Context Icons */}
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
          <Link to="/safety" title="Guidelines" style={{ color: 'var(--text-dark)', opacity: 0.8, transition: 'all 0.2s', padding: '6px', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'grid', placeItems: 'center', backdropFilter: 'blur(10px)' }} onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.transform = 'none' }}><Sparkles size={20} /></Link>
        </div>
      </section>

      {/* Showcase / Trending Section */}
      {dynamicTrending.length > 0 && (
        <section className="trending-section-refined">
          <div className="container">
            <div className="trending-header-refined">
              <div>
                <h2 className="trending-title-main">{t('trending_now')}</h2>
                <p className="trending-subtitle-sub">Highlights from our community</p>
              </div>
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
      )}

      {/* Why Choose Us */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Why SJC Matrimony</div>
            <h2 className="section-title">Your Trusted Partner in Finding Love</h2>
            <p className="section-sub">We bring families together through trust, faith, and community values.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginTop: 32 }}>
            {[
              { icon: '✅', title: 'Verified Profiles', desc: 'Every profile is manually reviewed for authenticity.' },
              { icon: '🔒', title: 'Privacy First', desc: 'Your data is protected and shared only with your consent.' },
              { icon: '💑', title: 'Community Focused', desc: 'Matches within the SJC community and faith tradition.' },
              { icon: '📞', title: '24/7 Support', desc: 'Our team is always here to assist you on your journey.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Sign Up CTA */}
      <div className="section">
        <div className="newsletter-section newsletter-container">
          <h2>{t('newsletter_title')}</h2>
          <p>Join our community and start your journey towards a meaningful partnership.</p>
          <form className="newsletter-form" onSubmit={e => { e.preventDefault(); alert('Thank you! We will be in touch soon.'); setEmail('') }}>
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
              <div className="logo"><div className="logo-icon"><Heart size={14} fill="currentColor" /></div><span>SJC Matrimony</span></div>
              <p>Bringing families together through faith, trust, and community values.</p>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/login">Register / Login</Link>
              <Link to="/profile">My Profile</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link to="/safety">Guidelines</Link>
              <Link to="/contact">Contact Support</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
          </div>
          <div className="footer-bottom" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <p>© 2024 SJC Matrimony. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
