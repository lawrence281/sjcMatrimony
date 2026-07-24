/**
 * PhoneInput — phone number input with +91 prefix
 */
export default function PhoneInput({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  countryCode = '+91',
  className = '',
}) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className="phone-input-wrap">
        <span className="phone-prefix">{countryCode}</span>
        <input
          id={name}
          name={name}
          type="tel"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="10-digit mobile number"
          maxLength={10}
          className={`form-input phone-input ${error ? 'input-error' : ''}`}
        />
      </div>
      {error && <p className="form-error-msg">{error}</p>}
    </div>
  )
}
