import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import useForm from '@/hooks/useForm';
import { validateEmail } from '@/utils/validators';
import { ROUTES } from '@/constants/routes';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button/Button';

const Login = () => {
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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-heading text-neutral-900 mb-1.5">Welcome Back</h2>
        <p className="text-neutral-500 text-sm">Sign in to find your perfect partner</p>
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
          autoComplete="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
          rightAddon={
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
            >
              Forgot?
            </Link>
          }
        />

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
