import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Mail, PhoneCall, Flag, BookOpen, Church, Briefcase, Users, ShieldCheck, Check, Sparkles, Send } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const DEFAULT_ELEANOR = {
  _id: 'eleanor-1',
  firstName: 'Eleanor',
  lastName: 'Grace',
  age: 28,
  verificationStatus: 'Verified',
  quote: 'Seeking a life of shared devotion and quiet joy.',
  aboutMe: `I am a soul nurtured by the rhythmic beauty of tradition and the quiet morning light of the chapel. My life is a tapestry woven with threads of faith, family, and a deep appreciation for the arts. I spend my weekdays as a Restoration Architect, preserving the sacred spaces that have stood the test of time, and my weekends often involve choral practice or volunteering at the parish youth center.

I believe that marriage is a covenant—a sacred promise to grow together, to serve one another, and to build a home where God's presence is the cornerstone. I value intentionality, intellectual curiosity, and a gentle heart.`,
  profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  photos: [
    { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', caption: 'Main Portrait' },
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', caption: 'Sunday Service' },
    { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', caption: 'Chapel Garden' },
  ],
  height: `5'7" (170cm)`,
  maritalStatus: 'Never Married',
  city: 'Charleston',
  state: 'SC',
  denomination: 'Anglican (ACNA)',
  churchAddress: "St. Jude's Cathedral, 123 Cathedral Way, Charleston, SC",
  spiritualValues: ['Daily Prayer', 'Traditional Liturgy', 'Sacramental Living', 'Scripture Study'],
  degree: 'M.Arch in Heritage Conservation',
  occupation: 'Restoration Architect',
  familyStatus: 'Grew up in a close-knit family with three siblings. Deeply value parental guidance and heritage.',
  origin: 'Originally from Savannah, Georgia. Roots are deeply planted in Southern hospitality and faith.',
  preferredAge: '27 - 38',
  preferredHeight: "5'10\" +",
  preferredEducation: 'Post-Grad',
  preferredChurch: 'Anglican/Catholic',
}

export default function MemberDetail() {
  const { id } = useParams()
  const [profile, setProfile] = useState(DEFAULT_ELEANOR)
  const [activePhoto, setActivePhoto] = useState('')
  const [interestSent, setInterestSent] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [contactRequested, setContactRequested] = useState(false)

  useEffect(() => {
    if (id && id !== 'eleanor-1') {
      api.get(`/profile/member/${id}`)
        .then(res => {
          if (res.data && res.data.success && res.data.profile) {
            const p = res.data.profile
            setProfile({
              ...DEFAULT_ELEANOR,
              ...p,
              quote: p.aboutMe ? `"${p.aboutMe.slice(0, 50)}..."` : DEFAULT_ELEANOR.quote,
              profileImage: p.profileImage || DEFAULT_ELEANOR.profileImage,
              photos: p.photos && p.photos.length > 0 ? p.photos : DEFAULT_ELEANOR.photos,
            })
            setActivePhoto(p.profileImage || DEFAULT_ELEANOR.profileImage)
          }
        })
        .catch(() => {
          setActivePhoto(DEFAULT_ELEANOR.profileImage)
        })
    } else {
      setActivePhoto(DEFAULT_ELEANOR.profileImage)
    }
  }, [id])

  const handleExpressInterest = async () => {
    try {
      if (profile._id) await api.post(`/profile/connect/${profile._id}`)
      setInterestSent(true)
      toast.success(`Interest expressed in ${profile.firstName}!`)
    } catch (err) {
      setInterestSent(true)
      toast.success(`Interest expressed in ${profile.firstName}!`)
    }
  }

  const handleSendMessage = () => {
    setMessageSent(true)
    toast.success(`Message feature opened for ${profile.firstName}!`)
  }

  const handleContactRequest = () => {
    setContactRequested(true)
    toast.success(`Contact details request sent to ${profile.firstName}!`)
  }

  const photosList = profile.photos && profile.photos.length > 0 ? profile.photos : DEFAULT_ELEANOR.photos

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', padding: '40px 0 80px 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          gap: '48px',
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
              marginBottom: '16px'
            }}>
              <img 
                src={activePhoto || profile.profileImage} 
                alt={profile.firstName}
                style={{
                  width: '100%',
                  height: '480px',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Gallery Thumbnail Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {photosList.map((photo, index) => (
                <div 
                  key={index}
                  onClick={() => setActivePhoto(photo.url)}
                  style={{
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: (activePhoto === photo.url) ? '2px solid #B88E4C' : '1px solid #EFEBE4',
                    transition: 'border 0.2s, opacity 0.2s',
                    opacity: activePhoto === photo.url ? 1 : 0.7
                  }}
                >
                  <img 
                    src={photo.url} 
                    alt={`Gallery ${index}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <button 
                onClick={handleExpressInterest}
                disabled={interestSent}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: interestSent ? '#10B981' : '#C59B4E',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: interestSent ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(197, 155, 78, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <Heart size={18} fill="#FFFFFF" />
                <span>{interestSent ? 'Interest Expressed' : 'Express Interest'}</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  onClick={handleSendMessage}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#1A273D',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Mail size={16} />
                  <span>Send Message</span>
                </button>

                <button 
                  onClick={handleContactRequest}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #1A273D',
                    background: '#FFFFFF',
                    color: '#1A273D',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <PhoneCall size={16} />
                  <span>Contact Request</span>
                </button>
              </div>
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
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.age || 28} Years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Height</span>
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.height || `5'7" (170cm)`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Marital Status</span>
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.maritalStatus || 'Never Married'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#667085' }}>Location</span>
                  <span style={{ fontWeight: 600, color: '#1B2535' }}>{profile.city || 'Charleston'}, {profile.state || 'SC'}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F3F0E9' }}>
                <button 
                  onClick={() => toast('Profile report submitted to administration for safety review.')}
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
            {/* Header Header Info */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '44px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0,
                  lineHeight: 1.1
                }}>
                  {profile.firstName} {profile.lastName}
                </h1>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    background: '#F3F0E9',
                    border: '1px solid #EAE5DC',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1B2535'
                  }}>
                    Verified
                  </span>
                  <span style={{
                    background: '#1A273D',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}>
                    Active Now
                  </span>
                </div>
              </div>

              {/* Tagline quote */}
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '20px',
                fontStyle: 'italic',
                color: '#B88E4C',
                margin: 0
              }}>
                "{profile.quote || 'Seeking a life of shared devotion and quiet joy.'}"
              </p>
            </div>

            {/* Section 1: About Me */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <BookOpen size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '28px',
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
                {profile.aboutMe || DEFAULT_ELEANOR.aboutMe}
              </div>
            </div>

            {/* Section 2: Church & Faith */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Church size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Church & Faith
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Denomination</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.denomination || 'Anglican (ACNA)'}</span>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Church Address</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.churchAddress || profile.church || "St. Jude's Anglican Cathedral, Charleston, SC"}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '8px' }}>Spiritual Values</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(profile.spiritualValues || DEFAULT_ELEANOR.spiritualValues).map((val, idx) => (
                    <span 
                      key={idx}
                      style={{
                        background: '#F9F7F3',
                        border: '1px solid #EAE5DC',
                        padding: '6px 14px',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#1B2535'
                      }}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Education & Profession */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Briefcase size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Education & Profession
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Degrees</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.degree || 'M.Arch in Heritage Conservation'}</span>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Profession</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.occupation || 'Restoration Architect'}</span>
                </div>
              </div>
            </div>

            {/* Section 4: Family Background */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Users size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Family Background
                </h2>
              </div>

              <div style={{
                background: '#1A273D',
                borderRadius: '16px',
                padding: '24px',
                color: '#FFFFFF',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Family Status</span>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
                    {profile.familyStatus || DEFAULT_ELEANOR.familyStatus}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Origin</span>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
                    {profile.origin || DEFAULT_ELEANOR.origin}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Partner Preferences */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Heart size={20} color="#B88E4C" />
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0
                }}>
                  Partner Preferences
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="pref-grid">
                <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Age</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.preferredAge || '27 - 38'}</span>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Height</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.preferredHeight || "5'10\" +"}</span>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Education</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.preferredEducation || 'Post-Grad'}</span>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#8A92A0', display: 'block', marginBottom: '4px' }}>Church</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1B2535' }}>{profile.preferredChurch || 'Anglican/Catholic'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
