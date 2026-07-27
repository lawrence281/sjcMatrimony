import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Send, ShieldCheck, Heart, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Thank you for subscribing to SJC Matrimony newsletter!')
      setEmail('')
    }
  }

  return (
    <footer style={{
      background: '#101928',
      color: '#94A3B8',
      padding: '64px 24px 32px 24px',
      fontSize: '13px',
      fontFamily: "'Inter', sans-serif",
      borderTop: '1px solid #1E293B'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 2fr',
        gap: '48px',
        paddingBottom: '48px',
        borderBottom: '1px solid #1E293B'
      }} className="footer-grid">
        
        {/* Brand Column */}
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #C59B4E 0%, #E2B96D 100%)',
                display: 'grid',
                placeItems: 'center'
              }}>
                <Sparkles size={18} color="#FFFFFF" fill="#FFFFFF" />
              </div>
              <span>SJC Matrimony</span>
            </div>
          </Link>
          <p style={{ lineHeight: 1.7, maxWidth: '300px', margin: '0 0 16px 0', color: '#94A3B8', fontSize: '13px' }}>
            A trusted and sacred platform for RC Christian matrimony. Connecting verified members committed to faith, tradition, and lifelong holy union.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C59B4E', fontSize: '12px', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>100% Church & Govt Verified Community</span>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div>
          <h4 style={{ color: '#C59B4E', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
            QUICK LINKS
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
            <Link to="/browse" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Members</Link>
            <Link to="/subscription" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Subscription</Link>
            <Link to="/profile" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>My Profile</Link>
          </div>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 style={{ color: '#C59B4E', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
            SUPPORT & TRUST
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/privacy" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</Link>
            <Link to="/contact" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Contact Support</Link>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 style={{ color: '#C59B4E', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
            STAY CONNECTED
          </h4>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px', lineHeight: 1.6 }}>
            Subscribe to receive matrimony updates, guidance, and community announcements.
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="email"
              placeholder="Your email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#1E293B',
                border: '1px solid #334155',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              aria-label="Subscribe to newsletter"
              style={{
                background: '#C59B4E',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0 16px',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                transition: 'background 0.2s'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div style={{
        maxWidth: '1240px',
        margin: '24px auto 0 auto',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <div>
          © {new Date().getFullYear()} <strong>SJC Matrimony</strong>. All rights reserved. Sacred unions, faithfully guided.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/contact" style={{ color: '#64748B', textDecoration: 'none' }}>Contact</Link>
        </div>
      </div>
    </footer>
  )
}
