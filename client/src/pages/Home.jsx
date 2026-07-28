import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Check, Sparkles, 
  ShieldCheck, Church, Lock, Users, Heart, Play, ArrowRight, BookOpen, 
  MapPin, MessageSquare, Loader2, Award, UserCheck, Shield, Clock, CheckCircle2
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Home({ scrollToSubscription }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Search Widget Form State
  const [seekingGender, setSeekingGender] = useState('Female')
  const [ageFrom, setAgeFrom] = useState(21)
  const [ageTo, setAgeTo] = useState(35)
  const [selectedDiocese, setSelectedDiocese] = useState('')

  // Dynamic Featured Members State
  const [featuredMembers, setFeaturedMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [requestStatuses, setRequestStatuses] = useState({})
  const [submittingId, setSubmittingId] = useState(null)

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    fetchFeaturedMembers()
    if (user) {
      fetchRequestStatuses()
    }
  }, [user])

  const fetchRequestStatuses = async () => {
    try {
      const res = await api.get('/contact-requests/my-statuses')
      if (res.data && res.data.success) {
        setRequestStatuses(res.data.statuses || {})
      }
    } catch (e) {
      console.error('Failed to fetch request statuses:', e)
    }
  }

  const handleSendContactRequest = async (e, member) => {
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    const memberId = member._id
    setSubmittingId(memberId)
    try {
      const res = await api.post(`/contact-requests/request/${memberId}`)
      if (res.data && res.data.success) {
        toast.success(res.data.message || `Contact request submitted for ${member.firstName}!`)
        setRequestStatuses(prev => ({ ...prev, [memberId]: 'Pending' }))
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit contact request.')
    } finally {
      setSubmittingId(null)
    }
  }

  const fetchFeaturedMembers = async () => {
    setLoadingMembers(true)
    try {
      const res = await api.get('/profile/browse?limit=4')
      if (res.data && res.data.success && res.data.profiles?.length > 0) {
        setFeaturedMembers(res.data.profiles)
      } else {
        setFeaturedMembers(fallbackMembers)
      }
    } catch (err) {
      console.error('Failed to fetch featured profiles:', err)
      setFeaturedMembers(fallbackMembers)
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = new URLSearchParams()
    if (seekingGender) query.set('gender', seekingGender)
    if (ageFrom) query.set('minAge', ageFrom)
    if (ageTo) query.set('maxAge', ageTo)
    if (selectedDiocese) query.set('diocese', selectedDiocese)
    navigate(`/browse?${query.toString()}`)
  }

  useEffect(() => {
    if (scrollToSubscription || window.location.hash === '#subscription') {
      const el = document.getElementById('subscription')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [scrollToSubscription])

  const fallbackMembers = [
    {
      _id: 'sample-1',
      firstName: 'Maria',
      age: 28,
      diocese: 'Archdiocese of Boston',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      quote: 'Seeking a partner to grow in Grace and build a family together.'
    },
    {
      _id: 'sample-2',
      firstName: 'Joseph',
      age: 31,
      diocese: 'Archdiocese of Chicago',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      quote: 'Dedicated to my parish and looking for my sacramental match.'
    },
    {
      _id: 'sample-3',
      firstName: 'Therese',
      age: 25,
      diocese: 'Diocese of Austin',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      quote: 'Lover of classical liturgy and seeking a wholesome Catholic life.'
    },
    {
      _id: 'sample-4',
      firstName: 'Francis',
      age: 29,
      diocese: 'Archdiocese of Seattle',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      quote: 'Active in youth ministry and seeking a true companion in faith.'
    }
  ]

  const faqs = [
    {
      q: 'How is member faith verified?',
      a: 'Each profile undergoes a thorough background check including identity documentation review and parish priest / church verification records before gaining full verified member status.'
    },
    {
      q: 'Is my privacy protected?',
      a: 'Yes. Contact details and full documents are securely guarded. Personal contact details are only unlocked after mutual request and administrator review for sacramental sincerity.'
    },
    {
      q: 'What are the membership costs?',
      a: 'Basic profile registration and profile browsing are completely free. Premium memberships offer enhanced messaging, priority search visibility, and direct contact unlocking.'
    }
  ]

  return (
    <div style={{ background: '#F8FAF9', fontFamily: "'Inter', sans-serif" }}>

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Clean Centered Layout)
         ───────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '520px',
        backgroundImage: `linear-gradient(180deg, rgba(30, 43, 69, 0.45) 0%, rgba(30, 43, 69, 0.7) 100%), url('https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 100px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', color: '#FFFFFF' }}>
          
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '56px',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Sacred Unions Blessed by Faith.
          </h1>

          <p style={{
            fontSize: '17px',
            lineHeight: 1.7,
            maxWidth: '640px',
            margin: '0 auto 36px auto',
            opacity: 0.95,
            fontWeight: 400,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}>
            Find your life partner within our trusted Catholic community, where marriage is a sacrament and commitment is forever.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link 
              to={user ? '/browse' : '/login'}
              style={{
                background: '#745A1C',
                color: '#FFFFFF',
                padding: '14px 36px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(116, 90, 28, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              Start Your Journey
            </Link>

            <button 
              onClick={() => navigate('/about')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Play size={16} fill="#FFFFFF" />
              <span>Watch Stories</span>
            </button>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          2. FEATURED PROFILES SECTION (Matching Image 2)
         ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              fontWeight: 700,
              color: '#1E2B45',
              margin: '0 0 6px 0'
            }}>
              Featured Profiles
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
              Faithful individuals seeking a sacramental union.
            </p>
          </div>

          <Link 
            to="/browse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1E2B45',
              textDecoration: 'none'
            }}
          >
            <span>View All</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMembers.map((member) => (
            <div 
              key={member._id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EAE5DC',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)'
              }}
            >
              {/* Photo Box with Premium Badge */}
              <div style={{ position: 'relative', height: '240px', background: '#F3F0E9' }}>
                <img 
                  src={member.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'} 
                  alt={member.firstName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#FEF3C7',
                  color: '#745A1C',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  ★ Premium
                </span>
              </div>

              {/* Profile Card Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, color: '#1E2B45', margin: '0 0 4px 0' }}>
                    {member.firstName}, {member.age || 26}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#64748B" />
                    <span>{member.diocese || 'Archdiocese of Boston'}</span>
                  </p>

                  <p style={{ fontSize: '13px', color: '#475467', fontStyle: 'italic', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                    "{member.quote || 'Seeking a partner to grow in Grace and build a family together.'}"
                  </p>
                </div>

                {/* Dynamic Contact Request CTA Button */}
                {(() => {
                  const status = requestStatuses[member._id] || 'None'
                  if (status === 'Approved') {
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/members/${member._id}`)
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '10px',
                          background: '#1E2B45',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 size={15} color="#059669" />
                        <span>View Full Profile</span>
                      </button>
                    )
                  }

                  if (status === 'Pending') {
                    return (
                      <button
                        disabled
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '10px',
                          background: '#FFFBEB',
                          border: '1px solid #FDE68A',
                          color: '#D97706',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Clock size={15} color="#D97706" />
                        <span>Request Pending</span>
                      </button>
                    )
                  }

                  return (
                    <button
                      onClick={(e) => handleSendContactRequest(e, member)}
                      disabled={submittingId === member._id}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        background: '#FFFFFF',
                        border: '1.5px solid #1E2B45',
                        color: '#1E2B45',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {submittingId === member._id ? (
                        <span>Sending Request...</span>
                      ) : (
                        <>
                          <Shield size={15} color="#1E2B45" />
                          <span>Request Contact Info</span>
                        </>
                      )}
                    </button>
                  )
                })()}
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          3. COMMUNITY COUNTER BANNER (Matching Image 2)
         ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', background: '#F0F4FA', borderTop: '1px solid #EAE5DC', borderBottom: '1px solid #EAE5DC', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#DCE7F7',
            color: '#1E2B45',
            padding: '6px 18px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <ShieldCheck size={16} />
            <span>Over 10,000+ Verified Unions</span>
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#1E2B45',
            margin: '0 0 12px 0'
          }}>
            Join Our Community Today
          </h2>

          <p style={{ fontSize: '15px', color: '#475467', lineHeight: 1.6, margin: '0 0 28px 0' }}>
            Creating a profile is simple and focused on what matters most: your faith, values, and desire for a Catholic marriage.
          </p>

          <Link
            to={user ? '/profile/edit' : '/login'}
            style={{
              background: '#1E2B45',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 4px 16px rgba(30, 43, 69, 0.2)'
            }}
          >
            Create Your Profile
          </Link>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          4. YOUR PATH TO A SACRED UNION (3-Step Timeline - Image 2)
         ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1140px', margin: '0 auto', textAlign: 'center' }}>
        
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '36px',
          fontWeight: 700,
          color: '#1E2B45',
          margin: '0 0 48px 0'
        }}>
          Your Path to a Sacred Union
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', position: 'relative' }} className="steps-grid">
          
          {/* Step 1 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#DCE7F7',
              color: '#1E2B45',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              <UserCheck size={28} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, color: '#1E2B45', marginBottom: '8px' }}>
              1. Register
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Complete your profile with details about your faith journey and parish life.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#DCE7F7',
              color: '#1E2B45',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Search size={28} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, color: '#1E2B45', marginBottom: '8px' }}>
              2. Search
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Use faith-based filters to find individuals who share your sacramental values.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#DCE7F7',
              color: '#1E2B45',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Heart size={28} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, color: '#1E2B45', marginBottom: '8px' }}>
              3. Connect
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Start sacred conversations and meet with the guidance of the Church community.
            </p>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          5. TESTIMONIAL SECTION ("A Connection Rooted in Prayer")
         ───────────────────────────────────────────────────────────── */}
      <section id="success-stories" style={{ background: '#1E2B45', color: '#FFFFFF', padding: '80px 24px' }}>
        <div className="success-story-grid">
          
          {/* Left: Wedding Photo Card */}
          <div style={{
            position: 'relative',
            height: '420px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(0,0,0,0.3)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80" 
              alt="Claire & David Wedding" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              background: 'rgba(30, 43, 69, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '12px 20px',
              borderRadius: '16px',
              color: '#FFFFFF'
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700 }}>
                Claire & David
              </div>
              <div style={{ fontSize: '12px', color: '#CBD5E1' }}>Married June 2023</div>
            </div>
          </div>

          {/* Right: Quote Content */}
          <div>
            <div style={{ fontSize: '48px', color: '#E2B96D', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>
              99
            </div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0 0 20px 0'
            }}>
              A Connection Rooted in Prayer
            </h2>

            <p style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#E2E8F0',
              fontStyle: 'italic',
              marginBottom: '32px'
            }}>
              "We both were skeptical about online dating, until we found Ave Maria. Knowing that everyone here shared our core Catholic values made the process so peaceful. We connected over our shared devotion to the Rosary and soon knew that God had brought us together."
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          6. BEYOND MATCHMAKING SECTION (Matching Reference Image)
         ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1140px', margin: '0 auto' }}>
        <div className="beyond-matchmaking-grid">
          
          {/* Left Content */}
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              fontWeight: 700,
              color: '#1E2B45',
              margin: '0 0 16px 0'
            }}>
              Beyond Matchmaking
            </h2>

            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: '0 0 32px 0' }}>
              For balance in the support of the local parish, our platform integrates with Catholic resources to ensure you're prepared for the vocation of marriage.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Feature 1 */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCE7F7', display: 'grid', placeItems: 'center', color: '#1E2B45', flexShrink: 0 }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1E2B45', margin: '0 0 4px 0' }}>
                    Canon Law Guidance
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                    Expert resources on Church teachings regarding marriage and family.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCE7F7', display: 'grid', placeItems: 'center', color: '#1E2B45', flexShrink: 0 }}>
                  <Church size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1E2B45', margin: '0 0 4px 0' }}>
                    Parish Networking
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                    Connect with members specifically within your local or surrounding dioceses.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCE7F7', display: 'grid', placeItems: 'center', color: '#1E2B45', flexShrink: 0 }}>
                  <Award size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1E2B45', margin: '0 0 4px 0' }}>
                    Pre-Cana Prep
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                    Exclusive workshops and spiritual retreats for engaged couples.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side Image & Floating Quote Box (Exact Match to User Reference Image) */}
          <div style={{ position: 'relative', marginTop: '12px' }}>
            <div style={{
              height: '400px',
              borderRadius: '36px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.1)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80" 
                alt="Parish Gathering"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Quote Card Overlay at Bottom-Left */}
            <div style={{
              position: 'absolute',
              bottom: '-14px',
              left: '-16px',
              background: '#FFFFFF',
              border: '1px solid #EAE5DC',
              borderRadius: '20px',
              padding: '18px 22px',
              maxWidth: '290px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              zIndex: 10
            }}>
              <p style={{ fontSize: '13.5px', color: '#1E2B45', fontWeight: 600, fontStyle: 'italic', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                "Building holy families is our primary mission."
              </p>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                — Fr. Richard Sullivan, Chaplain
              </span>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          7. FAQ ACCORDION SECTION (Matching Image 2)
         ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '840px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '36px',
          fontWeight: 700,
          color: '#1E2B45',
          textAlign: 'center',
          margin: '0 0 36px 0'
        }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div 
                key={idx}
                style={{
                  background: '#EAF0FA',
                  border: '1px solid #CBD5E1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1E2B45' }}>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={20} color="#1E2B45" /> : <ChevronDown size={20} color="#1E2B45" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 20px 24px', fontSize: '14px', color: '#475467', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          8. START YOUR JOURNEY TODAY CALLOUT (Matching Image 2)
         ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#EAF0FA', textAlign: 'center', borderTop: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '38px',
            fontWeight: 700,
            color: '#1E2B45',
            margin: '0 0 12px 0'
          }}>
            Start Your Journey Today
          </h2>

          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: '0 0 32px 0' }}>
            Your partner in faith and life is just a few steps away. Trust in the process, trust in the sacrament.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={user ? '/profile/edit' : '/login'}
              style={{
                background: '#745A1C',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(116, 90, 28, 0.3)'
              }}
            >
              Join Now
            </Link>

            <Link
              to="/about"
              style={{
                background: '#FFFFFF',
                color: '#1E2B45',
                border: '1px solid #CBD5E1',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Learn More
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}
