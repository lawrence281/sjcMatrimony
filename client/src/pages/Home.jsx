import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Check, Sparkles, Send, MapPin, Heart, Shield, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const navigate = useNavigate()

  // Quick Search state
  const [searchDenomination, setSearchDenomination] = useState('All Churches')
  const [searchAge, setSearchAge] = useState('24 - 35')
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')

  const handleQuickSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchDenomination !== 'All Churches') params.append('denomination', searchDenomination)
    if (searchQuery) params.append('location', searchQuery)
    navigate(`/browse?${params.toString()}`)
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Thank you for subscribing to Grace & Covenant newsletter!')
      setEmail('')
    }
  }

  return (
    <div style={{ background: '#FAF8F5', fontFamily: "'Inter', sans-serif" }}>

      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(180deg, rgba(16, 25, 40, 0.45) 0%, rgba(16, 25, 40, 0.65) 100%), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 24px 120px 24px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', color: '#FFFFFF' }}>
          
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '56px',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Sacred Unions.<br />Faithfully Found.
          </h1>

          <p style={{
            fontSize: '16px',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 40px auto',
            opacity: 0.95,
            fontWeight: 400,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}>
            The premier community for Christian matrimony and intentional connections. Shared faith is the foundation of every lasting relationship.
          </p>

          {/* Quick Search Bar Overlaid */}
          <form 
            onSubmit={handleQuickSearch}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '12px',
              alignItems: 'center',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              maxWidth: '840px',
              margin: '0 auto'
            }}
            className="hero-search-bar"
          >
            {/* Denomination Select */}
            <div style={{ textAlign: 'left', padding: '0 8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#8A92A0', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Denomination
              </span>
              <select 
                value={searchDenomination}
                onChange={e => setSearchDenomination(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1B2535',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All Churches">All Churches</option>
                <option value="Catholic">Catholic</option>
                <option value="Orthodox">Orthodox</option>
                <option value="Protestant">Protestant</option>
                <option value="Anglican">Anglican</option>
              </select>
            </div>

            {/* Age Range Select */}
            <div style={{ textAlign: 'left', padding: '0 8px', borderLeft: '1px solid #EAE5DC' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#8A92A0', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Age
              </span>
              <select 
                value={searchAge}
                onChange={e => setSearchAge(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1B2535',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="20 - 30">20 - 30</option>
                <option value="24 - 35">24 - 35</option>
                <option value="30 - 45">30 - 45</option>
                <option value="40+">40+</option>
              </select>
            </div>

            {/* Location / Profession Input */}
            <div style={{ textAlign: 'left', padding: '0 8px', borderLeft: '1px solid #EAE5DC' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#8A92A0', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Location / Profession
              </span>
              <input 
                type="text"
                placeholder="Any Location"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1B2535',
                  outline: 'none'
                }}
              />
            </div>

            {/* Search Submit Button */}
            <button 
              type="submit"
              style={{
                background: '#C59B4E',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s, transform 0.2s',
                boxShadow: '0 4px 12px rgba(197, 155, 78, 0.3)'
              }}
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>

        </div>
      </section>


      {/* SECTION 1: GRACE-FILLED MATCHES */}
      <section style={{ padding: '80px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              fontWeight: 700,
              color: '#1B2535',
              margin: 0
            }}>
              Grace-Filled Matches
            </h2>
            <p style={{ fontSize: '14px', color: '#667085', margin: '4px 0 0 0' }}>
              Hand-selected profiles based on your faith, values, and location.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #EAE5DC',
                background: '#FFFFFF',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={20} color="#1B2535" />
            </button>
            <button 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #EAE5DC',
                background: '#FFFFFF',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={20} color="#1B2535" />
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="home-matches-grid">
          {[
            { id: 'clara', name: 'Clara, 28', location: 'Paris, France', tag: 'Catholic', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' },
            { id: 'samuel', name: 'Samuel, 32', location: 'London, UK', tag: 'Protestant', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
            { id: 'elena', name: 'Elena, 31', location: 'Milan, Italy', tag: 'Orthodox', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80' },
            { id: 'james', name: 'James, 29', location: 'New York, USA', tag: 'Baptist', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80' },
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(`/browse`)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EFEBE4',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ position: 'relative', height: '260px' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: '#1A273D',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  {item.tag}
                </span>
              </div>
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#667085', margin: '4px 0 12px 0' }}>
                  {item.location}
                </p>
                <button style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #D6C7AF',
                  background: '#FFFFFF',
                  color: '#C59B4E',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* SECTION 2: OUR COVENANT STORIES */}
      <section id="success-stories" style={{ background: '#1A273D', color: '#FFFFFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: '460px 1fr', gap: '64px', alignItems: 'center' }} className="covenant-stories-grid">
          
          {/* Couple Image with Double Gold Frame */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-12px',
              border: '1px solid #C59B4E',
              borderRadius: '20px',
              opacity: 0.6
            }} />
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80" 
                alt="Sarah & David"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          {/* Testimonial Quote */}
          <div>
            <div style={{ width: '40px', height: '2px', background: '#C59B4E', marginBottom: '24px' }} />

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '38px',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '24px'
            }}>
              Our Covenant Stories
            </h2>

            <blockquote style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              fontStyle: 'italic',
              lineHeight: 1.5,
              color: '#FBF6ED',
              margin: '0 0 24px 0',
              opacity: 0.95
            }}>
              "Finding a partner who truly understood my devotion to the church was my primary prayer. Grace & Covenant didn't just give me matches; it introduced me to my soul's mirror. We are now six months into our blessed marriage."
            </blockquote>

            <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', color: '#C59B4E', textTransform: 'uppercase', marginBottom: '32px' }}>
              — SARAH & DAVID, MARRIED OCTOBER 2023
            </p>

            <Link 
              to="/browse" 
              style={{
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                paddingBottom: '4px'
              }}
            >
              <span>READ MORE SUCCESS STORIES</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>


      {/* SECTION 3: UNITY IN FAITH */}
      <section id="denominations" style={{ padding: '80px 24px', maxWidth: '1160px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '36px',
          fontWeight: 700,
          color: '#1B2535',
          margin: 0
        }}>
          Unity in Faith
        </h2>
        <p style={{ fontSize: '14px', color: '#667085', margin: '8px 0 40px 0' }}>
          Connecting believers across diverse Christian traditions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }} className="denominations-grid">
          {[
            { title: 'Catholic', icon: '⛪' },
            { title: 'Orthodox', icon: '☦️' },
            { title: 'Protestant', icon: '✨' },
            { title: 'Anglican', icon: '🏛️' },
            { title: 'Baptist', icon: '✝️' },
            { title: 'All Christian', icon: '🕊️' },
          ].map((denom, i) => (
            <div 
              key={i}
              onClick={() => navigate(`/browse?denomination=${encodeURIComponent(denom.title)}`)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EFEBE4',
                borderRadius: '16px',
                padding: '24px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = '#C59B4E'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = '#EFEBE4'
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{denom.icon}</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1B2535' }}>{denom.title}</span>
            </div>
          ))}
        </div>
      </section>


      {/* SECTION 4: MEMBERSHIP TIERS */}
      <section style={{ padding: '80px 24px', background: '#F8F6F0', borderTop: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', textAlign: 'center' }}>
          
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#1B2535',
            margin: 0
          }}>
            Membership Tiers
          </h2>
          <p style={{ fontSize: '14px', color: '#667085', margin: '8px 0 48px 0' }}>
            Choose a plan that fits your journey towards a faith-honoring union.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'center' }} className="pricing-grid">
            
            {/* Plan 1: Grace */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EFEBE4',
              borderRadius: '20px',
              padding: '36px 28px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                Grace
              </h3>
              <p style={{ fontSize: '12px', color: '#8A92A0', margin: '4px 0 20px 0' }}>Gentle Journey Starts</p>

              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1B2535', marginBottom: '24px' }}>
                Free
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Create profile
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Browse matches
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Express interest
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
                Get Started
              </Link>
            </div>

            {/* Plan 2: Covenant (Featured Most Popular) */}
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
                padding: '3px 14px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Most Popular
              </span>

              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                Covenant
              </h3>
              <p style={{ fontSize: '12px', color: '#8A92A0', margin: '4px 0 20px 0' }}>Intentional Search</p>

              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1B2535', marginBottom: '24px' }}>
                $29 <span style={{ fontSize: '14px', fontWeight: 400, color: '#8A92A0' }}>/ month</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1B2535', fontWeight: 600 }}>
                  <Check size={14} color="#C59B4E" /> Unlimited messages
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Priority profile listing
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> See who viewed you
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Advanced faith filters
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

            {/* Plan 3: Sanctity */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EFEBE4',
              borderRadius: '20px',
              padding: '36px 28px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                Sanctity
              </h3>
              <p style={{ fontSize: '12px', color: '#8A92A0', margin: '4px 0 20px 0' }}>Complete Guidance</p>

              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1B2535', marginBottom: '24px' }}>
                $89 <span style={{ fontSize: '14px', fontWeight: 400, color: '#8A92A0' }}>/ month</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> All Covenant features
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Personal matchmaker
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475467' }}>
                  <Check size={14} color="#C59B4E" /> Background verification
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
                Contact Us
              </Link>
            </div>

          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer style={{ background: '#101928', color: '#94A3B8', padding: '60px 24px 32px 24px', fontSize: '13px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid #1E293B' }} className="footer-grid">
          
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={18} color="#C59B4E" />
              <span>Grace & Covenant</span>
            </div>
            <p style={{ lineHeight: 1.6, maxWidth: '280px', margin: 0 }}>
              Dedicated to providing a sacred space for church members to find their lifelong partners through faith and intentional connection.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#C59B4E', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              DENOMINATIONS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/browse?denomination=Catholic" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Catholic</Link>
              <Link to="/browse?denomination=Orthodox" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Orthodox</Link>
              <Link to="/browse?denomination=Protestant" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Protestant</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#C59B4E', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              SUPPORT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/safety" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/safety" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Terms of Service</Link>
              <Link to="/contact" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Contact Support</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#C59B4E', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              NEWSLETTER
            </h4>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>
              Subscribe for faith-based dating advice and community updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                style={{
                  background: '#C59B4E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 16px',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>

        <div style={{ maxWidth: '1160px', margin: '24px auto 0 auto', textAlign: 'center', fontSize: '12px', color: '#64748B' }}>
          © 2024 Grace & Covenant. Sacredly bound for a lifetime.
        </div>
      </footer>

    </div>
  )
}
