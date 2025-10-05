import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useLoginMutation, authApi } from '@auth/api/authApi';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { selectAuth } from '../selectors';
import { setAuthError, setInitialized, setCredentials, setUser } from '@auth/slice/authSlice';
import { useErrorHandler, ErrorCodes } from '@shared/utils/errorHandling';
import { Button, Input, Alert, AlertDescription } from '@shared/ui/components';
import { authInitializationService } from '@auth/services/authInitializationService';

type FormValues = { email: string; password: string };

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error: authError } = useAppSelector(selectAuth);
  const { handleError, getUserFriendlyMessage } = useErrorHandler();

  useEffect(() => {
    dispatch(setAuthError(null));
  }, [dispatch]);

  const onSubmit = async (values: FormValues) => {
    try {
      // 1. Call login API
      const res = await login(values).unwrap();

      // 2. Persist credentials in storage
      authInitializationService.persistCredentials(
        res.data.token,
        res.data.refreshToken
      );

      // 3. Update Redux store with tokens
      dispatch(setCredentials({
        accessToken: res.data.token,
        refreshToken: res.data.refreshToken,
      }));

      // 4. Fetch current user data
      try {
        const userResponse = await dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
        if (userResponse.success && userResponse.data) {
          dispatch(setUser(userResponse.data));
        } else {
          authInitializationService.clearStoredCredentials();
          dispatch(setAuthError('Login failed: Unable to load user profile.'));
          return;
        }
      } catch (userError) {
        console.error('Failed to fetch user data after login:', userError);
        authInitializationService.clearStoredCredentials();
        dispatch(setAuthError('Login failed: Unable to load user profile. Please try again.'));
        return;
      }

      // 5. Set initialized flag
      dispatch(setInitialized(true));

      // 6. Redirect to dashboard
      navigate('/app', { replace: true });
    } catch (loginError) {
      const appError = handleError(loginError, {
        component: 'LoginPage',
        action: 'login_attempt',
      });
      dispatch(setAuthError(getUserFriendlyMessage(appError)));
    }
  };

  return (
    <AuthCard title="Sign in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          type="email"
          label="Email address"
          placeholder="Enter your email"
          {...register('email', { required: true })}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          {...register('password', { required: true })}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        {authError && (
          <Alert variant="error">
            <AlertDescription>
              {authError || 'Login failed. Please check your credentials and try again.'}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isSubmitting || isLoading}
        >
          Sign in
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link
          to="/register"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
        >
          Create an account
        </Link>
        <Link
          to="/password-recovery"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
        >
          Forgot password?
        </Link>
      </div>
    </AuthCard>
  );
}
