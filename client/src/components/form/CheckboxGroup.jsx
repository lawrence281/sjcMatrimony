/**
 * CheckboxGroup — checkbox list (returns array of selected values)
 */
export default function CheckboxGroup({
  label,
  name,
  options = [],
  value = [],
  onChange,
  error,
  disabled = false,
  inline = false,
  className = '',
}) {
  const selected = Array.isArray(value) ? value : []

  const toggle = (val) => {
    if (disabled) return
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <div className={`form-field ${className}`}>
      {label && <span className="form-label">{label}</span>}
      <div className={`checkbox-group ${inline ? 'inline' : ''}`}>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt
          const lbl = typeof opt === 'object' ? opt.label : opt
          return (
            <label key={val} className={`checkbox-option ${disabled ? 'disabled' : ''}`}>
              <input
                type="checkbox"
                name={`${name}-${val}`}
                value={val}
                checked={selected.includes(val)}
                onChange={() => toggle(val)}
                disabled={disabled}
                className="checkbox-input"
              />
              <span className="checkbox-custom" />
              <span className="checkbox-label">{lbl}</span>
            </label>
          )
        })}
      </div>
      {error && <p className="form-error-msg">{error}</p>}
    </div>
  )
}
