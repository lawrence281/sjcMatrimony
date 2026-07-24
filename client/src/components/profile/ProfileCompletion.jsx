import { CheckCircle2, Circle } from 'lucide-react'
import { COMPLETION_SECTIONS } from '../../constants/masterData'

export default function ProfileCompletion({ completion = 0, breakdown = {} }) {
  const getColor = (pct) => {
    if (pct >= 80) return 'var(--pc-green)'
    if (pct >= 50) return 'var(--pc-amber)'
    return 'var(--pc-red)'
  }

  return (
    <div className="completion-card">
      <div className="completion-header">
        <h3 className="completion-title">Profile Completion</h3>
        <span className="completion-pct-large" style={{ color: getColor(completion) }}>
          {completion}%
        </span>
      </div>

      {/* Circular progress */}
      <div className="completion-circle-wrap">
        <svg viewBox="0 0 100 100" className="completion-svg">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke={getColor(completion)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${completion * 2.639} 263.9`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
          <text x="50" y="54" textAnchor="middle" className="completion-svg-text">
            {completion}%
          </text>
        </svg>
        <p className="completion-circle-label">
          {completion < 40
            ? 'Just getting started'
            : completion < 70
            ? 'Looking good!'
            : completion < 90
            ? 'Almost there!'
            : 'Complete!'}
        </p>
      </div>

      {/* Section breakdown */}
      <div className="completion-sections">
        {COMPLETION_SECTIONS.map(({ key, label, weight }) => {
          const score = breakdown[key] || 0
          const pct = Math.round((score / weight) * 100)
          const done = pct >= 100
          return (
            <div key={key} className="completion-section-row">
              <div className="cs-left">
                {done ? (
                  <CheckCircle2 size={16} className="cs-icon done" />
                ) : (
                  <Circle size={16} className="cs-icon pending" />
                )}
                <span className="cs-label">{label}</span>
              </div>
              <div className="cs-right">
                <div className="cs-bar-track">
                  <div className="cs-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="cs-weight">{weight}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {completion < 100 && (
        <p className="completion-tip">
          💡 Complete all sections to get more profile visibility.
        </p>
      )}
    </div>
  )
}
