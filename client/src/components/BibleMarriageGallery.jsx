import React, { useState, useEffect, useRef } from 'react'
import { BookOpen, Sparkles, ChevronLeft, ChevronRight, Heart, X, Quote, Star, ShieldCheck } from 'lucide-react'

const BIBLE_COUPLES = [
  {
    id: 'adam-eve',
    names: 'Adam & Eve',
    scripture: 'Genesis 2:23-24',
    subtitle: 'The First Sacramental Union',
    theme: 'Divine Oneness',
    badge: 'Covenant Foundation',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    story: 'Created by God to be helpmates and companions, Adam and Eve represent the foundational unity of man and woman in holy matrimony. Their union establishes marriage as a sacred, God-ordained covenant where two become one flesh in love, dignity, and divine purpose.',
    lesson: 'Marriage is not a human invention, but a divine design of complementary partnership, sacrificial love, and sacred unity.',
    quote: '"This is now bone of my bones and flesh of my flesh... That is why a man leaves his father and mother and is united to his wife."'
  },
  {
    id: 'isaac-rebekah',
    names: 'Isaac & Rebekah',
    scripture: 'Genesis 24:67',
    subtitle: 'Guided by Faith & Prayer',
    theme: 'Divine Providence',
    badge: 'Faithful Guidance',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    story: 'When Abraham sought a faithful wife for his son Isaac, servant Eliezer prayed for God’s guidance at the well. Rebekah responded with immediate kindness and hospitality, revealing God’s clear hand in bringing them together into a deeply loving marriage.',
    lesson: 'Trust God’s divine providence when seeking a life partner, as true love is grounded in kindness, virtue, and prayer.',
    quote: '"So she became his wife, and he loved her; and Isaac was comforted after his mother’s death."'
  },
  {
    id: 'jacob-rachel',
    names: 'Jacob & Rachel',
    scripture: 'Genesis 29:20',
    subtitle: 'Devotion That Endures All Trials',
    theme: 'Enduring Love',
    badge: 'Patience & Commitment',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    story: 'Jacob’s deep affection for Rachel inspired him to labor for fourteen years with unwavering devotion. Through every hardship, his love remained steadfast, demonstrating how genuine affection transforms years of sacrifice into moments of grace.',
    lesson: 'True Catholic love requires patience, perseverance, and willingness to sacrifice for the genuine good of one’s spouse.',
    quote: '"So Jacob served seven years to get Rachel, but they seemed like only a few days to him because of his love for her."'
  },
  {
    id: 'boaz-ruth',
    names: 'Boaz & Ruth',
    scripture: 'Ruth 1:16, 4:13',
    subtitle: 'Redemption, Honor & Loyalty',
    theme: 'Sacrificial Honor',
    badge: 'Mutual Virtue',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
    story: 'Ruth demonstrated noble loyalty to her mother-in-law Naomi and faith in the God of Israel. Noticing her virtuous character, Boaz acted as her honorable kinsman-redeemer, building a home filled with charity and becoming direct ancestors of King David and Jesus.',
    lesson: 'A godly marriage is built on mutual respect, moral integrity, family loyalty, and selfless care for one another.',
    quote: '"Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God."'
  },
  {
    id: 'elkanah-hannah',
    names: 'Elkanah & Hannah',
    scripture: '1 Samuel 1:8, 1:20',
    subtitle: 'Compassion & Shared Prayer',
    theme: 'Prayer & Empathy',
    badge: 'Spiritual Support',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    story: 'During Hannah’s years of painful childlessness, her husband Elkanah comforted her with deep tenderness and supported her fervent prayers at the tabernacle. God remembered Hannah’s tears, granting them their son Samuel.',
    lesson: 'Spouses should support each other’s emotional burdens with tender compassion and stand united in prayer before God.',
    quote: '"Elkanah her husband said to her, \'Hannah, why are you weeping?... Am I not better to you than ten sons?\'"'
  },
  {
    id: 'zechariah-elizabeth',
    names: 'Zechariah & Elizabeth',
    scripture: 'Luke 1:5-6, 1:24-25',
    subtitle: 'Lifelong Faithfulness & Hope',
    theme: 'Righteous Hope',
    badge: 'Holy Perseverance',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    story: 'Both Zechariah and Elizabeth lived blameless lives before God, walking in all His commandments even into their old age. Despite decades of unanswered prayers, their steadfast faith was rewarded when God blessed them with John the Baptist.',
    lesson: 'Faithful couples who remain devoted to God through all life’s seasons will experience God’s miraculous grace.',
    quote: '"Both of them were righteous in the sight of God, observing all the Lord’s commands and decrees blamelessly."'
  },
  {
    id: 'joseph-mary',
    names: 'Joseph & Mary',
    scripture: 'Matthew 1:20-24, Luke 2:19',
    subtitle: 'The Holy Family of Nazareth',
    theme: 'Sacramental Protection',
    badge: 'Ultimate Example',
    image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80',
    story: 'St. Joseph and the Blessed Virgin Mary provide the highest earthly model of marital trust and devotion. Joseph quietly protected and provided for Mary and Jesus, while Mary treasured all things in her heart, creating a home filled with divine peace.',
    lesson: 'Put God at the absolute center of your marriage, honoring purity, mutual protection, and obedience to God’s holy will.',
    quote: '"Joseph son of David, do not be afraid to take Mary home as your wife... And Mary pondered all these things in her heart."'
  },
  {
    id: 'aquila-priscilla',
    names: 'Aquila & Priscilla',
    scripture: 'Romans 16:3-4, Acts 18:26',
    subtitle: 'Co-Workers in Christ & Ministry',
    theme: 'United Ministry',
    badge: 'Parish Leadership',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    story: 'Aquila and Priscilla were an inseparable apostolic couple who worked together in trade and ministry. They hosted church gatherings in their home, mentored young believers like Apollos, and risked their lives to support St. Paul.',
    lesson: 'A strong Christian marriage flourishes when husband and wife share a unified passion for serving God and their church.',
    quote: '"Greet Priscilla and Aquila, my co-workers in Christ Jesus. They risked their lives for me."'
  }
]

