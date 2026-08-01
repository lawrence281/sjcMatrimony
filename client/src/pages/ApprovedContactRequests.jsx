import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Phone, Mail, MessageSquare, Shield, CheckCircle2, Lock, X,
  Clock, ArrowRight, Loader2, Calendar, Church, Check, FileText, BadgeCheck, User, Send, MapPin, Building2
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ApprovedContactRequests() {
  const navigate = useNavigate()
  const [sentRequests, setSentRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)

  useEffect(() => {
    fetchSentRequests()
  }, [])

  const fetchSentRequests = async () => {
    setLoading(true)
    try {
      const res = await api.get('/contact-requests/my-requests')
      if (res.data && res.data.success) {
        const fetched = res.data.requests || []
        setSentRequests(fetched)
        if (fetched.length > 0) {
          setSelectedRequest(fetched[0])
        }
      }
    } catch (err) {
      console.error('Failed to load contact requests:', err)
      toast.error('Failed to load contact requests')
    } finally {
      setLoading(false)
    }
  }

  const currentReq = selectedRequest || sentRequests[0] || null
  const reqStatus = currentReq?.status || 'Pending'
  const isApproved = reqStatus === 'Approved'
  const targetMember = currentReq?.requestedProfile || {}
  const targetName = [targetMember.firstName, targetMember.lastName].filter(Boolean).join(' ') || 'Member Profile'

  return (
    <div style={{ background: '#F8FAF9', minHeight: '100vh', padding: '32px 24px 80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 700, color: '#1E2B45', margin: '0 0 4px 0' }}>
            My Requested Contacts
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
            Track the status of contact requests submitted to the Admin and view unlocked details upon approval.
          </p>
        </div>

        {loading ? (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px 24px', textAlign: 'center', border: '1px solid #EAE5DC' }}>
            <Loader2 size={36} color="#1E2B45" className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Loading contact requests...</p>
          </div>
        ) : sentRequests.length === 0 ? (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px 32px', textAlign: 'center', border: '1px solid #EAE5DC', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Send size={48} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>
              No Contact Requests Submitted
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, margin: '0 auto 24px auto', maxWidth: '440px' }}>
              You have not submitted any contact requests yet. Browse member profiles and click "Request Contact Info" to submit a request for Admin approval.
            </p>
            <Link
              to="/members"
              style={{
                background: '#1E2B45',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Browse Profiles</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '28px', alignItems: 'start' }}>

            {/* Left Column: List of Requests */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '24px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ padding: '8px 12px 14px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748B' }}>
                  Requested Profiles ({sentRequests.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sentRequests.map((req) => {
                  const isSel = currentReq?._id === req._id
                  const profile = req.requestedProfile || {}
                  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Member'
                  const isApp = req.status === 'Approved'
                  const isRej = req.status === 'Rejected' || req.status === 'Rejected by Admin' || req.status === 'Rejected by Member'

                  return (
                    <button
                      key={req._id}
                      onClick={() => setSelectedRequest(req)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '14px 16px',
                        borderRadius: '16px',
                        border: isSel ? '2px solid #1E2B45' : '1px solid #F1F5F9',
                        background: isSel ? '#F8FAF9' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px'
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: '#E2E8F0', flexShrink: 0, display: 'grid', placeItems: 'center' }}>
                        {profile.profileImage ? (
                          <img src={profile.profileImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User size={24} color="#94A3B8" />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1E2B45', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {profile.occupation || profile.denomination || 'Profile'}
                        </div>

                        {/* Status Badge */}
                        <div style={{ marginTop: '6px' }}>
                          {isApp ? (
                            <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          ) : isRej ? (
                            <span style={{ fontSize: '11px', background: '#FEE2E2', color: '#B91C1C', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <X size={12} /> Rejected
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#B45309', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> Pending Admin Approval
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Detailed Status & Contact Details */}
            {currentReq && (
              <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>

                {/* Profile Header Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid #F1F5F9', marginBottom: '24px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: '#E2E8F0', border: '3px solid #EAE5DC', flexShrink: 0 }}>
                    {targetMember.profileImage ? (
                      <img src={targetMember.profileImage} alt={targetName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#94A3B8' }}>
                        <User size={36} />
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1E2B45', margin: '0 0 6px 0' }}>
                      {targetName}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#64748B', fontSize: '13.5px' }}>
                      {targetMember.occupation && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={15} /> {targetMember.occupation}
                        </span>
                      )}
                      {targetMember.denomination && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Church size={15} /> {targetMember.denomination}
                        </span>
                      )}
                      {(targetMember.city || targetMember.state) && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={15} /> {[targetMember.city, targetMember.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Banners */}
                {isApproved ? (
                  <div>
                    <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '16px', padding: '16px 20px', color: '#047857', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={24} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>Request Approved by Admin!</div>
                        <div style={{ fontSize: '13px', opacity: 0.9 }}>Contact details have been unlocked. You can reach out directly via phone or email.</div>
                      </div>
                    </div>

                    {/* Unlocked Contact Details Grid */}
                    <div style={{ background: '#F8FAF9', borderRadius: '20px', border: '1px solid #EAE5DC', padding: '24px', marginBottom: '28px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', margin: '0 0 16px 0' }}>
                        Contact Information
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={14} color="#1E2B45" /> Mobile Number
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1E2B45' }}>
                            {targetMember.mobileNumber || 'Not provided'}
                          </div>
                        </div>

                        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={14} color="#1E2B45" /> Email Address
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1E2B45', wordBreak: 'break-all' }}>
                            {targetMember.email || 'Not provided'}
                          </div>
                        </div>

                        {targetMember.address && (
                          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={14} color="#1E2B45" /> Residential Address
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E2B45' }}>
                              {targetMember.address}
                            </div>
                          </div>
                        )}

                        {targetMember.churchAddress && (
                          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Church size={14} color="#1E2B45" /> Church / Parish Address
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E2B45' }}>
                              {targetMember.churchAddress}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Direct Action Buttons */}
                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {targetMember.mobileNumber && (
                          <a
                            href={`tel:${targetMember.mobileNumber}`}
                            style={{
                              background: '#1E2B45',
                              color: '#FFFFFF',
                              padding: '10px 20px',
                              borderRadius: '12px',
                              fontWeight: 700,
                              fontSize: '13.5px',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <Phone size={16} />
                            <span>Call {targetMember.firstName}</span>
                          </a>
                        )}

                        {targetMember.email && (
                          <a
                            href={`mailto:${targetMember.email}`}
                            style={{
                              background: '#FFFFFF',
                              color: '#1E2B45',
                              border: '1.5px solid #1E2B45',
                              padding: '10px 20px',
                              borderRadius: '12px',
                              fontWeight: 700,
                              fontSize: '13.5px',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <Mail size={16} />
                            <span>Send Email</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : reqStatus === 'Rejected' || reqStatus === 'Rejected by Admin' || reqStatus === 'Rejected by Member' ? (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '20px', color: '#B91C1C', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                      <X size={20} />
                      <span>Contact Request Rejected by Admin</span>
                    </div>
                    <p style={{ fontSize: '13.5px', margin: 0, opacity: 0.9, lineHeight: 1.5 }}>
                      {currentReq.adminRemarks || 'The parish administrator has rejected this contact request based on security or eligibility criteria.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '16px', padding: '20px', color: '#B45309', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                      <Clock size={20} />
                      <span>Pending Admin Approval</span>
                    </div>
                    <p style={{ fontSize: '13.5px', margin: 0, opacity: 0.9, lineHeight: 1.5 }}>
                      Your request has been submitted to the Admin for verification. Contact details will be unlocked once approved by the administrator.
                    </p>
                  </div>
                )}

                {/* Button to view full member profile */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    to={`/members/${targetMember._id}`}
                    style={{
                      background: '#1E2B45',
                      color: '#FFFFFF',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>View Member Profile</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
