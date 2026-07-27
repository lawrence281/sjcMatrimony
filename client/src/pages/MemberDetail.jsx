import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Mail, PhoneCall, Flag, BookOpen, Church, Briefcase, Users, ShieldCheck, Check, Sparkles, Send, MapPin, GraduationCap, UserCheck, Calendar, ArrowLeft, Loader2, Award, Home as HomeIcon } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function MemberDetail() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorState, setErrorState] = useState(false)
  const [activePhoto, setActivePhoto] = useState('')
  const [interestSent, setInterestSent] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [contactRequested, setContactRequested] = useState(false)

  useEffect(() => {
    if (id) {
      fetchMemberDetail()
    }
  }, [id])

  const fetchMemberDetail = async () => {
    setLoading(true)
    setErrorState(false)
    try {
      const res = await api.get(`/profile/member/${id}`)
      if (res.data && res.data.success && res.data.profile) {
        const p = res.data.profile
        setProfile(p)
        setActivePhoto(p.profileImage || '')
      } else {
        setErrorState(true)
      }
    } catch (err) {
      console.error('Failed to load member profile detail:', err)
      setErrorState(true)
    } finally {
      setLoading(false)
    }
  }

  const handleContactRequest = () => {
    setContactRequested(true)
    toast.success(`Contact details request sent to ${profile?.firstName || 'Member'}!`)
  }

  if (loading) {
    return (
      <div style={{ background: '#FAF8F5', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <Loader2 size={40} color="#B88E4C" className="animate-spin" style={{ marginBottom: '16px' }} />
        <p style={{ color: '#667085', fontSize: '14px', fontWeight: 500 }}>Loading member profile details...</p>
      </div>
    )
  }

  if (errorState || !profile) {
    return (
      <div style={{ background: '#FAF8F5', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: '1px solid #EFEBE4', textAlign: 'center', maxWidth: '480px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <ShieldCheck size={48} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: '#1B2535', margin: '0 0 8px 0' }}>Profile Unavailable</h2>
          <p style={{ color: '#667085', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            This member profile is either not available, currently undergoing verification, or has been updated.
          </p>
          <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1A273D', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            <ArrowLeft size={16} />
            <span>Back to Members</span>
          </Link>
        </div>
      </div>
    )
  }

  const defaultPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  const displayPhoto = activePhoto || profile.profileImage || defaultPhoto
  const photosList = profile.photos && profile.photos.length > 0 ? profile.photos : []
  const locationText = [profile.city, profile.district, profile.state, profile.country].filter(Boolean).join(', ') || 'Not Specified'

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', padding: '32px 0 80px 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>

        {/* Back navigation link */}
        <div style={{ marginBottom: '20px' }}>
          <Link 
            to="/browse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#8A92A0',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.color = '#B88E4C'}
            onMouseOut={e => e.currentTarget.style.color = '#8A92A0'}
          >
            <ArrowLeft size={16} />
            <span>Back to Eligible Members</span>
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '40px',
          alignItems: 'start'
        }} className="profile-detail-grid">

          {/* LEFT COLUMN: PHOTOS & ACTIONS & QUICK OVERVIEW */}
          <div>
            {/* Main Portrait Image */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EFEBE4',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <img 
                src={displayPhoto} 
                alt={`${profile.firstName} ${profile.lastName}`}
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = defaultPhoto
                }}
              />
              {/* Main Photo Image */}
            </div>

            {/* Gallery Thumbnail Strip */}
            {photosList.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                marginBottom: '24px'
              }}>
                {photosList.map((photo, index) => (
                  <div 
                    key={index}
                    onClick={() => setActivePhoto(photo.url)}
                    style={{
                      height: '74px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: (displayPhoto === photo.url) ? '2px solid #B88E4C' : '1px solid #EFEBE4',
                      transition: 'border 0.2s, opacity 0.2s',
                      opacity: displayPhoto === photo.url ? 1 : 0.7
                    }}
                  >
                    <img 
                      src={photo.url} 
                      alt={`Gallery ${index}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = defaultPhoto }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Primary Action Button */}
            <div style={{ marginBottom: '32px' }}>
              <button 
                onClick={handleContactRequest}
                disabled={contactRequested}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: contactRequested ? '#059669' : '#1A273D',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: contactRequested ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(26, 39, 61, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                <PhoneCall size={18} />
                <span>{contactRequested ? 'Contact Request Sent' : 'Request Contact Info'}</span>
              </button>
            </div>

            {/* Quick Overview Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EFEBE4',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                fontWeight: 700,
                color: '#1B2535',
                marginBottom: '20px'
              }}>
                Quick Overview
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Age</span>
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.age ? `${profile.age} Years` : '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Gender</span>
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.gender || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Height</span>
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.height || '—'}</span>
                </div>
                {profile.weight && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#667085' }}>Weight</span>
                    <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.weight}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Marital Status</span>
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.maritalStatus || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Mother Tongue</span>
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.motherTongue || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Location</span>
                  <span style={{ fontWeight: 600, color: '#1B2535', textAlign: 'right' }}>{[profile.city, profile.state].filter(Boolean).join(', ') || '—'}</span>
                </div>
                {profile.nativePlace && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#667085' }}>Native Place</span>
                    <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.nativePlace}</span>
                  </div>
                )}
                {profile.profileFor && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#667085' }}>Profile For</span>
                    <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.profileFor}</span>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F3F0E9' }}>
                <button 
                  onClick={() => toast.success('Profile report submitted for administrative safety review.')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8A92A0',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Flag size={13} />
                  <span>Report Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MAIN PROFILE DETAILS */}
          <div>
            {/* Header Info */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '40px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0,
                  lineHeight: 1.1
                }}>
                  {profile.firstName} {profile.lastName}
                </h1>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profile.denomination && (
                    <span style={{
                      background: '#1A273D',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#FFFFFF'
                    }}>
                      {profile.denomination}
                    </span>
                  )}
                </div>
              </div>

              {/* Subheading location and profession */}
              <p style={{ fontSize: '15px', color: '#667085', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#B88E4C" />
                <span>{locationText}</span>
                {profile.occupation && (
                  <>
                    <span style={{ color: '#D6C7AF' }}>•</span>
                    <span>{profile.occupation}</span>
                  </>
                )}
              </p>
            </div>

            {/* Section 1: About Me */}
            <div style={{ marginBottom: '40px', background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <BookOpen size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  About Me
                </h2>
              </div>

              <div style={{
                fontSize: '15px',
                lineHeight: 1.8,
                color: '#475467',
                whiteSpace: 'pre-line'
              }}>
                {profile.aboutMe || 'No detailed description provided yet.'}
              </div>
            </div>

            {/* Section 2: Church & Faith Information */}
            <div style={{ marginBottom: '40px', background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Church size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Religious & Church Information
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Religion</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.religion || 'Christian'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Denomination</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.denomination || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Diocese</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.diocese || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Local Church Name</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.church || '—'}</span>
                </div>
              </div>

              {profile.churchAddress && (
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Church Address</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1B2535', lineHeight: 1.5 }}>{profile.churchAddress}</span>
                </div>
              )}

              {/* Sacraments & Church Activities */}
              <div>
                <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 600 }}>
                  Sacraments & Church Involvement
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{
                    background: profile.baptized ? '#ECFDF5' : '#F1F5F9',
                    color: profile.baptized ? '#047857' : '#64748B',
                    border: `1px solid ${profile.baptized ? '#A7F3D0' : '#E2E8F0'}`,
                    padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}>
                    {profile.baptized ? <Check size={14} /> : null} Baptized: {profile.baptized ? 'Yes' : 'No'}
                  </span>
                  <span style={{
                    background: profile.confirmed ? '#ECFDF5' : '#F1F5F9',
                    color: profile.confirmed ? '#047857' : '#64748B',
                    border: `1px solid ${profile.confirmed ? '#A7F3D0' : '#E2E8F0'}`,
                    padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}>
                    {profile.confirmed ? <Check size={14} /> : null} Confirmed: {profile.confirmed ? 'Yes' : 'No'}
                  </span>
                  <span style={{
                    background: profile.firstHolyCommunion ? '#ECFDF5' : '#F1F5F9',
                    color: profile.firstHolyCommunion ? '#047857' : '#64748B',
                    border: `1px solid ${profile.firstHolyCommunion ? '#A7F3D0' : '#E2E8F0'}`,
                    padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}>
                    {profile.firstHolyCommunion ? <Check size={14} /> : null} First Communion: {profile.firstHolyCommunion ? 'Yes' : 'No'}
                  </span>
                  <span style={{
                    background: profile.activeInChurch ? '#ECFDF5' : '#F1F5F9',
                    color: profile.activeInChurch ? '#047857' : '#64748B',
                    border: `1px solid ${profile.activeInChurch ? '#A7F3D0' : '#E2E8F0'}`,
                    padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}>
                    {profile.activeInChurch ? <Check size={14} /> : null} Active Parish Member: {profile.activeInChurch ? 'Yes' : 'No'}
                  </span>
                </div>
                {profile.churchMinistry && (
                  <p style={{ marginTop: '12px', fontSize: '13.5px', color: '#475467' }}>
                    <strong>Ministry Involvement:</strong> {profile.churchMinistry}
                  </p>
                )}
              </div>
            </div>

            {/* Section 3: Education & Career */}
            <div style={{ marginBottom: '40px', background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Briefcase size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Education & Profession
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Highest Qualification</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.highestQualification || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Degree & Specialization</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{[profile.degree, profile.specialization].filter(Boolean).join(' - ') || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>University / College</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{[profile.university, profile.college].filter(Boolean).join(' / ') || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Graduation Year</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.graduationYear || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Occupation / Designation</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{[profile.designation, profile.occupation].filter(Boolean).join(' - ') || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Company & Experience</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{[profile.company, profile.experience].filter(Boolean).join(' • ') || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Annual Income</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.annualIncome || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Work Location</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.workLocation || '—'}</span>
                </div>
              </div>

              {profile.additionalCertifications && (
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Additional Certifications</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1B2535' }}>{profile.additionalCertifications}</span>
                </div>
              )}
            </div>

            {/* Section 4: Personal & Lifestyle Attributes */}
            <div style={{ marginBottom: '40px', background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Award size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Personal & Lifestyle Attributes
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Complexion</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>{profile.complexion || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Body Type</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>{profile.bodyType || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Blood Group</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>{profile.bloodGroup || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Physical Status</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>{profile.physicalStatus || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Diet Habits</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>{profile.diet || '—'}</span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Smoking / Drinking</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>
                    {[profile.smoking ? `Smoking: ${profile.smoking}` : null, profile.drinking ? `Drinking: ${profile.drinking}` : null].filter(Boolean).join(' • ') || '—'}
                  </span>
                </div>
              </div>

              {profile.languagesKnown && profile.languagesKnown.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '8px' }}>Languages Known</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {profile.languagesKnown.map((lang, i) => (
                      <span key={i} style={{ background: '#F3F0E9', border: '1px solid #EAE5DC', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, color: '#1B2535' }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Family Details */}
            <div style={{ marginBottom: '40px', background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Users size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Family Details
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Father's Details</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>
                    {profile.fatherName || '—'} {profile.fatherOccupation ? `(${profile.fatherOccupation})` : ''}
                  </span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Mother's Details</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>
                    {profile.motherName || '—'} {profile.motherOccupation ? `(${profile.motherOccupation})` : ''}
                  </span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Family Type & Status</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>
                    {[profile.familyType, profile.familyStatus].filter(Boolean).join(' • ') || '—'}
                  </span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Family Values</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.familyValues || '—'}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Brothers</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>
                    {profile.brothers || 0} Brother(s) {profile.marriedBrothers ? `(${profile.marriedBrothers} Married)` : ''}
                  </span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Sisters</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>
                    {profile.sisters || 0} Sister(s) {profile.marriedSisters ? `(${profile.marriedSisters} Married)` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 6: Partner Preferences */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Heart size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Partner Preferences
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="pref-grid">
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Preferred Age</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>
                    {(profile.preferredAgeFrom || profile.preferredAgeTo) ? `${profile.preferredAgeFrom || 18} - ${profile.preferredAgeTo || 60} Yrs` : 'Open'}
                  </span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Preferred Height</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>
                    {(profile.preferredHeightFrom || profile.preferredHeightTo) ? `${profile.preferredHeightFrom || ''} to ${profile.preferredHeightTo || ''}` : 'Open'}
                  </span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Preferred Education</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>
                    {Array.isArray(profile.preferredEducation) && profile.preferredEducation.length > 0 ? profile.preferredEducation.join(', ') : 'Open'}
                  </span>
                </div>
                <div style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Preferred Denomination</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>
                    {Array.isArray(profile.preferredDenomination) && profile.preferredDenomination.length > 0 ? profile.preferredDenomination.join(', ') : 'Open'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
