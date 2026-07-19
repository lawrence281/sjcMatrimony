import { Link, useNavigate } from 'react-router-dom';
import AuthAPI from '@/api/authAPI';
import { useToast } from '@/context/ToastContext';
import useForm from '@/hooks/useForm';
import { validateEmail, validatePhone, validatePassword } from '@/utils/validators';
import { ROUTES } from '@/constants/routes';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button/Button';

const Register = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};

    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    const phoneError = validatePhone(values.phone);
    if (phoneError) errors.phone = phoneError;

    const passwordError = validatePassword(values.password);
    if (passwordError) errors.password = passwordError;

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!values.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms and Conditions.';
    }

    return errors;
  };

  const onSubmit = async (values) => {
    // 1. Call register endpoint
    const res = await AuthAPI.register({
      email: values.email,
      phone: values.phone,
      password: values.password,
    });

    if (res.data?.success) {
      showToast('Registration successful! Please verify the OTP sent to your email.', 'success');
      // Pass userId and email to verify OTP screen
      navigate(ROUTES.VERIFY_OTP, {
        state: { userId: res.data.data.userId, email: values.email },
      });
    } else {
      showToast(res.data?.message || 'Registration failed.', 'error');
    }
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false },
    validate,
    onSubmit
  );

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-heading text-neutral-900 mb-1.5">Create Account</h2>
        <p className="text-neutral-500 text-sm">Join us and start matching today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errors.form && (
          <div className="p-3.5 bg-danger-light border border-danger text-danger-dark rounded-xl text-xs font-medium" role="alert">
            {errors.form}
          </div>
        )}

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Mobile Number (India)"
          name="phone"
          type="tel"
          placeholder="9876543210"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        {/* Terms Agreement */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="inline-flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={values.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:underline font-semibold">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:underline font-semibold">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-danger" role="alert">
              {errors.agreeTerms}
            </p>
          )}
        </div>

        <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-4">
          Register
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
