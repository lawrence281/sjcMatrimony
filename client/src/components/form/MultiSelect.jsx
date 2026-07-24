import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'

/**
 * MultiSelect — custom multi-select with chips and dropdown
 */
export default function MultiSelect({
  label,
  name,
  options = [],
  value = [],
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select options…',
  maxItems,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = Array.isArray(value) ? value : []

  const filtered = options.filter((opt) => {
    const lbl = typeof opt === 'object' ? opt.label : opt
    return lbl.toLowerCase().includes(search.toLowerCase()) && !selected.includes(typeof opt === 'object' ? opt.value : opt)
  })

  const toggle = (optValue) => {
    if (disabled) return
    if (selected.includes(optValue)) {
      onChange(selected.filter((v) => v !== optValue))
    } else {
      if (maxItems && selected.length >= maxItems) return
      onChange([...selected, optValue])
    }
  }

  const remove = (optValue) => {
    if (disabled) return
    onChange(selected.filter((v) => v !== optValue))
  }

  return (
    <div className={`form-field ${className}`} ref={ref}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}

      <div
        className={`multiselect-box ${open ? 'open' : ''} ${error ? 'input-error' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && setOpen((o) => !o)}
      >
        <div className="multiselect-chips">
          {selected.length === 0 && (
            <span className="multiselect-placeholder">{placeholder}</span>
          )}
          {selected.map((val) => (
            <span key={val} className="multiselect-chip">
              {val}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(val) }}
                className="chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown size={16} className={`multiselect-arrow ${open ? 'rotated' : ''}`} />
      </div>

      {open && (
        <div className="multiselect-dropdown">
          <input
            type="text"
            className="multiselect-search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <ul className="multiselect-list">
            {filtered.length === 0 && (
              <li className="multiselect-empty">No options found</li>
            )}
            {filtered.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt
              const lbl = typeof opt === 'object' ? opt.label : opt
              return (
                <li
                  key={val}
                  className="multiselect-option"
                  onClick={(e) => { e.stopPropagation(); toggle(val) }}
                >
                  {lbl}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {error && <p className="form-error-msg">{error}</p>}
      {maxItems && (
        <p className="form-hint">
          {selected.length} / {maxItems} selected
        </p>
      )}
    </div>
  )
}
