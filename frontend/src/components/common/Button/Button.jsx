import { forwardRef } from 'react';
import Loader from '../Loader/Loader';

/**
 * Reusable Button component with all variant support.
 *
 * @example
 * <Button variant="primary" size="md" isLoading={loading} onClick={handleClick}>
 *   Save Profile
 * </Button>
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon = null,
      rightIcon = null,
      fullWidth = false,
      type = 'button',
      className = '',
      onClick,
      ...rest
    },
    ref
  ) => {
    const variantClasses = {
      primary:   'btn-primary',
      secondary: 'btn-secondary',
      outline:   'btn-outline',
      ghost:     'btn-ghost',
      danger:    'btn-danger',
      link:      'text-primary-600 hover:underline font-medium text-sm',
    };

    const sizeClasses = {
      xs: 'btn-sm !text-xs !px-3 !py-1',
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };

    const classes = [
      variantClasses[variant] || 'btn-primary',
      sizeClasses[size] || '',
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || isLoading}
        onClick={onClick}
        {...rest}
      >
        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
