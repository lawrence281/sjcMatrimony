import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Phone, Mail, MessageSquare, Shield, CheckCircle2, Lock, 
  Clock, ArrowRight, Loader2, Calendar, Church, Check, FileText, BadgeCheck
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ApprovedContactRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)

  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    fetchContactRequests()
  }, [])

  const fetchContactRequests = async () => {
    setLoading(true)
    try {
      const res = await api.get('/contact-requests/my-requests')
      if (res.data && res.data.success) {
        const fetched = res.data.requests || []
        setRequests(fetched)
        if (fetched.length > 0) {
          setSelectedRequest(fetched[0])
        }
      }
    } catch (err) {
      console.error('Failed to load contact requests:', err)
    } finally {
      setLoading(false)
      setHasFetched(true)
    }
  }

  // If fetched from API and no active/approved requests exist
  if (hasFetched && requests.length === 0) {
    return (
      <div style={{ background: '#F8FAF9', minHeight: '80vh', padding: '60px 24px', display: 'grid', placeItems: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '24px', padding: '48px 32px', textAlign: 'center', maxWidth: '480px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Shield size={48} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>
            No Active Contact Requests
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: '0 0 24px 0' }}>
            You do not have any pending or approved contact requests. Browse profiles to send a new request.
          </p>
          <Link 
            to="/browse"
            style={{
              background: '#1E2B45',
              color: '#FFFFFF',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              display: 'inline-block'
            }}
          >
            Browse Members
          </Link>
        </div>
      </div>
    )
  }

  // Demo fallback matching Reference Image 3 precisely if not yet connected to backend
  const demoRequest = selectedRequest || {
    _id: 'demo-req-1',
    status: 'Pending',
    createdAt: '2024-10-24T14:15:00.000Z',
    requestedProfile: {
      _id: 'demo-profile-1',
      firstName: 'Maria Rose',
      lastName: 'Fernandez',
      age: 26,
      occupation: 'Doctor',
      city: 'Kochi',
      state: 'Kerala',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      mobileNumber: '+91 98765 43210',
      email: 'maria.rose@example.com'
    }
  }

  const reqStatus = demoRequest.status || 'Pending'
  const isApproved = reqStatus === 'Approved'
  const targetMember = demoRequest.requestedProfile || {}
  const targetName = [targetMember.firstName, targetMember.lastName].filter(Boolean).join(' ') || 'Maria Rose Fernandez'

  return (
    <div style={{ background: '#F8FAF9', minHeight: '100vh', padding: '32px 24px 80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ─────────────────────────────────────────────────────────────
            1. TOP STATUS ALERT BANNER (Exact Match Image 3)
           ───────────────────────────────────────────────────────────── */}
        <div style={{
          background: '#FFF8EB',
          border: '1px solid #FDE68A',
          borderRadius: '20px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.04)'
        }}>
          {/* Yellow Clipboard Badge Icon */}
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: '#FEEBC8',
            display: 'grid',
            placeItems: 'center',
            color: '#B45309',
            flexShrink: 0
          }}>
            <FileText size={22} color="#B45309" />
          </div>

          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#1E2B45',
              margin: '0 0 2px 0',
              lineHeight: 1.15
            }}>
              {isApproved ? 'Request Status: Approved by Admin' : 'Request Status: Pending Admin Approval'}
            </h2>
            <p style={{ fontSize: '13.5px', color: '#475467', margin: 0, lineHeight: 1.4 }}>
              {isApproved 
                ? 'Your request has been approved! Contact details are unlocked below.' 
                : 'Your request was received on Oct 24, 2024. Our team is verifying the sacramental records.'}
            </p>
          </div>
        </div>


        {/* Request selector tabs if multiple requests exist */}
        {requests.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
            {requests.map(req => (
              <button
                key={req._id}
                onClick={() => setSelectedRequest(req)}
                style={{
                  background: (demoRequest._id === req._id) ? '#1E2B45' : '#FFFFFF',
                  color: (demoRequest._id === req._id) ? '#FFFFFF' : '#1E2B45',
                  border: '1px solid #CBD5E1',
                  borderRadius: '20px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {req.requestedProfile?.firstName || 'Request'} ({req.status})
              </button>
            ))}
          </div>
        )}


        {/* ─────────────────────────────────────────────────────────────
            2. MAIN 2-COLUMN LAYOUT (Exact Match Image 3)
           ───────────────────────────────────────────────────────────── */}
        <div className="approved-requests-grid">
          
          {/* LEFT COLUMN: Request Journey, Contact Information, Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Card 1: Request Journey Timeline */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EAE5DC',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '26px',
                fontWeight: 700,
                color: '#1E2B45',
                margin: '0 0 32px 0'
              }}>
                Request Journey
              </h3>

              {/* 3 Step Connected Progress Timeline */}
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                
                {/* Connecting Lines */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '16.66%',
                  right: '16.66%',
                  height: '3px',
                  zIndex: 1,
                  display: 'flex'
                }}>
                  <div style={{ flex: 1, background: '#1E2B45' }} />
                  <div style={{ flex: 1, background: isApproved ? '#1E2B45' : '#E2E8F0' }} />
                </div>

                {/* Step 1 */}
                <div style={{ textAlign: 'center', zIndex: 2 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#1E2B45',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: '0 2px 8px rgba(30,43,69,0.25)'
                  }}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#1E2B45', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                    Step 1
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E2B45', margin: '0 0 2px 0' }}>
                    Request Sent
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Oct 24, 2:15 PM
                  </p>
                </div>

                {/* Step 2 */}
                <div style={{ textAlign: 'center', zIndex: 2 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#1E2B45',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: '0 2px 8px rgba(30,43,69,0.25)'
                  }}>
                    <Shield size={18} fill="#FFFFFF" color="#FFFFFF" />
                  </div>
                  <span style={{ fontSize: '11px', color: '#1E2B45', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                    Step 2
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E2B45', margin: '0 0 2px 0' }}>
                    Verification
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontStyle: 'italic' }}>
                    {isApproved ? 'Completed' : 'In Progress...'}
                  </p>
                </div>

                {/* Step 3 */}
                <div style={{ textAlign: 'center', zIndex: 2 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isApproved ? '#1E2B45' : '#EAF0FA',
                    color: isApproved ? '#FFFFFF' : '#94A3B8',
                    border: isApproved ? 'none' : '1px solid #CBD5E1',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 12px auto'
                  }}>
                    {isApproved ? <Check size={18} strokeWidth={3} /> : <Lock size={16} color="#94A3B8" />}
                  </div>
                  <span style={{ fontSize: '11px', color: isApproved ? '#1E2B45' : '#94A3B8', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                    Step 3
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: isApproved ? '#1E2B45' : '#64748B', margin: '0 0 2px 0' }}>
                    Contact Unlocked
                  </h4>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, fontStyle: 'italic' }}>
                    {isApproved ? 'Unlocked Access' : 'Awaiting Approval'}
                  </p>
                </div>

              </div>
            </div>

            {/* Card 2: Contact Information with Blurred Overlay / Guarded Box */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EAE5DC',
              borderRadius: '24px',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#1E2B45',
                  margin: 0
                }}>
                  Contact Information
                </h3>

                <span style={{
                  background: '#FFFFFF',
                  color: '#64748B',
                  border: '1px solid #CBD5E1',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 14px',
                  borderRadius: '14px',
                  letterSpacing: '0.05em'
                }}>
                  {isApproved ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>

              {/* Contact Fields Box */}
              <div style={{ position: 'relative', paddingBottom: '16px' }}>
                
                {/* Background Details (Blurred if pending) */}
                <div style={{
                  filter: isApproved ? 'none' : 'blur(6px)',
                  userSelect: isApproved ? 'text' : 'none',
                  opacity: isApproved ? 1 : 0.35,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>FULL NAME</span>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E2B45', margin: '2px 0 0 0' }}>
                      {targetName}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>PRIMARY EMAIL</span>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E2B45', margin: '2px 0 0 0' }}>
                      {targetMember.email || 'maria.rose@example.com'}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>PHONE NUMBER</span>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E2B45', margin: '2px 0 0 0' }}>
                      {targetMember.mobileNumber || '+91 98765 43210'}
                    </p>
                  </div>
                </div>

                {/* Information Securely Guarded Modal Overlay (Exact Match Image 3) */}
                {!isApproved && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    zIndex: 10
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid #E2E8F0',
                      borderRadius: '24px',
                      padding: '28px 24px',
                      textAlign: 'center',
                      maxWidth: '340px',
                      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)'
                    }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#EAF0FA',
                        color: '#1E2B45',
                        display: 'grid',
                        placeItems: 'center',
                        margin: '0 auto 14px auto'
                      }}>
                        <BadgeCheck size={26} color="#1E2B45" />
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>
                        Information Securely Guarded
                      </h4>

                      <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                        Verified members can view full contact details once the parish administrator approves the request for sacramental sincerity.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons: Call, WhatsApp, Email (Exact Styling in Image 3) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
                
                <a
                  href={isApproved && targetMember.mobileNumber ? `tel:${targetMember.mobileNumber}` : '#'}
                  onClick={e => !isApproved && e.preventDefault()}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: isApproved ? '#1E2B45' : '#8A92A0',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: isApproved ? 'pointer' : 'not-allowed',
                    boxShadow: isApproved ? '0 2px 8px rgba(30,43,69,0.2)' : 'none'
                  }}
                >
                  <Phone size={16} fill="#FFFFFF" color="#FFFFFF" />
                  <span>Call</span>
                </a>

                <a
                  href={isApproved && targetMember.mobileNumber ? `https://wa.me/${targetMember.mobileNumber.replace(/\D/g,'')}` : '#'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => !isApproved && e.preventDefault()}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#F1F5F9',
                    color: isApproved ? '#1E2B45' : '#94A3B8',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: isApproved ? 'pointer' : 'not-allowed'
                  }}
                >
                  <MessageSquare size={16} color={isApproved ? '#1E2B45' : '#94A3B8'} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={isApproved && targetMember.email ? `mailto:${targetMember.email}` : '#'}
                  onClick={e => !isApproved && e.preventDefault()}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#F1F5F9',
                    color: isApproved ? '#1E2B45' : '#94A3B8',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: isApproved ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Mail size={16} color={isApproved ? '#1E2B45' : '#94A3B8'} />
                  <span>Email</span>
                </a>

              </div>
            </div>

            {/* Card 3: Sacramental Security & Data Privacy Box */}
            <div style={{
              background: '#EAF0FA',
              border: '1px solid #D0E0F7',
              borderRadius: '24px',
              padding: '28px',
              display: 'flex',
              gap: '16px'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#DCE7F7', display: 'grid', placeItems: 'center', color: '#1E2B45', flexShrink: 0 }}>
                <Shield size={20} color="#1E2B45" />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2B45', margin: '0 0 6px 0' }}>
                  Sacramental Security & Data Privacy
                </h4>
                <p style={{ fontSize: '13px', color: '#475467', lineHeight: 1.6, margin: 0 }}>
                  At Ave Maria Matrimony, we honor the sanctity of your identity. Contact details are never shared automatically. Each request is hand-reviewed by our moderators to ensure intent aligns with Holy Matrimony. Once approved, the connection is direct and confidential between both parties.
                </p>
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: Sidebar (Target Member Preview & Scripture Quote) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Target Member Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EAE5DC',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              {/* Photo Box with Premium Tag */}
              <div style={{ position: 'relative', height: '280px', background: '#F3F0E9' }}>
                <img 
                  src={targetMember.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'} 
                  alt={targetName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#FEF3C7',
                  color: '#745A1C',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  ☆ Premium
                </span>
              </div>

              {/* Member Summary */}
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: '#1E2B45', margin: '0 0 4px 0' }}>
                  {targetName}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 24px 0' }}>
                  {targetMember.age || 26} Years • {targetMember.occupation || 'Doctor'} • {[targetMember.city, targetMember.state].filter(Boolean).join(', ') || 'Kochi, Kerala'}
                </p>

                {/* Verification Attributes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748B' }}>ID Status</span>
                    <span style={{ fontWeight: 600, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={15} color="#1D4ED8" /> Verified
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748B' }}>Parish Status</span>
                    <span style={{ fontWeight: 600, color: '#745A1C', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Church size={15} color="#745A1C" /> Active
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748B' }}>Response Time</span>
                    <span style={{ fontWeight: 700, color: '#1E2B45' }}>Under 24h</span>
                  </div>
                </div>

                {/* View Full Profile Button */}
                <button
                  onClick={() => navigate(`/members/${targetMember._id || 'demo-profile-1'}`)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    color: '#1E2B45',
                    border: '1.5px solid #1E2B45',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  View Full Profile
                </button>

              </div>
            </div>

            {/* Scripture Quote Box */}
            <div style={{
              background: '#FFF8EB',
              border: '1px solid #FDE68A',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '17px',
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#78350F',
                margin: '0 0 6px 0',
                lineHeight: 1.5
              }}>
                "Be patient; the Lord works in His time."
              </p>
              <span style={{ fontSize: '12.5px', color: '#B45309', fontWeight: 600 }}>
                — Psalm 27:14
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
