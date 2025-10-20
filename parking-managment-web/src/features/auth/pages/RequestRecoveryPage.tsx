import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useRequestPasswordRecoveryMutation } from '../api/authApi';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { setAuthError, setAuthLoading } from '../slice/authSlice';
import { selectAuthError, selectAuthLoading } from '../selectors';
import { Button, Input } from '@shared/ui/components';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

type FormValues = { email: string };

export function RequestRecoveryPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [requestRecovery, { isLoading: isApiLoading }] = useRequestPasswordRecoveryMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();
  const { t } = useTypedTranslation();

  const authError = useAppSelector(selectAuthError);
  const authLoading = useAppSelector(selectAuthLoading);

  const onSubmit = async (values: FormValues) => {
    try {
      dispatch(setAuthError(null));
      dispatch(setAuthLoading(true));
      setIsSuccess(false);
      
      await requestRecovery(values).unwrap();
      setIsSuccess(true);
      showNotification('success', t('auth.passwordRecovery.successMessage'));
    } catch (error) {
      showNotification('error', t('auth.passwordRecovery.errorMessage'));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <AuthCard title={t('auth.passwordRecovery.requestTitle')}>
      <div className="space-y-5">
        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('auth.passwordRecovery.requestDescription')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            type="email"
            label={t('auth.passwordRecovery.email')}
            placeholder={t('auth.passwordRecovery.emailPlaceholder')}
            {...register('email', { required: true })}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />


          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            loading={isSubmitting || authLoading || isApiLoading}
          >
            {t('auth.passwordRecovery.submitButton')}
          </Button>
        </form>
        
        <div className="flex justify-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link 
            to="/login" 
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
          >
            {t('auth.passwordRecovery.backToLogin')}
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}


