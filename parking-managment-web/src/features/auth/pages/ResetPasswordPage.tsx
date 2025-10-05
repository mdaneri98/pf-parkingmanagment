import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useResetPasswordMutation } from '../api/authApi';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { setAuthError, setAuthLoading } from '../slice/authSlice';
import { selectAuthError, selectAuthLoading } from '../selectors';
import { Button, Input, Alert, AlertDescription } from '@shared/ui/components';

type FormValues = { token: string; newPassword: string };

export function ResetPasswordPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [resetPassword, { isLoading: isApiLoading }] = useResetPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useAppDispatch();

  const authError = useAppSelector(selectAuthError);
  const authLoading = useAppSelector(selectAuthLoading);

  const onSubmit = async (values: FormValues) => {
    try {
      dispatch(setAuthError(null));
      dispatch(setAuthLoading(true));
      setIsSuccess(false);
      
      await resetPassword(values).unwrap();
      setIsSuccess(true);
    } catch (error) {
      dispatch(setAuthError('Password reset failed. Please check your token and try again.'));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <AuthCard title="Reset password">
      <div className="space-y-5">
        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Enter your reset token and create a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Reset token"
            placeholder="Enter the token from your email"
            {...register('token', { required: true })}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            }
          />

          <Input
            type="password"
            label="New password"
            placeholder="Create a strong password"
            helpText="Use at least 8 characters with a mix of letters, numbers and symbols"
            {...register('newPassword', { required: true })}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          {authError && (
            <Alert variant="error">
              <AlertDescription>
                {authError}
              </AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <Alert variant="success">
              <AlertDescription>
                Password reset successfully! You can now sign in with your new password.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            loading={isSubmitting || authLoading || isApiLoading}
          >
            Reset password
          </Button>
        </form>
        
        <div className="flex justify-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link 
            to="/login" 
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}


