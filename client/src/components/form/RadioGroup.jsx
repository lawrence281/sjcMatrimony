/**
 * RadioGroup — radio button group
 */
export default function RadioGroup({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  inline = false,
  className = '',
}) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <span className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </span>
      )}
      <div className={`radio-group ${inline ? 'inline' : ''}`}>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt
          const lbl = typeof opt === 'object' ? opt.label : opt
          return (
            <label key={val} className={`radio-option ${disabled ? 'disabled' : ''}`}>
              <input
                type="radio"
                name={name}
                value={val}
                checked={value === val}
                onChange={() => !disabled && onChange(val)}
                disabled={disabled}
                className="radio-input"
              />
              <span className="radio-custom" />
              <span className="radio-label">{lbl}</span>
            </label>
          )
        })}
      </div>
      {error && <p className="form-error-msg">{error}</p>}
    </div>
  )
}
