import { useState } from 'react'
import { ChevronDown, Pencil, Check, X, Loader } from 'lucide-react'

/**
 * FormSection — collapsible card with Edit / Cancel / Save actions
 *
 * Usage:
 *   <FormSection title="Basic Information" icon={User} completion={15} filled={10}>
 *     {({ editing }) => editing ? <EditForm /> : <ViewMode /> }
 *   </FormSection>
 */
export default function FormSection({
  title,
  icon: Icon,
  children,
  onSave,
  saving = false,
  defaultExpanded = false,
  completionScore,  // number 0-100 for this section
  className = '',
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [editing, setEditing] = useState(false)

  const handleSave = async () => {
    if (onSave) {
      const ok = await onSave()
      if (ok !== false) setEditing(false)
    } else {
      setEditing(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
  }

  return (
    <div className={`form-section-card ${expanded ? 'expanded' : ''} ${className}`}>
      {/* Header */}
      <div
        className="form-section-header"
        onClick={() => setExpanded((e) => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((ex) => !ex)}
      >
        <div className="form-section-title">
          {Icon && <Icon size={18} className="section-title-icon" />}
          <span>{title}</span>
        </div>
        <div className="form-section-header-right">
          {completionScore !== undefined && (
            <span className={`section-badge ${completionScore > 0 ? 'filled' : ''}`}>
              {completionScore > 0 ? `${completionScore}%` : 'Incomplete'}
            </span>
          )}
          <ChevronDown
            size={18}
            className={`section-chevron ${expanded ? 'rotated' : ''}`}
          />
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="form-section-body">
          {typeof children === 'function' ? children({ editing }) : children}

          {/* Actions */}
          <div className="form-section-actions">
            {!editing ? (
              <button
                type="button"
                className="btn-edit-section"
                onClick={(e) => { e.stopPropagation(); setEditing(true) }}
              >
                <Pencil size={15} />
                Edit
              </button>
            ) : (
              <div className="edit-action-group">
                <button
                  type="button"
                  className="btn-cancel-section"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X size={15} />
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-save-section"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader size={15} className="spin" />
                  ) : (
                    <Check size={15} />
                  )}
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
