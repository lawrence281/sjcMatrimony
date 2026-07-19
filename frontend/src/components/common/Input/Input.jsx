import { forwardRef } from 'react';

/**
 * Reusable Input component with label, hint, and error support.
 *
 * @example
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="you@example.com"
 *   error={errors.email}
 *   hint="We'll never share your email."
 * />
 */
const Input = forwardRef(
  (
    {
      label,
      hint,
      error,
      id,
      type = 'text',
      required = false,
      className = '',
      containerClassName = '',
      leftAddon = null,
      rightAddon = null,
      ...rest
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            aria-invalid={!!error}
            className={[
              'input',
              leftAddon ? 'pl-10' : '',
              rightAddon ? 'pr-10' : '',
              error ? 'input-error' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />

          {rightAddon && (
            <div className="absolute right-3.5 flex items-center text-neutral-400">
              {rightAddon}
            </div>
          )}
        </div>

        {hint && !error && (
          <p id={`${inputId}-hint`} className="input-hint">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="input-error-msg" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
