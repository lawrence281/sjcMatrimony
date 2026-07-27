import { Link } from 'react-router-dom'
import { FileText, ShieldCheck, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react'

export default function TermsOfService() {
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
              <FileText size={14} color="#C59B4E" />
              <span>SJC Matrimony Community Agreement</span>
            </div>
            
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', fontWeight: 700, margin: '0 0 12px 0', lineHeight: 1.15 }}>
              Terms of Service
            </h1>
            <p style={{ fontSize: '15px', color: '#94A3B8', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>
              Welcome to SJC Matrimony. By registering or accessing our platform, you agree to comply with our community terms and standards.
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
            1. Acceptance of Terms
          </h2>
          <p>
            By creating an account, browsing profiles, or using any services provided by SJC Matrimony, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            2. Eligibility Criteria
          </h2>
          <p>To register and maintain an active profile on SJC Matrimony, members must meet the following criteria:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Must be at least 18 years of age (or legal marriage age under applicable personal law).</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Must be seeking intentional, faith-centered matrimony within the Christian community.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Must provide authentic and accurate personal, educational, religious, and family information.</span>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            3. Profile Accuracy & Verification
          </h2>
          <p>
            Members are responsible for maintaining the accuracy of their profile information. SJC Matrimony reserves the right to request identity proofs or parish documentation and to suspend or remove profiles that contain misleading, inaccurate, or deceptive details.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            4. Code of Conduct & Respectful Interaction
          </h2>
          <p>
            SJC Matrimony is built on dignity, honor, and sacred respect. Members agree not to engage in harassment, commercial solicitation, abusive behavior, or improper communication. Violation of community standards will result in immediate profile termination.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            5. Subscriptions & Payment Terms
          </h2>
          <p>
            Subscription plans (Silver, Gold, Platinum) provide enhanced profile visibility and connection features. All payments are processed securely through authorized payment gateways. Subscription details and terms are clearly outlined during checkout.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            6. Termination & Account Removal
          </h2>
          <p>
            You may request deletion of your profile at any time. SJC Matrimony reserves the right to terminate accounts that violate our safety policies or community terms without prior notice.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginTop: '28px', marginBottom: '12px' }}>
            7. Contact Us
          </h2>
          <p>
            For questions or support regarding our Terms of Service, please reach out to <a href="mailto:support@sjcmatrimony.org" style={{ color: '#B88E4C', fontWeight: 600 }}>support@sjcmatrimony.org</a> or visit our <Link to="/contact" style={{ color: '#B88E4C', fontWeight: 600 }}>Contact Page</Link>.
          </p>

        </div>

      </div>
    </div>
  )
}
