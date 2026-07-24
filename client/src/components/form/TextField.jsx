/**
 * TextField — reusable text / number / email input
 * Compatible with React Hook Form register() or controlled usage
 */
export default function TextField({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  hint,
  className = '',
  ...rest
}) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className={`form-input-wrap ${Icon ? 'has-icon' : ''}`}>
        {Icon && (
          <span className="form-input-icon">
            <Icon size={16} />
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`form-input ${error ? 'input-error' : ''} ${Icon ? 'input-with-icon' : ''}`}
          {...rest}
        />
      </div>
      {hint && !error && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error-msg">{error}</p>}
    </div>
  )
}
