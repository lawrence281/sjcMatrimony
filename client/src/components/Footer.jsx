import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Thank you for subscribing to Ave Maria Matrimony updates!')
      setEmail('')
    }
  }

  return (
    <footer style={{
      background: '#DCE7F7',
      color: '#475467',
      padding: '56px 24px 32px 24px',
      fontSize: '13px',
      fontFamily: "'Inter', sans-serif",
      borderTop: '1px solid #CBD5E1'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
        gap: '40px',
        paddingBottom: '40px',
        borderBottom: '1px solid #C4D3EA'
      }} className="footer-grid">
        
        {/* Brand Column */}
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#1E2B45',
              marginBottom: '12px'
            }}>
              Ave Maria Matrimony
            </div>
          </Link>
          <p style={{ lineHeight: 1.6, maxWidth: '300px', margin: '0 0 16px 0', color: '#475467', fontSize: '13px' }}>
            Sacredly Committed to Lifelong Unions. Connecting the global Catholic community with integrity and faith.
          </p>
        </div>

        {/* Resources Column */}
        <div>
          <h4 style={{ color: '#1E2B45', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
            Resources
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/about" style={{ color: '#475467', textDecoration: 'none' }}>Parish Resources</Link>
            <Link to="/about" style={{ color: '#475467', textDecoration: 'none' }}>Canon Law Guide</Link>
            <a href="/#success-stories" style={{ color: '#475467', textDecoration: 'none' }}>Success Stories</a>
          </div>
        </div>

        {/* Legal Column */}
        <div>
          <h4 style={{ color: '#1E2B45', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
            Legal
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/privacy" style={{ color: '#475467', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#475467', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/contact" style={{ color: '#475467', textDecoration: 'none' }}>Contact Support</Link>
          </div>
        </div>

        {/* Contact / Newsletter Column */}
        <div>
          <h4 style={{ color: '#1E2B45', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
            Contact & Updates
          </h4>
          <p style={{ fontSize: '12px', color: '#475467', marginBottom: '12px', lineHeight: 1.5 }}>
            Faithful guidance delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#1E2B45',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              aria-label="Subscribe"
              style={{
                background: '#1E2B45',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0 14px',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <Send size={14} />
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#1E2B45', fontWeight: 500 }}>
            <Globe size={15} />
            <span>English (Global)</span>
          </div>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div style={{
        maxWidth: '1240px',
        margin: '20px auto 0 auto',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748B'
      }}>
        © {new Date().getFullYear()} Ave Maria Matrimony. Sacredly Committed to Lifelong Unions.
      </div>
    </footer>
  )
}