export default function BibleMarriageGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const [selectedCouple, setSelectedCouple] = useState(null)

  // Drag / Touch State
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)

  const sliderRef = useRef(null)
  const maxIndex = BIBLE_COUPLES.length - 1

  // Auto-play slider loop
  useEffect(() => {
    if (isAutoplayPaused || selectedCouple) return
    const interval = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, isAutoplayPaused, selectedCouple])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      handlePrev()
    }
  }

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const diff = touchStartX - touchEndX
    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }
    setTouchStartX(0)
    setTouchEndX(0)
  }

  // Mouse Drag handlers
  const handleMouseDown = (e) => {
    setIsMouseDown(true)
    setDragStartX(e.clientX)
  }

  const handleMouseUp = (e) => {
    if (!isMouseDown) return
    setIsMouseDown(false)
    const diff = dragStartX - e.clientX
    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }
  }

  const handleMouseLeave = () => {
    setIsMouseDown(false)
    setIsAutoplayPaused(false)
  }

  const couple = BIBLE_COUPLES[currentIndex]

  return (
    <section
      id="bible-marriages"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        background: '#1E2B45',
        color: '#FFFFFF',
        padding: '80px 24px',
        position: 'relative',
        outline: 'none',
        overflow: 'hidden'
      }}
      aria-label="Bible Marriage Gallery Section"
    >
      {/* Decorative Glow Elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(226, 185, 109, 0.12) 0%, rgba(30, 43, 69, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(226, 185, 109, 0.08) 0%, rgba(30, 43, 69, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Container - Exact Success Story Grid Layout */}
      <div
        ref={sliderRef}
        onMouseEnter={() => setIsAutoplayPaused(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="success-story-grid"
        style={{
          cursor: isMouseDown ? 'grabbing' : 'grab',
          userSelect: 'none',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            LEFT COLUMN: Large Wedding / Biblical Image Card
           ───────────────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative',
          height: '440px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <img
            src={couple.image}
            alt={couple.names}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {/* Dark Overlay Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(30, 43, 69, 0.1) 0%, rgba(30, 43, 69, 0.85) 100%)'
          }} />

          {/* Top Badge */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            color: '#FFFFFF',
            padding: '6px 16px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <BookOpen size={14} color="#E2B96D" />
            <span>{couple.scripture}</span>
          </div>

          {/* Top Right Theme Badge */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#E2B96D',
            color: '#1E2B45',
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {couple.theme}
          </div>

          {/* Floating Card Overlay at Bottom-Left (Exact Success Story Style) */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            right: '24px',
            background: 'rgba(30, 43, 69, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '16px 20px',
            borderRadius: '18px',
            color: '#FFFFFF'
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.2
            }}>
              {couple.names}
            </div>
            <div style={{ fontSize: '13px', color: '#E2B96D', fontWeight: 600, marginTop: '2px' }}>
              {couple.subtitle} • {couple.scripture}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT COLUMN: Quote & Story Content (Exact Success Story Style)
           ───────────────────────────────────────────────────────────── */}
        <div>
          
          {/* Header Tag & Section Title */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(226, 185, 109, 0.15)',
            border: '1px solid rgba(226, 185, 109, 0.4)',
            color: '#E2B96D',
            padding: '5px 14px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <Sparkles size={14} />
            <span>Bible Marriage Gallery ({currentIndex + 1} of {BIBLE_COUPLES.length})</span>
          </div>

          {/* Large Gold Quote Marks "99" */}
          <div style={{
            fontSize: '52px',
            color: '#E2B96D',
            fontFamily: "'Cormorant Garamond', serif",
            lineHeight: 0.8,
            marginBottom: '12px',
            userSelect: 'none'
          }}>
            “
          </div>

          {/* Scripture Verse Quote */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '32px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: '0 0 16px 0',
            lineHeight: 1.3
          }}>
            {couple.quote}
          </h2>

          {/* Inspirational Story */}
          <p style={{
            fontSize: '15.5px',
            lineHeight: 1.75,
            color: '#E2E8F0',
            fontStyle: 'italic',
            marginBottom: '24px',
            opacity: 0.95
          }}>
            "{couple.story}"
          </p>

          {/* Key Lesson Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderLeft: '4px solid #E2B96D',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '32px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#E2B96D',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Star size={12} fill="#E2B96D" color="#E2B96D" />
              Marital Takeaway
            </div>
            <p style={{ fontSize: '13.5px', color: '#FFFFFF', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
              {couple.lesson}
            </p>
          </div>

          {/* Navigation Arrows & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={handlePrev}
                aria-label="Previous Bible Couple"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#E2B96D'
                  e.currentTarget.style.color = '#1E2B45'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.color = '#FFFFFF'
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next Bible Couple"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#E2B96D'
                  e.currentTarget.style.color = '#1E2B45'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.color = '#FFFFFF'
                }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Read Full Reflection Modal Trigger Button */}
              <button
                onClick={() => setSelectedCouple(couple)}
                style={{
                  background: 'transparent',
                  color: '#E2B96D',
                  border: '1px solid #E2B96D',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#E2B96D'
                  e.currentTarget.style.color = '#1E2B45'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#E2B96D'
                }}
              >
                <span>Read Full Reflection</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Pagination Indicators / Dots */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {BIBLE_COUPLES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to couple ${idx + 1}`}
                  style={{
                    width: currentIndex === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: currentIndex === idx ? '#E2B96D' : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          EXPANDABLE MODAL DIALOG FOR FULL REFLECTION
         ───────────────────────────────────────────────────────────── */}
      {selectedCouple && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'grid',
            placeItems: 'center',
            padding: '24px'
          }}
          onClick={() => setSelectedCouple(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              color: '#1E2B45',
              borderRadius: '28px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
              position: 'relative'
            }}
          >
            {/* Modal Image Header */}
            <div style={{ position: 'relative', height: '260px' }}>
              <img
                src={selectedCouple.image}
                alt={selectedCouple.names}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(30, 43, 69, 0.2) 0%, rgba(30, 43, 69, 0.85) 100%)'
              }} />

              {/* Close Button */}
              <button
                onClick={() => setSelectedCouple(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '28px',
                right: '28px',
                color: '#FFFFFF'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FEF3C7',
                  color: '#745A1C',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  marginBottom: '8px'
                }}>
                  <BookOpen size={12} />
                  {selectedCouple.scripture}
                </div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '34px',
                  fontWeight: 700,
                  margin: 0,
                  color: '#FFFFFF'
                }}>
                  {selectedCouple.names}
                </h3>
                <span style={{ fontSize: '13px', opacity: 0.9 }}>{selectedCouple.subtitle}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px 28px' }}>
              
              {/* Scripture Quote Box */}
              <div style={{
                background: '#FDFBF7',
                border: '1px solid #EAE5DC',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '24px',
                position: 'relative'
              }}>
                <Quote size={24} color="#745A1C" style={{ marginBottom: '8px', opacity: 0.4 }} />
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '19px',
                  fontStyle: 'italic',
                  color: '#1E2B45',
                  lineHeight: 1.5,
                  margin: '0 0 8px 0',
                  fontWeight: 600
                }}>
                  {selectedCouple.quote}
                </p>
                <div style={{ fontSize: '12px', color: '#745A1C', fontWeight: 700, textAlign: 'right' }}>
                  — {selectedCouple.scripture}
                </div>
              </div>

              {/* Story Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#1E2B45',
                  margin: '0 0 10px 0'
                }}>
                  Sacred Account & Story
                </h4>
                <p style={{ fontSize: '14.5px', color: '#475467', lineHeight: 1.7, margin: 0 }}>
                  {selectedCouple.story}
                </p>
              </div>

              {/* Key Lesson */}
              <div style={{
                background: '#FEF9EE',
                border: '1px solid #FDE68A',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '28px'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#745A1C',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Heart size={14} fill="#745A1C" />
                  Key Lesson for Catholic Matrimony
                </div>
                <p style={{ fontSize: '14px', color: '#1E2B45', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                  {selectedCouple.lesson}
                </p>
              </div>

              {/* Close Action */}
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => setSelectedCouple(null)}
                  style={{
                    background: '#1E2B45',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close Reflection
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  )
}
