import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useLoginMutation, authApi } from '@auth/api/authApi';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { selectAuth } from '../selectors';
import { setAuthError, setInitialized, setCredentials, setUser } from '@auth/slice/authSlice';
import { useErrorHandler } from '@shared/utils/errorHandling';
import { Button, Input } from '@shared/ui/components';
import { authInitializationService } from '@auth/services/authInitializationService';
import { useNotification } from '@shared/contexts/NotificationContext';

type FormValues = { email: string; password: string };

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error: authError } = useAppSelector(selectAuth);
  const { handleError, getUserFriendlyMessage } = useErrorHandler();
  const { showNotification } = useNotification();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(setAuthError(null));
  }, [dispatch]);

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await login(values).unwrap();
      authInitializationService.persistCredentials(res.data.token, res.data.refreshToken);
      dispatch(setCredentials({ accessToken: res.data.token, refreshToken: res.data.refreshToken }));

      try {
        const userResponse = await dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
        if (userResponse.success && userResponse.data) {
          dispatch(setUser(userResponse.data));
        } else {
          authInitializationService.clearStoredCredentials();
          showNotification('error', 'Login failed: Unable to load user profile.');
          return;
        }
      } catch (userError) {
        console.error(userError);
        authInitializationService.clearStoredCredentials();
        showNotification('error', 'Login failed: Unable to load user profile. Please try again.');
        return;
      }

      dispatch(setInitialized(true));
      showNotification('success', 'Successfully signed in!');
      navigate('/app', { replace: true });
    } catch (loginError) {
      const appError = handleError(loginError, { component: 'LoginPage', action: 'login_attempt' });
      showNotification('error', getUserFriendlyMessage(appError));
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
          />

          <div>
            <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                {...register('password', { required: true })}
            />
            {/* Checkbox para mostrar contraseña */}
            <label className="flex items-center mt-1 text-sm select-none">
              <input
                  type="checkbox"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
              />
              Show password
            </label>
          </div>


          <Button type="submit" className="w-full" size="lg" loading={isSubmitting || isLoading}>
            Sign in
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link to="/register" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200">
            Create an account
          </Link>
          <Link to="/password-recovery" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200">
            Forgot password?
          </Link>
        </div>
      </AuthCard>
  );
}
