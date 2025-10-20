import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { selectAuthUser } from '@auth/selectors';
import { useUpdateUserMutation } from '@auth/api/authApi';
import { setUser } from '@auth/slice/authSlice';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import { cn } from '@shared/utils';

interface LanguageSwitcherProps {
  className?: string;
  vertical?: boolean; // Layout direction
}

export function LanguageSwitcher({ className, vertical = false }: LanguageSwitcherProps) {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();
  const { t } = useTypedTranslation();
  const [updateUser, { isLoading: isUpdatingLanguage }] = useUpdateUserMutation();

  const handleLanguageChange = async (newLang: 'en' | 'es') => {
    if (!user || user.userDetail.lang === newLang) return;

    try {
      const response = await updateUser({
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        userDetail: {
          phone: user.userDetail.phone,
          address: user.userDetail.address,
          lang: newLang,
        },
      }).unwrap();

      if (response.success && response.data) {
        dispatch(setUser(response.data));
        showNotification('success', t('settings.profile.languageChangedSuccess'));
      }
    } catch (error) {
      showNotification('error', t('settings.profile.languageChangedError'));
    }
  };

  if (!user) return null;

  const buttonClasses = cn(
    'px-3 py-2 text-sm rounded-md transition-colors',
    isUpdatingLanguage && 'opacity-50 cursor-not-allowed'
  );

  const activeButtonClasses = cn(
    buttonClasses,
    'bg-primary-600 text-white'
  );

  const inactiveButtonClasses = cn(
    buttonClasses,
    'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
  );

  return (
    <div className={cn('flex items-center', vertical ? 'flex-col space-y-2' : 'space-x-2', className)}>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isUpdatingLanguage}
        className={user.userDetail.lang === 'en' ? activeButtonClasses : inactiveButtonClasses}
      >
        {t('userProfile.english')}
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        disabled={isUpdatingLanguage}
        className={user.userDetail.lang === 'es' ? activeButtonClasses : inactiveButtonClasses}
      >
        {t('userProfile.spanish')}
      </button>
    </div>
  );
}
