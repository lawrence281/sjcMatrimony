/**
 * SelectField — reusable native select dropdown
 */
export default function SelectField({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select…',
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
      <div className="form-select-wrap">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`form-select ${error ? 'input-error' : ''}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => {
            const isObj = typeof opt === 'object'
            const val = isObj ? opt.value : opt
            const lbl = isObj ? opt.label : opt
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            )
          })}
        </select>
        <span className="form-select-arrow">▾</span>
      </div>
      {error && <p className="form-error-msg">{error}</p>}
    </div>
  )
}
