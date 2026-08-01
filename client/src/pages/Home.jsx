import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Check, Sparkles, 
  ShieldCheck, Church, Lock, Users, Heart, Play, ArrowRight, BookOpen, 
  MapPin, MessageSquare, Loader2, Award, UserCheck, Shield, Clock, CheckCircle2, X
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import BibleMarriageGallery from '../components/BibleMarriageGallery'

export default function Home({ scrollToSubscription }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Search Widget Form State
  const [seekingGender, setSeekingGender] = useState('Female')
  const [ageFrom, setAgeFrom] = useState(21)
  const [ageTo, setAgeTo] = useState(35)
  const [selectedDiocese, setSelectedDiocese] = useState('')

  // Bible Verses Slider State
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)

  const bibleVerses = [
    {
      verse: 'Mark 10:9',
      text: 'Therefore what God has joined together, let no one separate.',
      context: 'The Covenant of Sacramental Unity',
      theme: 'God’s Blessing'
    },
    {
      verse: '1 Corinthians 13:4-7',
      text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It always protects, always trusts, always hopes, always perseveres.',
      context: 'The Essence of Christian Love',
      theme: 'Sacred Love'
    },
    {
      verse: 'Genesis 2:24',
      text: 'That is why a man leaves his father and mother and is united to his wife, and they become one flesh.',
      context: 'The Sacred Foundation of Family',
      theme: 'Holy Union'
    },
    {
      verse: 'Ecclesiastes 4:9-12',
      text: 'Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. A cord of three strands is not quickly broken.',
      context: 'Strength in Shared Faith',
      theme: 'Partnership'
    },
    {
      verse: 'Colossians 3:14',
      text: 'And over all these virtues put on love, which binds them all together in perfect unity.',
      context: 'The Bond of Perfect Peace',
      theme: 'Unity'
    },
    {
      verse: 'Ephesians 5:31',
      text: 'For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh.',
      context: 'Spiritual Oneness in Marriage',
      theme: 'Sacramental Oneness'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVerseIndex((prev) => (prev + 1) % bibleVerses.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [bibleVerses.length])

  const nextVerse = () => {
    setCurrentVerseIndex((prev) => (prev + 1) % bibleVerses.length)
  }

  const prevVerse = () => {
    setCurrentVerseIndex((prev) => (prev - 1 + bibleVerses.length) % bibleVerses.length)
  }

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
        setFeaturedMembers(prev => prev.map(m => m._id === memberId ? {
          ...m,
          contactRequest: { status: 'Pending', direction: 'sent' }
        } : m))
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit contact request.')
    } finally {
      setSubmittingId(null)
    }
  }

  const [homePlans, setHomePlans] = useState([])
  const [loadingHomePlans, setLoadingHomePlans] = useState(true)

  useEffect(() => {
    fetchFeaturedMembers()
    fetchHomePlans()
  }, [])

  const fetchHomePlans = async () => {
    setLoadingHomePlans(true)
    try {
      const res = await api.get('/subscriptions?status=active&limit=3&sortBy=displayOrder&sortOrder=asc')
      if (res.data && res.data.success) {
        setHomePlans(res.data.subscriptions || [])
      }
    } catch (err) {
      console.error('Failed to fetch home subscription plans:', err)
    } finally {
      setLoadingHomePlans(false)
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
        backgroundImage: `linear-gradient(180deg, rgba(26, 37, 56, 0.5) 0%, rgba(26, 37, 56, 0.75) 100%), url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80')`,
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
          2. SACRED SCRIPTURE SLIDER FOR HOLY MATRIMONY
         ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FEF3C7',
            color: '#745A1C',
            padding: '6px 18px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '14px'
          }}>
            <BookOpen size={16} />
            <span>Divine Words of Wisdom</span>
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '40px',
            fontWeight: 700,
            color: '#1E2B45',
            margin: '0 0 12px 0'
          }}>
            Holy Scripture on Marriage
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Marriage is a holy sacrament ordained by God. Reflect on sacred verses that guide lifelong love, unity, and faith.
          </p>
        </div>

        {/* Carousel Slider Card Container */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FDFBF7 100%)',
          border: '1.5px solid #EAE5DC',
          borderRadius: '32px',
          padding: '56px 48px 40px 48px',
          boxShadow: '0 12px 40px rgba(30, 43, 69, 0.06)',
          overflow: 'hidden',
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Decorative Background Quote Mark */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '32px',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '160px',
            lineHeight: 1,
            color: '#F3EAD6',
            fontWeight: 700,
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 0
          }}>
            “
          </div>

          {/* Decorative Corner Church Icon */}
          <div style={{
            position: 'absolute',
            top: '28px',
            right: '36px',
            opacity: 0.15,
            pointerEvents: 'none'
          }}>
            <Church size={64} color="#745A1C" />
          </div>

          {/* Slide Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Top Meta Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#745A1C',
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                padding: '6px 16px',
                borderRadius: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={14} color="#745A1C" />
                {bibleVerses[currentVerseIndex].context}
              </span>

              <span style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}>
                Verse {currentVerseIndex + 1} of {bibleVerses.length}
              </span>
            </div>

            {/* Quote Text */}
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '28px',
              fontStyle: 'italic',
              fontWeight: 600,
              lineHeight: 1.5,
              color: '#1E2B45',
              marginBottom: '32px',
              minHeight: '90px',
              transition: 'all 0.4s ease'
            }}>
              "{bibleVerses[currentVerseIndex].text}"
            </p>

            {/* Scripture Reference Author */}
            <div style={{ borderTop: '1px dashed #EAE5DC', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, color: '#745A1C', margin: '0 0 2px 0' }}>
                  — {bibleVerses[currentVerseIndex].verse}
                </h4>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  Holy Bible • {bibleVerses[currentVerseIndex].theme}
                </span>
              </div>

              {/* Navigation Arrows */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={prevVerse}
                  aria-label="Previous Verse"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1.5px solid #EAE5DC',
                    background: '#FFFFFF',
                    color: '#1E2B45',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#1E2B45'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#FFFFFF'
                    e.currentTarget.style.color = '#1E2B45'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextVerse}
                  aria-label="Next Verse"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1.5px solid #EAE5DC',
                    background: '#FFFFFF',
                    color: '#1E2B45',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#1E2B45'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#FFFFFF'
                    e.currentTarget.style.color = '#1E2B45'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Dot Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px', zIndex: 1 }}>
            {bibleVerses.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentVerseIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: currentVerseIndex === idx ? '28px' : '9px',
                  height: '9px',
                  borderRadius: '10px',
                  border: 'none',
                  background: currentVerseIndex === idx ? '#745A1C' : '#CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

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
          5. BIBLE MARRIAGE GALLERY SECTION
         ───────────────────────────────────────────────────────────── */}
      <BibleMarriageGallery />


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
          DYNAMIC MEMBERSHIP PLANS PREVIEW SECTION
         ───────────────────────────────────────────────────────────── */}
      <section id="subscription" style={{ padding: '80px 24px', background: '#f8faf9', borderTop: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(197, 155, 78, 0.15)',
              color: '#C59B4E',
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px'
            }}>
              <Sparkles size={14} /> Sacred Memberships
            </span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              fontWeight: 700,
              color: '#1E2B45',
              margin: '0 0 10px 0'
            }}>
              Transparent Membership Plans
            </h2>
            <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Choose a plan tailored to your matrimonial journey. All plans are dynamically updated by administration.
            </p>
          </div>

          {loadingHomePlans ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 350px))', justifyContent: 'center', gap: '32px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: '#FFFFFF', padding: '32px', borderRadius: '20px', border: '1px solid #EAE5DC' }}>
                  <div style={{ height: '24px', background: '#EAE5DC', borderRadius: '6px', width: '50%', marginBottom: '16px' }}></div>
                  <div style={{ height: '36px', background: '#EAE5DC', borderRadius: '6px', width: '75%', marginBottom: '16px' }}></div>
                  <div style={{ height: '16px', background: '#EAE5DC', borderRadius: '6px', width: '100%' }}></div>
                </div>
              ))}
            </div>
          ) : homePlans.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EAE5DC',
              borderRadius: '20px',
              padding: '40px 24px',
              maxWidth: '480px',
              margin: '0 auto',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(30, 43, 69, 0.04)'
            }}>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>No active membership plans available at the moment.</p>
              <Link to="/contact" style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: '20px',
                border: '1px solid #1E2B45',
                color: '#1E2B45',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}>Contact Support</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 350px))', justifyContent: 'center', gap: '32px', alignItems: 'stretch' }}>
              {homePlans.map((plan) => (
                <div
                  key={plan._id}
                  style={{
                    background: '#FFFFFF',
                    border: plan.isPopular ? '2px solid #C59B4E' : '1px solid #EAE5DC',
                    borderRadius: '24px',
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: plan.isPopular ? '0 12px 32px rgba(197, 155, 78, 0.2)' : '0 4px 16px rgba(30, 43, 69, 0.06)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  {plan.isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#C59B4E',
                      color: '#FFFFFF',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 12px rgba(197, 155, 78, 0.3)'
                    }}>
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#C59B4E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                      {plan.planType} PLAN
                    </div>

                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>
                      {plan.name}
                    </h3>

                    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0', lineHeight: 1.5, minHeight: '38px' }}>
                      {plan.description || 'Full parish profile access and verified search.'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', paddingBottom: '16px', marginBottom: '20px', borderBottom: '1px solid #EAE5DC' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 700, color: '#1E2B45' }}>
                        {plan.price === 0 ? 'FREE' : `₹${plan.price.toLocaleString('en-IN')}`}
                      </span>
                      {plan.price > 0 && <span style={{ fontSize: '12px', color: '#64748B' }}>/ {plan.duration} {plan.durationUnit}</span>}
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <li style={{ fontSize: '13px', color: '#1E2B45', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={16} style={{ color: '#10b981' }} /> Contacts: <strong>{plan.maxContactRequests === -1 ? 'Unlimited' : plan.maxContactRequests}</strong>
                      </li>
                      <li style={{ fontSize: '13px', color: '#1E2B45', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={16} style={{ color: '#10b981' }} /> Views: <strong>{plan.maxProfileViews === -1 ? 'Unlimited' : plan.maxProfileViews}</strong>
                      </li>
                      {plan.features?.slice(0, 2).map((f, idx) => (
                        <li key={idx} style={{ fontSize: '13px', color: '#475467', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Check size={16} style={{ color: '#10b981' }} /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/subscription"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '12px 24px',
                      borderRadius: '24px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      textDecoration: 'none',
                      background: plan.isPopular ? '#1E2B45' : 'transparent',
                      color: plan.isPopular ? '#FFFFFF' : '#1E2B45',
                      border: plan.isPopular ? 'none' : '1.5px solid #1E2B45',
                      boxShadow: plan.isPopular ? '0 4px 14px rgba(30, 43, 69, 0.2)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Choose {plan.name}
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link
              to="/subscription"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '24px',
                border: '1.5px solid #1E2B45',
                color: '#1E2B45',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                background: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              View All Membership Plans <ArrowRight size={16} />
            </Link>
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
