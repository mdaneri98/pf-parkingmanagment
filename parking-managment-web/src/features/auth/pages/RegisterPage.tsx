import { useForm } from 'react-hook-form';
import {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useRegisterMutation } from '../api/authApi';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { setAuthError, setAuthLoading } from '../slice/authSlice';
import { selectAuthError, selectAuthLoading } from '../selectors';
import { Button, Input } from '@shared/ui/components';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

type FormValues = { firstName: string; lastName: string; email: string; password: string };

export function RegisterPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [doRegister, { isLoading: isApiLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { t } = useTypedTranslation();

  const authError = useAppSelector(selectAuthError);
  const authLoading = useAppSelector(selectAuthLoading);

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: FormValues) => {
    try {
      dispatch(setAuthError(null));
      dispatch(setAuthLoading(true));
      
      await doRegister(values).unwrap();
      
      showNotification('success', t('auth.register.successMessage'));
      navigate("/login", { replace: true });
    } catch (error) {
      showNotification('error', t('auth.register.errorMessage'));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <AuthCard title={t('auth.register.title')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('auth.register.firstName')}
            placeholder={t('auth.register.firstNamePlaceholder')}
            {...register('firstName', { required: true })}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <Input
            label={t('auth.register.lastName')}
            placeholder={t('auth.register.lastNamePlaceholder')}
            {...register('lastName', { required: true })}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </div>
        
        <Input
          type="email"
          label={t('auth.register.email')}
          placeholder={t('auth.register.emailPlaceholder')}
          {...register('email', { required: true })}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />
        
        <Input
          type={showPassword ? 'text' : 'password'}
          label={t('auth.register.password')}
          placeholder={t('auth.register.passwordPlaceholder')}
          helpText={t('auth.register.passwordHelp')}
          {...register('password', { required: true })}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
          <label className="flex items-center mt-1 text-sm select-none">
              <input
                  type="checkbox"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
              />
              {t('auth.register.showPassword')}
          </label>



        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          loading={isSubmitting || authLoading || isApiLoading}
        >
          {t('auth.register.submitButton')}
        </Button>
      </form>
      
      <div className="flex justify-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link 
          to="/login" 
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
        >
          {t('auth.register.alreadyHaveAccount')}
        </Link>
      </div>
    </AuthCard>
  );
}


