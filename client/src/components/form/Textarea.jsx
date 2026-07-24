/**
 * Textarea — multiline text input with character counter
 */
export default function Textarea({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = '',
  rows = 4,
  maxLength,
  hint,
  className = '',
}) {
  const charCount = value ? value.length : 0

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`form-textarea ${error ? 'input-error' : ''}`}
      />
      <div className="textarea-footer">
        {hint && !error && <p className="form-hint">{hint}</p>}
        {error && <p className="form-error-msg">{error}</p>}
        {maxLength && (
          <span className={`char-count ${charCount >= maxLength * 0.9 ? 'near-limit' : ''}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}
