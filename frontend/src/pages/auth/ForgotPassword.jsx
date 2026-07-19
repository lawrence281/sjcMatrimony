import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthAPI from '@/api/authAPI';
import { useToast } from '@/context/ToastContext';
import useForm from '@/hooks/useForm';
import { validateEmail } from '@/utils/validators';
import { ROUTES } from '@/constants/routes';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button/Button';

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [emailSent, setEmailSent] = useState(false);

  const validate = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    return errors;
  };

  const onSubmit = async (values) => {
    // Send email reset link
    await AuthAPI.forgotPassword({ email: values.email });
    setEmailSent(true);
    showToast('Reset instructions sent to your email.', 'success');
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '' },
    validate,
    onSubmit
  );

  return (
    <div className="w-full">
      {!emailSent ? (
        <>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔑</div>
            <h2 className="text-2xl font-bold font-heading text-neutral-900 mb-1.5">Forgot Password</h2>
            <p className="text-neutral-500 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
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

            <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-2">
              Send Reset Link
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold font-heading text-neutral-900 mb-2">Check Your Email</h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-6">
            We've sent a password reset link to <br />
            <strong className="text-neutral-800 font-semibold">{values.email}</strong>.<br />
            Please check your inbox (and spam folder) to reset your password.
          </p>
          <Button onClick={() => setEmailSent(false)} variant="outline" fullWidth>
            Try Another Email
          </Button>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-neutral-500">
        Back to{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
