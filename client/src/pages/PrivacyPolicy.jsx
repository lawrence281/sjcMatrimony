import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', padding: '48px 24px 80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#B88E4C', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header Card */}
        <div style={{
          background: '#1A273D',
          borderRadius: '20px',
          padding: '40px 36px',
          color: '#FFFFFF',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(26, 39, 61, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(197, 155, 78, 0.2)',
              border: '1px solid rgba(197, 155, 78, 0.4)',
              color: '#FBF6ED',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px'
            }}>
              <Lock size={14} color="#C59B4E" />
              <span>SJC Matrimony Trust & Safety</span>
            </div>
            
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', fontWeight: 700, margin: '0 0 12px 0', lineHeight: 1.15 }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: '15px', color: '#94A3B8', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>
              At SJC Matrimony, we treat your personal information with sacred respect, confidentiality, and strict security standard protection.
            </p>
          </div>
        </div>

        {/* Content Body Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EFEBE4',
          padding: '40px 36px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          color: '#334155',
          fontSize: '14.5px',
          lineHeight: 1.8
        }}>
          
          <p style={{ marginTop: 0, fontSize: '15px', fontWeight: 500, color: '#1B2535' }}>
            Effective Date: January 1, 2026 | Last Updated: July 2026
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #F3F0E9', margin: '24px 0' }} />

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            1. Overview & Principles
          </h2>
          <p>
            SJC Matrimony ("we", "our", "us") is dedicated to assisting Christian individuals in finding faithful, lifelong marriage partners. We understand that searching for a life partner requires sharing sensitive personal, religious, and family information. This Privacy Policy details how we collect, store, verify, and protect your data.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            2. Information We Collect
          </h2>
          <p>To provide intentional match recommendations and ensure authentic community safety, we collect:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Basic Profile Data:</strong> Full name, gender, date of birth, contact details (email and phone number), profile photos, and account credentials.</li>
            <li style={{ marginBottom: '8px' }}><strong>Religious & Sacramental Data:</strong> Denomination, diocese, local church name, church address, baptism status, confirmation status, first Holy Communion status, and ministry participation.</li>
            <li style={{ marginBottom: '8px' }}><strong>Personal & Lifestyle Attributes:</strong> Marital status, height, weight, mother tongue, languages known, diet, and physical status.</li>
            <li style={{ marginBottom: '8px' }}><strong>Education & Career:</strong> Qualifications, degree, specialization, college, university, graduation year, occupation, designation, company, annual income, and work location.</li>
            <li style={{ marginBottom: '8px' }}><strong>Family Background:</strong> Family type, status, values, parent details, and sibling information.</li>
            <li style={{ marginBottom: '8px' }}><strong>Verification Documents:</strong> Identity proof and baptism certificates uploaded strictly for administrative verification.</li>
          </ul>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            3. How We Use Your Information
          </h2>
          <p>Your information is used solely for authentic matchmaking and portal operations:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>To display your verified profile to eligible, active Christian members searching for matrimony.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>To verify identity and parish background, preventing fraudulent or fake profiles.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>To enable mutual interest connections and contact request notifications.</span>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            4. Profile Privacy & Verification Controls
          </h2>
          <p>
            Only <strong>Active & Verified</strong> profiles appear in our member directory. Government ID proofs and baptism documents uploaded for verification are strictly kept confidential for administrative safety checks and are never publicly displayed or sold.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            5. Data Protection & Security
          </h2>
          <p>
            We implement high-grade encryption, secure server architecture, and access controls to guard your personal data against unauthorized access, disclosure, or misuse.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            6. Contact Our Privacy Team
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to update or delete your profile data, please contact our support team at <a href="mailto:support@sjcmatrimony.org" style={{ color: '#B88E4C', fontWeight: 600 }}>support@sjcmatrimony.org</a> or visit our <Link to="/contact" style={{ color: '#B88E4C', fontWeight: 600 }}>Contact Page</Link>.
          </p>

        </div>

      </div>
    </div>
  )
}
