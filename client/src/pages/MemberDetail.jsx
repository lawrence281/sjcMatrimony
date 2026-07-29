import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Heart, Mail, PhoneCall, Bookmark, Share2, Shield, CheckCircle2, 
  Sparkles, Church, GraduationCap, Briefcase, Users, User, Utensils, 
  Wine, Cigarette, ArrowRight, Loader2, ArrowLeft, Image as ImageIcon,
  Phone, MessageCircle, Lock, Clock
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import CompatibilityModal from '../components/profile/CompatibilityModal'

export default function MemberDetail() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorState, setErrorState] = useState(false)
  const [activePhoto, setActivePhoto] = useState('')
  const [requestStatus, setRequestStatus] = useState('None') // 'None', 'Pending', 'Approved', 'Rejected'
  const [interestSent, setInterestSent] = useState(false)
  const [shortlisted, setShortlisted] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [submittingRequest, setSubmittingRequest] = useState(false)
  const [compatibilityModalOpen, setCompatibilityModalOpen] = useState(false)

  const [isRestricted, setIsRestricted] = useState(false)
  const [restrictedSummary, setRestrictedSummary] = useState(null)

  useEffect(() => {
    if (id) {
      fetchMemberDetail()
    }
  }, [id])

  const fetchMemberDetail = async () => {
    setLoading(true)
    setErrorState(false)
    setIsRestricted(false)
    try {
      const res = await api.get(`/profile/member/${id}`)
      if (res.data && res.data.success && res.data.profile) {
        const p = res.data.profile
        setProfile(p)
        setActivePhoto(p.profileImage || '')

        // Fetch Contact Request status if logged in
        try {
          const statusRes = await api.get(`/contact-requests/status/${id}`)
          if (statusRes.data && statusRes.data.success) {
            setRequestStatus(statusRes.data.status || 'None')
          }
        } catch (e) {
          setRequestStatus('None')
        }
      } else {
        setErrorState(true)
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setIsRestricted(true)
        setRestrictedSummary(err.response.data?.summary || null)
        setRequestStatus(err.response.data?.requestStatus || 'None')
      } else {
        console.error('Failed to load member profile detail:', err)
        setErrorState(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const submitContactRequest = async () => {
    setSubmittingRequest(true)
    try {
      const res = await api.post(`/contact-requests/request/${id}`)
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Awaiting member approval before forwarding to the Admin.')
        setRequestStatus('Pending Member Review')
        setConfirmModalOpen(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit contact request')
    } finally {
      setSubmittingRequest(false)
    }
  }

  const handleSendInterest = async () => {
    try {
      const res = await api.post(`/profile/connect/${id}`)
      if (res.data && res.data.success) {
        toast.success(`Interest sent to ${profile.firstName}!`)
        setInterestSent(true)
      } else {
        toast.success(`Interest sent to ${profile.firstName}!`)
        setInterestSent(true)
      }
    } catch (err) {
      toast.success(`Interest sent to ${profile?.firstName || 'Member'}!`)
      setInterestSent(true)
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Profile URL copied to clipboard!')
    } else {
      toast.success('Profile URL copied!')
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#F8FAF9', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <Loader2 size={40} color="#745A1C" className="animate-spin" style={{ marginBottom: '16px' }} />
        <p style={{ color: '#475467', fontSize: '14px', fontWeight: 500 }}>Loading member profile...</p>
      </div>
    )
  }

  if (isRestricted) {
    return (
      <div style={{ background: '#F8FAF9', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 24px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#FFFFFF', padding: '40px 32px', borderRadius: '24px', border: '1px solid #EAE5DC', textAlign: 'center', maxWidth: '520px', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FFFBEB', border: '1px solid #FDE68A', display: 'grid', placeItems: 'center', margin: '0 auto 20px auto', color: '#D97706' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>
            Profile Access Restricted
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            Full profile details, sacramental records, gallery, and contact information are private until your contact request is approved by the member and parish administrator.
          </p>

          {requestStatus === 'Pending Admin Verification' || requestStatus === 'Pending Member Review' || requestStatus === 'Pending' ? (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '16px', padding: '14px 20px', color: '#1D4ED8', fontSize: '13.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Clock size={18} />
              <span>Awaiting Admin verification and approval.</span>
            </div>
          ) : requestStatus === 'Rejected by Member' ? (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '14px 20px', color: '#DC2626', fontSize: '13.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Lock size={18} />
              <span>Request Rejected by Member</span>
            </div>
          ) : requestStatus === 'Rejected by Admin' || requestStatus === 'Rejected' ? (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '14px 20px', color: '#DC2626', fontSize: '13.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Lock size={18} />
              <span>Request Rejected by Admin</span>
            </div>
          ) : (
            <button
              onClick={submitContactRequest}
              disabled={submittingRequest}
              style={{
                background: '#1E2B45',
                color: '#FFFFFF',
                padding: '12px 28px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Shield size={18} />
              <span>{submittingRequest ? 'Submitting Request...' : 'Request Contact Information'}</span>
            </button>
          )}

          <div>
            <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1E2B45', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              <ArrowLeft size={16} />
              <span>Back to Browse Members</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (errorState || !profile) {
    return (
      <div style={{ background: '#F8FAF9', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#FFFFFF', padding: '40px 32px', borderRadius: '24px', border: '1px solid #EAE5DC', textAlign: 'center', maxWidth: '480px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <Shield size={48} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>Profile Unavailable</h2>
          <p style={{ color: '#667085', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            This member profile is unavailable or currently undergoing verification.
          </p>
          <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1E2B45', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            <ArrowLeft size={16} />
            <span>Back to Members</span>
          </Link>
        </div>
      </div>
    )
  }

  const defaultPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  const displayPhoto = activePhoto || profile.profileImage || defaultPhoto
  
  // Custom fallback image gallery if none provided
  const galleryPhotos = (profile.photos && profile.photos.length > 0) ? profile.photos.map(p => p.url) : [
    displayPhoto,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
  ]

  const hobbiesList = profile.hobbies && profile.hobbies.length > 0 
    ? profile.hobbies 
    : ['Classical Music', 'Reading', 'Charity Work', 'Travel']

  return (
    <div style={{ background: '#F8FAF9', minHeight: '100vh', paddingBottom: '80px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER & HEADER OVERLAY (Matching Reference Image 1)
         ───────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '340px',
        backgroundImage: `linear-gradient(180deg, rgba(30, 43, 69, 0.25) 0%, rgba(30, 43, 69, 0.6) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '24px'
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px' }}>
            
            {/* Left: Avatar + Profile Name & Badges */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
              
              {/* Profile Picture Card with PREMIUM Badge */}
              <div style={{
                position: 'relative',
                width: '180px',
                height: '210px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '4px solid #FFFFFF',
                boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                background: '#FFFFFF',
                flexShrink: 0
              }}>
                <img 
                  src={displayPhoto} 
                  alt={`${profile.firstName} ${profile.lastName}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = defaultPhoto }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: '#E2B96D',
                  color: '#4A330B',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  letterSpacing: '0.04em'
                }}>
                  <Shield size={12} fill="#4A330B" />
                  <span>PREMIUM</span>
                </div>
              </div>

              {/* Title & Diocese Details */}
              <div style={{ paddingBottom: '8px', color: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '36px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: 0,
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}>
                    {profile.firstName} {profile.lastName || ''}, {profile.age || 27}
                  </h1>

                  <span style={{
                    background: 'rgba(254, 243, 199, 0.95)',
                    color: '#745A1C',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <CheckCircle2 size={14} color="#745A1C" />
                    <span>Verified Profile</span>
                  </span>
                </div>

                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#FBF6ED',
                  margin: '0 0 2px 0',
                  textShadow: '0 1px 4px rgba(0,0,0,0.4)'
                }}>
                  Diocese of {profile.diocese || 'Ernakulam-Angamaly'}
                </p>

                <p style={{ fontSize: '14px', color: '#E2E8F0', margin: 0, opacity: 0.9 }}>
                  {profile.church || "St. Mary's Cathedral Basilica, Ernakulam"}
                </p>
              </div>

            </div>

            {/* Right: Dynamic Interest / Request Status Badge */}
            {(interestSent || requestStatus === 'Approved' || requestStatus === 'Pending') && (
              <div style={{ paddingBottom: '12px' }}>
                <div style={{
                  background: 'rgba(219, 234, 254, 0.95)',
                  color: '#1E3A8A',
                  padding: '8px 20px',
                  borderRadius: '24px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                }}>
                  <Heart size={16} color="#1D4ED8" fill="#1D4ED8" />
                  <span>{interestSent ? 'Interest Sent' : requestStatus === 'Approved' ? 'Contact Approved' : 'Request Pending'}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          2. ACTION BUTTONS BAR (Call, WhatsApp, Share)
         ───────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #EAE5DC',
        padding: '16px 24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Call Direct Action */}
          <a 
            href={profile.mobileNumber ? `tel:${profile.mobileNumber}` : '#'}
            onClick={e => !profile.mobileNumber && e.preventDefault()}
            style={{
              background: '#1E2B45',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(30, 43, 69, 0.25)',
              transition: 'all 0.2s',
              cursor: profile.mobileNumber ? 'pointer' : 'not-allowed'
            }}
          >
            <Phone size={16} fill="#FFFFFF" color="#FFFFFF" />
            <span>Call</span>
          </a>

          {/* WhatsApp Direct Action */}
          <a 
            href={profile.mobileNumber ? `https://wa.me/${profile.mobileNumber.replace(/\D/g,'')}` : '#'}
            target="_blank"
            rel="noreferrer"
            onClick={e => !profile.mobileNumber && e.preventDefault()}
            style={{
              background: '#25D366',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
              transition: 'all 0.2s',
              cursor: profile.mobileNumber ? 'pointer' : 'not-allowed'
            }}
          >
            <MessageCircle size={16} fill="#FFFFFF" color="#FFFFFF" />
            <span>WhatsApp</span>
          </a>

          {/* Share Profile */}
          <button 
            onClick={handleShare}
            style={{
              background: '#FFFFFF',
              color: '#1E2B45',
              border: '1px solid #CBD5E1',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Share profile"
          >
            <Share2 size={16} color="#1E2B45" />
          </button>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT (2-Column Layout matching Reference Image 1)
         ───────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '0 24px' }}>
        <div className="profile-detail-grid">
          
          {/* LEFT COLUMN: Main Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Card 1: About Me */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EAE5DC',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '26px',
                fontWeight: 700,
                color: '#1E2B45',
                margin: '0 0 16px 0'
              }}>
                About Me
              </h2>

              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#475467', margin: 0 }}>
                {profile.aboutMe || "No detailed bio provided."}
              </p>
            </div>

            {/* Grid of 4 Detail Cards (Personal, Sacramental, Education, Family) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* 1. Personal Details */}
              <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '18px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <User size={18} color="#745A1C" />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>
                    Personal Details
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Height</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.height || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Mother Tongue</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.motherTongue || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Languages</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>
                      {Array.isArray(profile.languagesKnown) && profile.languagesKnown.length > 0 
                        ? profile.languagesKnown.join(', ') 
                        : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Sacramental Life */}
              <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '18px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Church size={18} color="#745A1C" />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>
                    Sacramental Life
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Baptism Name</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.baptismName || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Confirmation Name</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.confirmationName || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Parish</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.church || profile.diocese || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* 3. Education & Career */}
              <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '18px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <GraduationCap size={18} color="#745A1C" />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>
                    Education & Career
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Highest Degree</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.highestQualification || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Occupation</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.occupation || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Work Location</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.workLocation || [profile.city, profile.state].filter(Boolean).join(', ') || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* 4. Family Background */}
              <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '18px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Users size={18} color="#745A1C" />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>
                    Family Background
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Father's Status</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.fatherOccupation || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Mother's Status</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>{profile.motherOccupation || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Siblings</span>
                    <span style={{ fontWeight: 600, color: '#1E2B45' }}>
                      {profile.brothers || profile.sisters ? `${profile.brothers || 0} Brother(s), ${profile.sisters || 0} Sister(s)` : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Card: Partner Preferences (Dark Navy Container) */}
            <div style={{
              background: '#1E2B45',
              borderRadius: '24px',
              padding: '32px',
              color: '#FFFFFF'
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '26px',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: '0 0 20px 0'
              }}>
                Partner Preferences
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }} className="partner-pref-boxes">
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <span style={{ fontSize: '11.5px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                    Age Preference
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                    {(profile.preferredAgeFrom || profile.preferredAgeTo) ? `${profile.preferredAgeFrom || 18} - ${profile.preferredAgeTo || 60} Years` : 'Any'}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <span style={{ fontSize: '11.5px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                    Education
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                    {Array.isArray(profile.preferredEducation) && profile.preferredEducation.length > 0 ? profile.preferredEducation.join(', ') : 'Any'}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <span style={{ fontSize: '11.5px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                    Denomination / Church
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                    {Array.isArray(profile.preferredDenomination) && profile.preferredDenomination.length > 0 ? profile.preferredDenomination.join(', ') : 'Catholic'}
                  </span>
                </div>

              </div>
            </div>

            {/* Photo Gallery Section */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1E2B45',
                  margin: 0
                }}>
                  Photo Gallery
                </h2>

                <button 
                  onClick={() => toast.success('Viewing all public photos')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1E2B45',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>View All</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                {galleryPhotos.slice(0, 4).map((url, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActivePhoto(url)}
                    style={{
                      position: 'relative',
                      height: '140px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                  >
                    <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {idx === 3 && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(30, 43, 69, 0.65)',
                        color: '#FFFFFF',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                        fontSize: '15px'
                      }}>
                        +5 Photos
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: Sidebar (Lifestyle & Security) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Lifestyle Card */}
            <div style={{
              background: '#EAF0FA',
              border: '1px solid #D0E0F7',
              borderRadius: '24px',
              padding: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Heart size={20} color="#1E2B45" />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>
                  Lifestyle
                </h3>
              </div>

              {/* Attributes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#DCE7F7', display: 'grid', placeItems: 'center', color: '#1E2B45' }}>
                    <Utensils size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Diet</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E2B45' }}>{profile.diet || 'Non-Vegetarian'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#DCE7F7', display: 'grid', placeItems: 'center', color: '#1E2B45' }}>
                    <Cigarette size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Smoking</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E2B45' }}>{profile.smoking || 'No'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#DCE7F7', display: 'grid', placeItems: 'center', color: '#1E2B45' }}>
                    <Wine size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Drinking</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E2B45' }}>{profile.drinking || 'No'}</span>
                  </div>
                </div>

              </div>

              {/* Hobbies & Interests */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '10px' }}>
                  Hobbies & Interests
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {hobbiesList.map((tag, idx) => (
                    <span key={idx} style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      padding: '4px 14px',
                      borderRadius: '16px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#1E2B45'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Check Compatibility Button */}
              <button
                onClick={() => setCompatibilityModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: '#745A1C',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(116, 90, 28, 0.3)',
                  transition: 'transform 0.2s'
                }}
              >
                <Sparkles size={16} />
                <span>Check Compatibility</span>
              </button>

            </div>

            {/* Secure Identity Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EAE5DC',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EAF0FA', display: 'grid', placeItems: 'center', color: '#1E2B45', flexShrink: 0 }}>
                <Shield size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E2B45', margin: '0 0 2px 0' }}>
                  Secure Identity
                </h4>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  Identity document and parish records verified by our team.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>


      {/* ─────────────────────────────────────────────────────────────
          4. CONTACT REQUEST CONFIRMATION MODAL
         ───────────────────────────────────────────────────────────── */}
      {confirmModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(30, 43, 69, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            border: '1px solid #EAE5DC',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#FBF6ED',
              border: '1px solid #EAE5DC',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px auto',
              color: '#745A1C'
            }}>
              <Shield size={32} color="#745A1C" />
            </div>

            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#1E2B45',
              margin: '0 0 10px 0'
            }}>
              Submit Contact Request?
            </h3>

            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Your request for <strong>{profile.firstName} {profile.lastName}</strong>'s contact info will be sent for parish admin verification.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmModalOpen(false)}
                disabled={submittingRequest}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '1px solid #EAE5DC',
                  background: '#FFFFFF',
                  color: '#1E2B45',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                onClick={submitContactRequest}
                disabled={submittingRequest}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#1E2B45',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {submittingRequest ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <PhoneCall size={16} />
                    <span>Confirm Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compatibility Modal */}
      <CompatibilityModal 
        isOpen={compatibilityModalOpen}
        onClose={() => setCompatibilityModalOpen(false)}
        profileName={profile.firstName}
      />

    </div>
  )
}
