/**
 * DatePicker — date input with min/max constraints
 */
export default function DatePicker({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  min,
  max,
  className = '',
}) {
  // Default: allow ages 18–70
  const today = new Date()
  const defaultMax = max || new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString().split('T')[0]
  const defaultMin = min || new Date(today.getFullYear() - 70, today.getMonth(), today.getDate())
    .toISOString().split('T')[0]

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="date"
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        min={defaultMin}
        max={defaultMax}
        className={`form-input ${error ? 'input-error' : ''}`}
      />
      {error && <p className="form-error-msg">{error}</p>}
    </div>
  )
}
