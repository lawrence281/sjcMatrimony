import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Check, Sparkles, ShieldCheck, Church, Lock, Users, HeartHandshake, ArrowRight, UserCheck, Loader2 } from 'lucide-react'
import api from '../services/api'

export default function Home({ scrollToSubscription }) {
  const navigate = useNavigate()

  const [featuredMembers, setFeaturedMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(true)

  useEffect(() => {
    fetchFeaturedMembers()
  }, [])

  const fetchFeaturedMembers = async () => {
    setLoadingMembers(true)
    try {
      const res = await api.get('/profile/browse?limit=4')
      if (res.data && res.data.success) {
        setFeaturedMembers(res.data.profiles || [])
      }
    } catch (err) {
      console.error('Failed to load featured members:', err)
      setFeaturedMembers([])
    } finally {
      setLoadingMembers(false)
    }
  }

  useEffect(() => {
    if (scrollToSubscription || window.location.hash === '#subscription') {
      const el = document.getElementById('subscription')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [scrollToSubscription])

  return (
    <div style={{ background: '#FAF8F5', fontFamily: "'Inter', sans-serif" }}>

      {/* HERO SECTION WITH FLOATING HEARTS ANIMATION */}
      <section style={{
        position: 'relative',
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(180deg, rgba(16, 25, 40, 0.5) 0%, rgba(16, 25, 40, 0.7) 100%), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 24px 100px 24px',
        overflow: 'hidden'
      }}>
        {/* Floating Flying Hearts Particles Container */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {[
            { left: '3%', size: 24, duration: 6.5, delay: 0, opacity: 0.8, color: '#F472B6' },
            { left: '7%', size: 16, duration: 8.2, delay: 1.8, opacity: 0.65, color: '#E2B96D' },
            { left: '11%', size: 28, duration: 7.0, delay: 3.2, opacity: 0.85, color: '#F43F5E' },
            { left: '15%', size: 20, duration: 9.1, delay: 0.5, opacity: 0.55, color: '#FCD34D' },
            { left: '19%', size: 30, duration: 6.2, delay: 2.5, opacity: 0.8, color: '#EC4899' },
            { left: '23%', size: 18, duration: 7.8, delay: 4.2, opacity: 0.7, color: '#E2B96D' },
            
            { right: '3%', size: 26, duration: 7.2, delay: 0.8, opacity: 0.8, color: '#EC4899' },
            { right: '7%', size: 18, duration: 8.6, delay: 2.2, opacity: 0.65, color: '#FCD34D' },
            { right: '11%', size: 32, duration: 6.4, delay: 3.6, opacity: 0.85, color: '#F43F5E' },
            { right: '15%', size: 22, duration: 9.4, delay: 1.2, opacity: 0.6, color: '#E2B96D' },
            { right: '19%', size: 16, duration: 7.6, delay: 4.8, opacity: 0.75, color: '#F472B6' },
            { right: '23%', size: 24, duration: 6.9, delay: 2.9, opacity: 0.7, color: '#FB7185' },
          ].map((p, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                bottom: '-40px',
                left: p.left,
                right: p.right,
                animation: `floatHeroHeart ${p.duration}s ease-in-out ${p.delay}s infinite`,
                opacity: p.opacity,
                filter: 'drop-shadow(0 2px 8px rgba(244, 63, 94, 0.45))',
                willChange: 'transform, opacity'
              }}
            >
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 24 24"
                fill={p.color}
                stroke="none"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', color: '#FFFFFF', position: 'relative', zIndex: 2 }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '6px 18px',
            borderRadius: '20px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#FBF6ED',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <Sparkles size={14} color="#C59B4E" fill="#C59B4E" />
            <span>SJC Matrimony Portal</span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '58px',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Sacred Catholic & Christian Unions.<br />Faithfully Found.
          </h1>

          <p style={{
            fontSize: '16px',
            lineHeight: 1.65,
            maxWidth: '700px',
            margin: '0 auto 40px auto',
            opacity: 0.95,
            fontWeight: 400,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}>
            SJC Matrimony provides a trusted, verified space for single Christians seeking intentional, faith-centered matrimony built on shared values and divine purpose.
          </p>

          {/* Explore Members CTA Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link 
              to="/browse"
              style={{
                background: 'linear-gradient(135deg, #C59B4E 0%, #E2B96D 100%)',
                color: '#FFFFFF',
                padding: '16px 36px',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(197, 155, 78, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <span>Explore Verified Members</span>
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </section>


      {/* SECTION 1: FEATURED VERIFIED MEMBERS (FETCHED FROM DB) */}
      <section style={{ padding: '80px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '38px',
              fontWeight: 700,
              color: '#1B2535',
              margin: 0
            }}>
              Verified Member Profiles
            </h2>
            <p style={{ fontSize: '14px', color: '#667085', margin: '6px 0 0 0' }}>
              Authentic profiles verified through parish background and identity checks.
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
              color: '#B88E4C',
              textDecoration: 'none'
            }}
          >
            <span>Browse All Members</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Matches Grid */}
        {loadingMembers ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={36} color="#B88E4C" className="animate-spin" />
          </div>
        ) : featuredMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEBE4' }}>
            <p style={{ color: '#667085', fontSize: '14px' }}>No verified member profiles available at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="home-matches-grid">
            {featuredMembers.map((member) => (
              <div 
                key={member._id}
                onClick={() => navigate(`/members/${member._id}`)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #EFEBE4',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease-in-out',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
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
                <div style={{ position: 'relative', height: '260px', background: '#F3F0E9' }}>
                  <img 
                    src={member.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'} 
                    alt={`${member.firstName} ${member.lastName}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                    }}
                  />
                  {member.denomination && (
                    <span style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: '#1A273D',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      {member.denomination}
                    </span>
                  )}
                </div>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                    {member.firstName} {member.lastName ? `${member.lastName.charAt(0)}.` : ''}, {member.age || '—'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#667085', margin: '4px 0 14px 0' }}>
                    {[member.city, member.state].filter(Boolean).join(', ') || 'Tamil Nadu, India'}
                  </p>
                  <button style={{
                    width: '100%',
                    padding: '9px',
                    borderRadius: '10px',
                    border: '1px solid #D6C7AF',
                    background: '#FFFFFF',
                    color: '#C59B4E',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* NEW REPLACEMENT SECTION 1: WHY CHOOSE SJC MATRIMONY */}
      <section style={{ background: '#1A273D', color: '#FFFFFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ width: '40px', height: '2px', background: '#C59B4E', margin: '0 auto 20px auto' }} />

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '40px',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '12px',
            color: '#FFFFFF'
          }}>
            Why Choose SJC Matrimony?
          </h2>

          <p style={{ fontSize: '15px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto 56px auto', lineHeight: 1.6 }}>
            Designed exclusively for single Christians who value spiritual commitment, authenticity, and lifelong matrimonial covenant.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="why-sjc-grid">
            
            {/* Feature 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px 24px',
              textAlign: 'left',
              transition: 'transform 0.25s, border-color 0.25s'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(197, 155, 78, 0.15)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '20px',
                color: '#C59B4E'
              }}>
                <UserCheck size={24} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: '#FFFFFF' }}>
                100% Verified Profiles
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Every profile undergoes rigorous identity and church background verification for a safe matrimonial experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px 24px',
              textAlign: 'left',
              transition: 'transform 0.25s, border-color 0.25s'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(197, 155, 78, 0.15)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '20px',
                color: '#C59B4E'
              }}>
                <Church size={24} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: '#FFFFFF' }}>
                Faith-Centered Values
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Built on Christian principles, connecting individuals with shared spiritual goals, traditions, and moral values.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px 24px',
              textAlign: 'left',
              transition: 'transform 0.25s, border-color 0.25s'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(197, 155, 78, 0.15)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '20px',
                color: '#C59B4E'
              }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: '#FFFFFF' }}>
                Strict Privacy Controls
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                You have full authority over your contact details, photo visibility, and document sharing settings.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px 24px',
              textAlign: 'left',
              transition: 'transform 0.25s, border-color 0.25s'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(197, 155, 78, 0.15)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '20px',
                color: '#C59B4E'
              }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: '#FFFFFF' }}>
                Tailored Matchmaking
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Filter matches precisely by denomination, diocese, church location, education, career, and lifestyle preferences.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* NEW REPLACEMENT SECTION 2: HOW IT WORKS */}
      <section style={{ padding: '80px 24px', maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '38px',
          fontWeight: 700,
          color: '#1B2535',
          margin: 0
        }}>
          How SJC Matrimony Works
        </h2>
        <p style={{ fontSize: '14px', color: '#667085', margin: '8px 0 52px 0' }}>
          Three simple steps to finding your lifelong partner in faith.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', position: 'relative' }} className="how-it-works-grid">
          
          {/* Step 1 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #EFEBE4',
            borderRadius: '20px',
            padding: '40px 28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#1A273D',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 700,
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 24px auto',
              boxShadow: '0 4px 14px rgba(26, 39, 61, 0.2)'
            }}>
              1
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginBottom: '12px' }}>
              Create Your Profile
            </h3>
            <p style={{ fontSize: '14px', color: '#667085', lineHeight: 1.6, margin: 0 }}>
              Register your profile with complete basic, education, career, and church details for verification.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #EFEBE4',
            borderRadius: '20px',
            padding: '40px 28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#C59B4E',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 700,
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 24px auto',
              boxShadow: '0 4px 14px rgba(197, 155, 78, 0.25)'
            }}>
              2
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginBottom: '12px' }}>
              Browse & Connect
            </h3>
            <p style={{ fontSize: '14px', color: '#667085', lineHeight: 1.6, margin: 0 }}>
              Explore compatible verified member profiles and send interest or connection requests seamlessly.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #EFEBE4',
            borderRadius: '20px',
            padding: '40px 28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#1A273D',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 700,
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 24px auto',
              boxShadow: '0 4px 14px rgba(26, 39, 61, 0.2)'
            }}>
              3
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', marginBottom: '12px' }}>
              Begin Sacred Union
            </h3>
            <p style={{ fontSize: '14px', color: '#667085', lineHeight: 1.6, margin: 0 }}>
              Commence meaningful family interactions guided by shared Christian faith and values.
            </p>
          </div>

        </div>
      </section>


      {/* SECTION 4: MEMBERSHIP TIERS / SUBSCRIPTION */}
      <section id="subscription" style={{ padding: '80px 24px', background: '#F8F6F0', borderTop: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', textAlign: 'center' }}>
          
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '38px',
            fontWeight: 700,
            color: '#1B2535',
            margin: 0
          }}>
            Subscription Plans
          </h2>
          <p style={{ fontSize: '14px', color: '#667085', margin: '8px 0 48px 0' }}>
            Select a membership plan tailored to your matrimonial search needs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'center' }} className="pricing-grid">
            
            {/* Plan 1: Free Tier */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EFEBE4',
              borderRadius: '20px',
              padding: '36px 28px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                Free Member
              </h3>
              <p style={{ fontSize: '12px', color: '#8A92A0', margin: '4px 0 20px 0' }}>Basic Profile Exploration</p>

              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1B2535', marginBottom: '24px' }}>
                Free
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Create verified profile
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Browse member profiles
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Express interest in candidates
                </li>
              </ul>

              <Link to="/login" style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #1B2535',
                color: '#1B2535',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                Get Started Free
              </Link>
            </div>

            {/* Plan 2: Silver / Gold Tier (Featured) */}
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #C59B4E',
              borderRadius: '20px',
              padding: '44px 28px 36px 28px',
              textAlign: 'left',
              position: 'relative',
              boxShadow: '0 12px 32px rgba(197, 155, 78, 0.15)'
            }}>
              <span style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#C59B4E',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Most Popular
              </span>

              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                Gold Membership
              </h3>
              <p style={{ fontSize: '12px', color: '#8A92A0', margin: '4px 0 20px 0' }}>Enhanced Connection Access</p>

              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1B2535', marginBottom: '24px' }}>
                ₹2,999 <span style={{ fontSize: '14px', fontWeight: 400, color: '#8A92A0' }}>/ 3 months</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1B2535', fontWeight: 600 }}>
                  <Check size={14} color="#C59B4E" /> Direct contact & messaging access
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Priority search placement
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> View verified contact details
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Advanced Church & Diocese filters
                </li>
              </ul>

              <Link to="/login" style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                background: '#C59B4E',
                color: '#FFFFFF',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(197, 155, 78, 0.3)'
              }}>
                Choose Plan
              </Link>
            </div>

            {/* Plan 3: Platinum / Assisted Tier */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EFEBE4',
              borderRadius: '20px',
              padding: '36px 28px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                Platinum Tier
              </h3>
              <p style={{ fontSize: '12px', color: '#8A92A0', margin: '4px 0 20px 0' }}>Personal Matchmaking Guidance</p>

              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1B2535', marginBottom: '24px' }}>
                ₹6,999 <span style={{ fontSize: '14px', fontWeight: 400, color: '#8A92A0' }}>/ 6 months</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> All Gold features included
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Dedicated relationship manager
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Direct parish background check
                </li>
              </ul>

              <Link to="/contact" style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #1B2535',
                color: '#1B2535',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                Contact Matchmaker
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

