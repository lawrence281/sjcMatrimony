import { useState } from 'react'
import { Sparkles, X, CheckCircle2, Heart, Shield, Award, Church } from 'lucide-react'

export default function CompatibilityModal({ isOpen, onClose, profileName = 'Member' }) {
  if (!isOpen) return null

  const breakdown = [
    { label: 'Sacramental Values & Faith', score: 98, icon: Church, color: '#C59B4E' },
    { label: 'Education & Career Goals', score: 92, icon: Award, color: '#2563EB' },
    { label: 'Parish & Diocesan Heritage', score: 95, icon: Shield, color: '#059669' },
    { label: 'Lifestyle & Expectations', score: 88, icon: Heart, color: '#E11D48' },
  ]

  const overallMatch = 94

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(16, 25, 40, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 1100,
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        border: '1px solid #EAE5DC',
        overflow: 'hidden',
        animation: 'fadeInScale 0.25s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1A273D 0%, #2A3B56 100%)',
          color: '#FFFFFF',
          padding: '24px 28px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(197, 155, 78, 0.2)',
              border: '1px solid rgba(197, 155, 78, 0.4)',
              display: 'grid',
              placeItems: 'center'
            }}>
              <Sparkles size={20} color="#E2B96D" />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, margin: 0 }}>
                Compatibility Analysis
              </h3>
              <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '2px 0 0 0' }}>
                Matching metrics with {profileName}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px' }}>
          
          {/* Overall Match Circle */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            borderRadius: '18px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#745A1C', lineHeight: 1 }}>
                {overallMatch}%
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Overall Match Score
              </span>
            </div>
            <div style={{ textAlign: 'left', maxWidth: '240px' }}>
              <p style={{ fontSize: '13px', color: '#78350F', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                ✨ High compatibility in core Catholic faith practices, family values, and education background.
              </p>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {breakdown.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1B2535' }}>
                      <Icon size={16} color={item.color} />
                      <span>{item.label}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.score}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${item.score}%`,
                      background: item.color,
                      borderRadius: '4px',
                      transition: 'width 0.6s ease-out'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: '#1A273D',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close Compatibility Report
          </button>
        </div>
      </div>
    </div>
  )
}
