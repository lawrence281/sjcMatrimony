import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Phone, Mail, MessageSquare, Shield, CheckCircle2, Lock, X,
  Clock, ArrowRight, Loader2, Calendar, Church, Check, FileText, BadgeCheck, User, Inbox, Send
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ApprovedContactRequests() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('incoming') // 'incoming' | 'sent'
  
  // Sent requests state
  const [sentRequests, setSentRequests] = useState([])
  const [sentLoading, setSentLoading] = useState(true)
  const [selectedSentRequest, setSelectedSentRequest] = useState(null)

  // Incoming requests state
  const [incomingRequests, setIncomingRequests] = useState([])
  const [incomingLoading, setIncomingLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  useEffect(() => {
    fetchSentRequests()
    fetchIncomingRequests()
  }, [])

  const fetchSentRequests = async () => {
    setSentLoading(true)
    try {
      const res = await api.get('/contact-requests/my-requests')
      if (res.data && res.data.success) {
        const fetched = res.data.requests || []
        setSentRequests(fetched)
        if (fetched.length > 0) {
          setSelectedSentRequest(fetched[0])
        }
      }
    } catch (err) {
      console.error('Failed to load sent contact requests:', err)
    } finally {
      setSentLoading(false)
    }
  }

  const fetchIncomingRequests = async () => {
    setIncomingLoading(true)
    try {
      const res = await api.get('/contact-requests/incoming')
      if (res.data && res.data.success) {
        const fetched = res.data.requests || []
        setIncomingRequests(fetched)
      }
    } catch (err) {
      console.error('Failed to load incoming contact requests:', err)
    } finally {
      setIncomingLoading(false)
    }
  }

  const handleAcceptIncoming = async (requestId) => {
    setActionLoadingId(requestId)
    try {
      const res = await api.patch(`/contact-requests/incoming/${requestId}/accept`)
      if (res.data && res.data.success) {
        toast.success('Request accepted! Forwarded to Admin for verification.')
        setIncomingRequests(prev => prev.map(item => item._id === requestId ? { ...item, status: 'Pending Admin Verification' } : item))
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept request')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleRejectIncoming = async (requestId) => {
    setActionLoadingId(requestId)
    try {
      const res = await api.patch(`/contact-requests/incoming/${requestId}/reject`)
      if (res.data && res.data.success) {
        toast.success('Request rejected.')
        setIncomingRequests(prev => prev.map(item => item._id === requestId ? { ...item, status: 'Rejected by Member' } : item))
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject request')
    } finally {
      setActionLoadingId(null)
    }
  }

  const activeIncomingCount = incomingRequests.filter(r => r.status === 'Pending Member Review' || r.status === 'Pending').length
  const hasAlreadyAcceptedAny = incomingRequests.some(r => r.status === 'Pending Admin Verification' || r.status === 'Approved')

  const currentSentReq = selectedSentRequest || sentRequests[0] || null
  const sentReqStatus = currentSentReq?.status || 'Pending Member Review'
  const isSentApproved = sentReqStatus === 'Approved'
  const sentTargetMember = currentSentReq?.requestedProfile || {}
  const sentTargetName = [sentTargetMember.firstName, sentTargetMember.lastName].filter(Boolean).join(' ') || 'Member'

  return (
    <div style={{ background: '#F8FAF9', minHeight: '100vh', padding: '32px 24px 80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ─────────────────────────────────────────────────────────────
            HEADER & TOP NAVIGATION TABS (Incoming vs Sent)
           ───────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 700, color: '#1E2B45', margin: '0 0 4px 0' }}>
                Contact Requests
              </h1>
              <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                Manage incoming requests received from members & track requests you have sent.
              </p>
            </div>

            {/* Tab Switcher Buttons */}
            <div style={{ display: 'flex', background: '#E2E8F0', padding: '4px', borderRadius: '16px', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('incoming')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'incoming' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'incoming' ? '#1E2B45' : '#64748B',
                  fontWeight: activeTab === 'incoming' ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'incoming' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Inbox size={18} />
                <span>Incoming Requests</span>
                {activeIncomingCount > 0 && (
                  <span style={{ background: '#DC2626', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                    {activeIncomingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('sent')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'sent' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'sent' ? '#1E2B45' : '#64748B',
                  fontWeight: activeTab === 'sent' ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'sent' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={18} />
                <span>Sent Requests</span>
                {sentRequests.length > 0 && (
                  <span style={{ background: '#1E2B45', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                    {sentRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: INCOMING REQUESTS VIEW (User B view)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'incoming' && (
          <div>
            {incomingLoading ? (
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px 24px', textAlign: 'center', border: '1px solid #EAE5DC' }}>
                <Loader2 size={36} color="#1E2B45" className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Loading incoming contact requests...</p>
              </div>
            ) : incomingRequests.length === 0 ? (
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px 32px', textAlign: 'center', border: '1px solid #EAE5DC', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <Inbox size={48} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>
                  No Incoming Contact Requests
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, margin: 0, maxWidth: '440px', margin: '0 auto' }}>
                  You currently have no incoming contact requests from other members. When another member requests your contact details, it will appear here for your approval.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {incomingRequests.map((req) => {
                  const sender = req.senderDetails || {}
                  const isPending = req.status === 'Pending Member Review' || req.status === 'Pending'
                  const isAccepted = req.status === 'Pending Admin Verification' || req.status === 'Approved'
                  const isRejected = req.status === 'Rejected by Member'

                  return (
                    <div 
                      key={req._id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #EAE5DC',
                        borderRadius: '24px',
                        padding: '24px 28px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px'
                      }}
                    >
                      {/* Sender Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: '#F1F5F9',
                          border: '2px solid #EAE5DC',
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center'
                        }}>
                          {sender.profileImage ? (
                            <img src={sender.profileImage} alt={sender.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <User size={32} color="#94A3B8" />
                          )}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>
                              {sender.fullName || 'Member'}
                            </h3>
                            {sender.age && (
                              <span style={{ fontSize: '13px', background: '#F1F5F9', color: '#475467', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                                {sender.age} yrs
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', color: '#64748B', fontSize: '13.5px' }}>
                            {sender.occupation && sender.occupation !== 'Not specified' && (
                              <span>💼 {sender.occupation}</span>
                            )}
                            {sender.diocese && sender.diocese !== 'Not specified' && (
                              <span>⛪ {sender.diocese} Diocese</span>
                            )}
                            {(sender.city || sender.state) && (
                              <span>📍 {[sender.city, sender.state].filter(Boolean).join(', ')}</span>
                            )}
                          </div>

                          <p style={{ fontSize: '12px', color: '#94A3B8', margin: '6px 0 0 0' }}>
                            Received: {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons / Status Indicator */}
                      <div>
                        {isPending ? (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button
                              onClick={() => {
                                if (hasAlreadyAcceptedAny) {
                                  toast.error('You have already accepted another contact request.')
                                  return
                                }
                                handleRejectIncoming(req._id)
                              }}
                              disabled={actionLoadingId === req._id || hasAlreadyAcceptedAny}
                              title={hasAlreadyAcceptedAny ? 'You have already accepted another member request' : 'Reject Request'}
                              style={{
                                background: '#FFFFFF',
                                color: hasAlreadyAcceptedAny ? '#94A3B8' : '#DC2626',
                                border: `1.5px solid ${hasAlreadyAcceptedAny ? '#E2E8F0' : '#FCA5A5'}`,
                                borderRadius: '14px',
                                padding: '10px 20px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: hasAlreadyAcceptedAny ? 'not-allowed' : 'pointer',
                                opacity: hasAlreadyAcceptedAny ? 0.6 : 1,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Reject
                            </button>

                            <button
                              onClick={() => {
                                if (hasAlreadyAcceptedAny) {
                                  toast.error('You have already accepted another contact request.')
                                  return
                                }
                                handleAcceptIncoming(req._id)
                              }}
                              disabled={actionLoadingId === req._id || hasAlreadyAcceptedAny}
                              title={hasAlreadyAcceptedAny ? 'You have already accepted another member request' : 'Accept Request'}
                              style={{
                                background: hasAlreadyAcceptedAny ? '#94A3B8' : '#059669',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '14px',
                                padding: '10px 24px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: hasAlreadyAcceptedAny ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: hasAlreadyAcceptedAny ? 'none' : '0 2px 8px rgba(5, 150, 105, 0.25)',
                                opacity: hasAlreadyAcceptedAny ? 0.75 : 1,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {actionLoadingId === req._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Check size={16} strokeWidth={3} />
                              )}
                              <span>{hasAlreadyAcceptedAny ? 'Already Accepted Another' : 'Accept Request'}</span>
                            </button>
                          </div>
                        ) : req.status === 'Approved' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '8px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CheckCircle2 size={18} />
                              <span>Approved by Admin — Details Unlocked</span>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', background: '#F8FAF9', padding: '10px 16px', borderRadius: '12px', border: '1px solid #EAE5DC', fontSize: '13px' }}>
                              {sender.phone && (
                                <span style={{ fontWeight: 600, color: '#1E2B45', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Phone size={14} /> {sender.phone}
                                </span>
                              )}
                              {sender.email && (
                                <span style={{ fontWeight: 600, color: '#1E2B45', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Mail size={14} /> {sender.email}
                                </span>
                              )}
                            </div>

                            {sender.profileId && (
                              <Link
                                to={`/members/${sender.profileId}`}
                                style={{
                                  background: '#1E2B45',
                                  color: '#FFFFFF',
                                  padding: '8px 16px',
                                  borderRadius: '10px',
                                  fontSize: '12.5px',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <span>View Full Profile</span>
                                <ArrowRight size={14} />
                              </Link>
                            )}
                          </div>
                        ) : isAccepted ? (
                          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', padding: '10px 18px', borderRadius: '14px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={18} />
                            <span>Accepted — Awaiting Admin Verification</span>
                          </div>
                        ) : isRejected ? (
                          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 18px', borderRadius: '14px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <X size={18} />
                            <span>Rejected by You</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: SENT REQUESTS VIEW (User A view with 3-Step Journey)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'sent' && (
          <div>
            {sentLoading ? (
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px 24px', textAlign: 'center', border: '1px solid #EAE5DC' }}>
                <Loader2 size={36} color="#1E2B45" className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Loading sent contact requests...</p>
              </div>
            ) : sentRequests.length === 0 ? (
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px 32px', textAlign: 'center', border: '1px solid #EAE5DC', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <Send size={48} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>
                  No Sent Contact Requests
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px 0', maxWidth: '440px', margin: '0 auto 24px auto' }}>
                  You have not sent any contact requests yet. Browse member profiles to connect and request contact access.
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
            ) : (
              <div>
                {/* Request selection buttons if multiple sent requests exist */}
                {sentRequests.length > 1 && (
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
                    {sentRequests.map(req => (
                      <button
                        key={req._id}
                        onClick={() => setSelectedSentRequest(req)}
                        style={{
                          background: (selectedSentRequest?._id === req._id) ? '#1E2B45' : '#FFFFFF',
                          color: (selectedSentRequest?._id === req._id) ? '#FFFFFF' : '#1E2B45',
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

                {currentSentReq && (
                  <div>
                    {/* Top Banner */}
                    <div style={{
                      background: isSentApproved ? '#ECFDF5' : sentReqStatus === 'Rejected by Member' || sentReqStatus === 'Rejected by Admin' ? '#FEF2F2' : '#FFF8EB',
                      border: `1px solid ${isSentApproved ? '#A7F3D0' : sentReqStatus === 'Rejected by Member' || sentReqStatus === 'Rejected by Admin' ? '#FCA5A5' : '#FDE68A'}`,
                      borderRadius: '20px',
                      padding: '20px 24px',
                      marginBottom: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: isSentApproved ? '#D1FAE5' : sentReqStatus === 'Rejected by Member' || sentReqStatus === 'Rejected by Admin' ? '#FEE2E2' : '#FEEBC8',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0
                      }}>
                        <FileText size={22} color={isSentApproved ? '#059669' : sentReqStatus === 'Rejected by Member' || sentReqStatus === 'Rejected by Admin' ? '#DC2626' : '#B45309'} />
                      </div>
                      <div>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1E2B45', margin: '0 0 2px 0' }}>
                          Request Status: {sentReqStatus}
                        </h2>
                        <p style={{ fontSize: '13.5px', color: '#475467', margin: 0 }}>
                          {isSentApproved && 'Your contact request has been approved! Full profile & contact details unlocked below.'}
                          {(sentReqStatus === 'Pending Member Review' || sentReqStatus === 'Pending') && 'Awaiting member approval before forwarding to the Admin.'}
                          {sentReqStatus === 'Pending Admin Verification' && 'Member has accepted your request! Our administrative team is reviewing for final approval.'}
                          {sentReqStatus === 'Rejected by Member' && 'Request Rejected by Member. Workflow ended for this request.'}
                          {sentReqStatus === 'Rejected by Admin' && 'Request Rejected by Admin. Contact details remain restricted.'}
                        </p>
                      </div>
                    </div>

                    {/* Main Grid */}
                    <div className="approved-requests-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px' }}>
                      
                      {/* LEFT: Journey & Contact Info */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        
                        {/* 3 Step Journey */}
                        <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '24px', padding: '32px' }}>
                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: '#1E2B45', margin: '0 0 32px 0' }}>
                            Request Journey
                          </h3>

                          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {/* Line */}
                            <div style={{ position: 'absolute', top: '20px', left: '16.66%', right: '16.66%', height: '3px', zIndex: 1, display: 'flex' }}>
                              <div style={{ flex: 1, background: (sentReqStatus !== 'Pending Member Review' && sentReqStatus !== 'Pending') ? '#1E2B45' : '#E2E8F0' }} />
                              <div style={{ flex: 1, background: isSentApproved ? '#1E2B45' : '#E2E8F0' }} />
                            </div>

                            {/* Step 1 */}
                            <div style={{ textAlign: 'center', zIndex: 2 }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1E2B45', color: '#FFFFFF', display: 'grid', placeItems: 'center', margin: '0 auto 12px auto' }}>
                                <Check size={18} strokeWidth={3} />
                              </div>
                              <span style={{ fontSize: '11px', color: '#1E2B45', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Step 1</span>
                              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E2B45', margin: '0 0 2px 0' }}>Request Sent</h4>
                              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                {new Date(currentSentReq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>

                            {/* Step 2 */}
                            <div style={{ textAlign: 'center', zIndex: 2 }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: (sentReqStatus === 'Pending Member Review' || sentReqStatus === 'Pending') ? '#FFFBEB' : sentReqStatus === 'Rejected by Member' ? '#FEF2F2' : '#1E2B45',
                                color: (sentReqStatus === 'Pending Member Review' || sentReqStatus === 'Pending') ? '#D97706' : sentReqStatus === 'Rejected by Member' ? '#DC2626' : '#FFFFFF',
                                border: (sentReqStatus === 'Pending Member Review' || sentReqStatus === 'Pending') ? '2px solid #FDE68A' : sentReqStatus === 'Rejected by Member' ? '2px solid #FCA5A5' : 'none',
                                display: 'grid',
                                placeItems: 'center',
                                margin: '0 auto 12px auto'
                              }}>
                                {sentReqStatus === 'Rejected by Member' ? <X size={18} strokeWidth={3} /> : (sentReqStatus === 'Pending Member Review' || sentReqStatus === 'Pending') ? <Clock size={18} /> : <Check size={18} strokeWidth={3} />}
                              </div>
                              <span style={{ fontSize: '11px', color: '#1E2B45', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Step 2</span>
                              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E2B45', margin: '0 0 2px 0' }}>Member Review</h4>
                              <p style={{ fontSize: '12px', color: sentReqStatus === 'Rejected by Member' ? '#DC2626' : '#64748B', margin: 0, fontStyle: 'italic' }}>
                                {(sentReqStatus === 'Pending Member Review' || sentReqStatus === 'Pending') ? 'Awaiting Approval' : sentReqStatus === 'Rejected by Member' ? 'Rejected' : 'Accepted'}
                              </p>
                            </div>

                            {/* Step 3 */}
                            <div style={{ textAlign: 'center', zIndex: 2 }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: isSentApproved ? '#1E2B45' : sentReqStatus === 'Rejected by Admin' ? '#FEF2F2' : '#EAF0FA',
                                color: isSentApproved ? '#FFFFFF' : sentReqStatus === 'Rejected by Admin' ? '#DC2626' : '#94A3B8',
                                border: isSentApproved ? 'none' : sentReqStatus === 'Rejected by Admin' ? '2px solid #FCA5A5' : '1px solid #CBD5E1',
                                display: 'grid',
                                placeItems: 'center',
                                margin: '0 auto 12px auto'
                              }}>
                                {isSentApproved ? <Check size={18} strokeWidth={3} /> : sentReqStatus === 'Rejected by Admin' ? <X size={18} strokeWidth={3} /> : <Lock size={16} color="#94A3B8" />}
                              </div>
                              <span style={{ fontSize: '11px', color: isSentApproved ? '#1E2B45' : '#94A3B8', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Step 3</span>
                              <h4 style={{ fontSize: '14px', fontWeight: 700, color: isSentApproved ? '#1E2B45' : '#64748B', margin: '0 0 2px 0' }}>Admin Approval</h4>
                              <p style={{ fontSize: '12px', color: sentReqStatus === 'Rejected by Admin' ? '#DC2626' : '#94A3B8', margin: 0, fontStyle: 'italic' }}>
                                {isSentApproved ? 'Unlocked Access' : sentReqStatus === 'Rejected by Admin' ? 'Rejected' : 'Pending'}
                              </p>
                            </div>

                          </div>
                        </div>

                        {/* Contact Info Box */}
                        <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '24px', padding: '32px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>
                              Contact Information
                            </h3>
                            <span style={{ background: '#FFFFFF', color: '#64748B', border: '1px solid #CBD5E1', fontSize: '11px', fontWeight: 800, padding: '4px 14px', borderRadius: '14px' }}>
                              {isSentApproved ? 'UNLOCKED' : 'LOCKED'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', filter: isSentApproved ? 'none' : 'blur(5px)', opacity: isSentApproved ? 1 : 0.4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#F8FAF9', padding: '14px 18px', borderRadius: '14px' }}>
                              <Phone size={20} color="#1E2B45" />
                              <div>
                                <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 2px 0', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number</p>
                                <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>{sentTargetMember.mobileNumber || '+91 98765 43210'}</p>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#F8FAF9', padding: '14px 18px', borderRadius: '14px' }}>
                              <Mail size={20} color="#1E2B45" />
                              <div>
                                <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 2px 0', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</p>
                                <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>{sentTargetMember.email || 'member@example.com'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* RIGHT: Target Profile Summary Card */}
                      <div>
                        <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '24px', padding: '28px', textAlign: 'center', position: 'sticky', top: '96px' }}>
                          <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px auto', border: '3px solid #1E2B45', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                            {sentTargetMember.profileImage ? (
                              <img src={sentTargetMember.profileImage} alt={sentTargetName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: '#F1F5F9', display: 'grid', placeItems: 'center' }}>
                                <User size={48} color="#94A3B8" />
                              </div>
                            )}
                          </div>

                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1E2B45', margin: '0 0 4px 0' }}>
                            {sentTargetName}
                          </h3>
                          {sentTargetMember.age && (
                            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0', fontWeight: 600 }}>
                              {sentTargetMember.age} years old • {sentTargetMember.city || 'Location'}
                            </p>
                          )}

                          {sentTargetMember._id && (
                            <Link
                              to={`/members/${sentTargetMember._id}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#1E2B45',
                                color: '#FFFFFF',
                                padding: '10px 20px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontSize: '13.5px',
                                fontWeight: 600
                              }}
                            >
                              <span>View Full Profile</span>
                              <ArrowRight size={16} />
                            </Link>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
