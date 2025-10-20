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
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

type FormValues = { email: string; password: string };

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error: authError } = useAppSelector(selectAuth);
  const { handleError, getUserFriendlyMessage } = useErrorHandler();
  const { showNotification } = useNotification();
  const { t } = useTypedTranslation();

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
          showNotification('error', t('auth.login.errorLoadProfile'));
          return;
        }
      } catch (userError) {
        console.error(userError);
        authInitializationService.clearStoredCredentials();
        showNotification('error', t('auth.login.errorLoadProfileRetry'));
        return;
      }

      dispatch(setInitialized(true));
      showNotification('success', t('auth.login.successMessage'));
      navigate('/app', { replace: true });
    } catch (loginError) {
      const appError = handleError(loginError, { component: 'LoginPage', action: 'login_attempt' });
      showNotification('error', getUserFriendlyMessage(appError));
    }
  };

  return (
      <AuthCard title={t('auth.login.title')}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
              type="email"
              label={t('auth.login.email')}
              placeholder={t('auth.login.emailPlaceholder')}
              {...register('email', { required: true })}
          />

          <div>
            <Input
                type={showPassword ? 'text' : 'password'}
                label={t('auth.login.password')}
                placeholder={t('auth.login.passwordPlaceholder')}
                {...register('password', { required: true })}
            />
            <label className="flex items-center mt-1 text-sm select-none">
              <input
                  type="checkbox"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
              />
              {t('auth.login.showPassword')}
            </label>
          </div>


          <Button type="submit" className="w-full" size="lg" loading={isSubmitting || isLoading}>
            {t('auth.login.submitButton')}
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link to="/register" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200">
            {t('auth.login.createAccount')}
          </Link>
          <Link to="/password-recovery" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200">
            {t('auth.login.forgotPassword')}
          </Link>
        </div>
      </AuthCard>
  );
}
