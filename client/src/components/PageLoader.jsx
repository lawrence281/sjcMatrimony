import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, Heart } from 'lucide-react'

const PageLoader = () => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Guiding your journey in faith...')

  const matrimonyPhrases = [
    'Guiding your journey in faith...',
    'Connecting hearts in holy union...',
    'Loading verified matrimony profiles...',
    'Preparing sacred connections...',
    'Finding your blessed match...',
    'Welcoming you to SJC Matrimony...'
  ]

  useEffect(() => {
    // Pick a random faith-centered phrase on each navigation
    const randomPhrase = matrimonyPhrases[Math.floor(Math.random() * matrimonyPhrases.length)]
    setLoadingText(randomPhrase)
    
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 650)

    return () => clearTimeout(timer)
  }, [location])

  if (!isLoading) return null

  // Pre-configured particle positions & motions for ultra-smooth rendering
  const particles = [
    { left: '8%', duration: '3.8s', delay: '0s', sway: '30px', maxOpacity: 0.7, scale: 0.9, type: 'heart', color: '#E11D48' },
    { left: '18%', duration: '4.4s', delay: '0.4s', sway: '-35px', maxOpacity: 0.8, scale: 1.1, type: 'flower', color: '#F43F5E' },
    { left: '29%', duration: '3.6s', delay: '0.9s', sway: '25px', maxOpacity: 0.65, scale: 0.8, type: 'sparkle', color: '#C59B4E' },
    { left: '41%', duration: '4.8s', delay: '0.2s', sway: '-40px', maxOpacity: 0.75, scale: 1.2, type: 'heart', color: '#C59B4E' },
    { left: '52%', duration: '4.0s', delay: '1.1s', sway: '35px', maxOpacity: 0.8, scale: 1.0, type: 'flower', color: '#FB7185' },
    { left: '63%', duration: '3.5s', delay: '0.5s', sway: '-25px', maxOpacity: 0.7, scale: 0.85, type: 'sparkle', color: '#D97706' },
    { left: '74%', duration: '4.6s', delay: '0.1s', sway: '40px', maxOpacity: 0.85, scale: 1.15, type: 'heart', color: '#E11D48' },
    { left: '85%', duration: '3.9s', delay: '0.7s', sway: '-30px', maxOpacity: 0.65, scale: 0.9, type: 'flower', color: '#F43F5E' },
    { left: '93%', duration: '4.2s', delay: '1.3s', sway: '20px', maxOpacity: 0.75, scale: 1.0, type: 'sparkle', color: '#C59B4E' },
    { left: '35%', duration: '5.0s', delay: '1.5s', sway: '-45px', maxOpacity: 0.6, scale: 1.2, type: 'flower', color: '#FDA4AF' },
    { left: '68%', duration: '4.3s', delay: '1.7s', sway: '30px', maxOpacity: 0.7, scale: 0.95, type: 'heart', color: '#F43F5E' }
  ]

  return (
    <div className="matrimony-page-loader">
      {/* Floating Flowers, Hearts & Sparkles Particles Container */}
      <div className="loader-floating-particles">
        {particles.map((p, idx) => (
          <div
            key={idx}
            className="floating-particle"
            style={{
              left: p.left,
              '--duration': p.duration,
              '--delay': p.delay,
              '--sway': p.sway,
              '--max-opacity': p.maxOpacity,
              transform: `scale(${p.scale})`
            }}
          >
            {p.type === 'heart' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill={p.color} opacity="0.85">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            )}

            {p.type === 'flower' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill={p.color} opacity="0.85">
                {/* 5-petal flower blossom SVG */}
                <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm6.93 4a4 4 0 0 1 1.23 5.52 4 4 0 0 1-5.51 1.24 4 4 0 0 1-1.24-5.52 4 4 0 0 1 5.52-1.24zM18.93 18a4 4 0 0 1-5.52 1.23 4 4 0 0 1-1.24-5.51 4 4 0 0 1 5.52-1.24 4 4 0 0 1 1.24 5.52zM5.07 18a4 4 0 0 1 1.24-5.52 4 4 0 0 1 5.52 1.24 4 4 0 0 1-1.24 5.51A4 4 0 0 1 5.07 18zm-1.24-6.48a4 4 0 0 1 5.52-1.24 4 4 0 0 1 1.24 5.52 4 4 0 0 1-5.52 1.23 4 4 0 0 1-1.24-5.51z"/>
                <circle cx="12" cy="12" r="3" fill="#FFFBEB" />
              </svg>
            )}

            {p.type === 'sparkle' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill={p.color} opacity="0.9">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Centerpiece SJC Matrimony Brand Loader Card */}
      <div className="loader-brand-card">
        <div className="loader-logo-ring">
          <Sparkles size={28} color="#C59B4E" fill="#C59B4E" />
        </div>
        <div className="loader-brand-name">SJC Matrimony</div>
        <div className="loader-phrase-text">{loadingText}</div>
      </div>
    </div>
  )
}

export default PageLoader

