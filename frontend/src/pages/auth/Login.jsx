import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import useForm from '@/hooks/useForm';
import { validateEmail } from '@/utils/validators';
import { ROUTES } from '@/constants/routes';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button/Button';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to original target route or dashboard depending on user role
  const from = location.state?.from?.pathname || null;

  const validate = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    if (!values.password) errors.password = 'Password is required.';
    return errors;
  };

  const onSubmit = async (values) => {
    const res = await login({ email: values.email, password: values.password });

    if (res.success) {
      showToast('Logged in successfully.', 'success');
      const target = from || (res.user.role === 'client' ? ROUTES.CLIENT.DASHBOARD : ROUTES.ADMIN.DASHBOARD);
      navigate(target, { replace: true });
    } else {
      // Check if email is not verified (error code/status handle)
      if (res.message.includes('verify') || res.message.toLowerCase().includes('otp')) {
        showToast(res.message, 'warning');
        // Redirect to OTP verification page, passing userId & email
        navigate(ROUTES.VERIFY_OTP, { state: { email: values.email } });
      } else {
        showToast(res.message || 'Login failed.', 'error');
      }
    }
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    validate,
    onSubmit
  );

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-heading text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-slate-500 text-sm">Sign in to find your perfect partner</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {errors.form && (
          <div className="p-4 bg-danger-light border border-danger/20 text-danger-dark rounded-xl text-xs font-medium" role="alert">
            {errors.form}
          </div>
        )}

        <Input
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div>
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            }
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-2">
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-500">
        New to Matrimony?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-600 hover:text-primary-700 font-semibold">
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
