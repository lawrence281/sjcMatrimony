/**
 * SectionCard — display-mode card for a profile section
 *
 * Usage:
 *  <SectionCard title="Basic Information" icon={User} onEdit={() => navigate('/profile/edit')}>
 *    <SectionCard.Row label="First Name" value={profile.firstName} />
 *  </SectionCard>
 */
import { Pencil, AlertCircle } from 'lucide-react'

function SectionCard({ title, icon: Icon, children, onEdit, isEmpty = false }) {
  return (
    <div className="section-card">
      <div className="section-card-header">
        <div className="section-card-title">
          {Icon && <Icon size={18} className="section-icon" />}
          <h3>{title}</h3>
        </div>
        {onEdit && (
          <button className="btn-edit-mini" onClick={onEdit}>
            <Pencil size={14} />
            Edit
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="section-empty">
          <AlertCircle size={20} className="section-empty-icon" />
          <p>No information added yet.</p>
          {onEdit && (
            <button className="btn-add-info" onClick={onEdit}>
              Add Information
            </button>
          )}
        </div>
      ) : (
        <div className="section-card-body">{children}</div>
      )}
    </div>
  )
}

function Row({ label, value, fullWidth = false }) {
  if (!value && value !== 0) return null
  const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
  return (
    <div className={`sc-row ${fullWidth ? 'full-width' : ''}`}>
      <span className="sc-label">{label}</span>
      <span className="sc-value">{displayValue || '—'}</span>
    </div>
  )
}

function BoolRow({ label, value }) {
  return (
    <div className="sc-row">
      <span className="sc-label">{label}</span>
      <span className={`sc-bool ${value ? 'yes' : 'no'}`}>{value ? 'Yes' : 'No'}</span>
    </div>
  )
}

SectionCard.Row = Row
SectionCard.BoolRow = BoolRow

export default SectionCard
