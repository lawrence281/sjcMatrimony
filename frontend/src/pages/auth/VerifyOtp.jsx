import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthAPI from '@/api/authAPI';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ROUTES } from '@/constants/routes';
import OtpInput from '@/components/common/OtpInput/OtpInput';
import Button from '@/components/common/Button/Button';

const VerifyOtp = () => {
  const { login } = useAuth(); // Actually verify-otp returns the access token, so we can login the user directly or redirect to login. Wait, verify-otp in authController log in the user and return tokens! So we can set tokens and login.
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user credentials passed from Register or Login redirection
  const userId = location.state?.userId || null;
  const email = location.state?.email || null;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  // Focus redirection if state variables are missing
  useEffect(() => {
    if (!email) {
      showToast('Please sign in or register to verify your account.', 'warning');
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [email, navigate, showToast]);

  // Countdown timer for resend OTP cooldown
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await AuthAPI.verifyOtp({ userId, otp });
      if (res.data?.success) {
        showToast('Account verified successfully!', 'success');

        // Automatically store token and trigger context update
        const { accessToken, user } = res.data.data;
        localStorage.setItem('accessToken', accessToken);
        window.dispatchEvent(new CustomEvent('auth:session-restored', { detail: { accessToken, user } }));

        // Redirect to dashboard
        const redirect = user.role === 'client' ? ROUTES.CLIENT.DASHBOARD : ROUTES.ADMIN.DASHBOARD;
        // Simple window refresh or navigate depending on how context syncs
        // Because of the state, we reload to ensure full socket connection is booted
        window.location.href = redirect;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await AuthAPI.resendOtp({ userId, email });
      showToast('A new OTP has been sent to your email.', 'success');
      setCooldown(60);
      setOtp('');
      setError('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resend OTP.', 'error');
    }
  };

  if (!email) return null;

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">✉️</div>
        <h2 className="text-2xl font-bold font-heading text-neutral-900 mb-1.5">Verify Email</h2>
        <p className="text-neutral-500 text-sm">
          We've sent a 6-digit verification code to <br />
          <strong className="text-neutral-800 font-semibold">{email}</strong>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <OtpInput length={6} value={otp} onChange={setOtp} error={error} />

        <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-4">
          Verify Code
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-500">
        Didn't receive the email?{' '}
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className={`font-semibold transition-colors ${
            cooldown > 0 ? 'text-neutral-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-700'
          }`}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
