import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthAPI from '@/api/authAPI';
import { useToast } from '@/context/ToastContext';
import useForm from '@/hooks/useForm';
import { validatePassword } from '@/utils/validators';
import { ROUTES } from '@/constants/routes';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button/Button';

const ResetPassword = () => {
  const { token } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};

    const passwordError = validatePassword(values.newPassword);
    if (passwordError) errors.newPassword = passwordError;

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const onSubmit = async (values) => {
    const res = await AuthAPI.resetPassword({
      token,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });

    if (res.data?.success) {
      showToast('Password reset successful! Please sign in with your new password.', 'success');
      navigate(ROUTES.LOGIN, { replace: true });
    } else {
      showToast(res.data?.message || 'Failed to reset password.', 'error');
    }
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { newPassword: '', confirmPassword: '' },
    validate,
    onSubmit
  );

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="text-2xl font-bold font-heading text-neutral-900 mb-1.5">Reset Password</h2>
        <p className="text-neutral-500 text-sm">Create a new secure password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errors.form && (
          <div className="p-3.5 bg-danger-light border border-danger text-danger-dark rounded-xl text-xs font-medium" role="alert">
            {errors.form}
          </div>
        )}

        <Input
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          value={values.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          required
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-4">
          Reset Password
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-500">
        Back to{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
