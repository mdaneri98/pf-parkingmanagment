import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useUpdateUserMutation } from '@auth/api/authApi';
import { selectAuthUser } from '@auth/selectors';
import { Input, Button } from '@shared/ui/components';
import { ImagePreview } from '@shared/components/ImagePreview';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import type { UserProfileFormData } from '../types';

export function UserProfileForm() {
  const { t } = useTypedTranslation();
  const { showNotification } = useNotification();
  const user = useAppSelector(selectAuthUser);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<UserProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      imageUrl: user?.imageUrl || '',
      userDetail: {
        phone: user?.userDetail?.phone || '',
        address: user?.userDetail?.address || '',
      },
    },
  });

  const imageUrl = watch('imageUrl');

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
        userDetail: {
          phone: user.userDetail?.phone || '',
          address: user.userDetail?.address || '',
        },
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserProfileFormData) => {
    if (!user?.id) return;

    try {
      await updateUser({
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
        userDetail: {
          phone: data.userDetail.phone,
          address: data.userDetail.address,
        },
      }).unwrap();

      showNotification('success', t('settings.profile.successMessage'));
    } catch (error) {
      showNotification('error', t('settings.profile.errorMessage'));
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600 dark:text-neutral-400">
          {t('settings.profile.userNotAvailable')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-elevated">
        <div className="card-body">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {t('settings.profile.title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('settings.profile.description')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden fields for firstName and lastName */}
            <input type="hidden" {...register('firstName')} />
            <input type="hidden" {...register('lastName')} />
            
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {imageUrl ? (
                  <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                    <ImagePreview
                      src={imageUrl}
                      alt={t('settings.profile.profileImage')}
                      size="md"
                      clickable={true}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <Input
                label={t('settings.profile.profileImageUrl')}
                placeholder={t('settings.profile.profileImagePlaceholder')}
                {...register('imageUrl')}
                error={errors.imageUrl?.message}
                helpText={t('settings.profile.profileImageHelp')}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>

            {/* Read-only fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('settings.profile.firstName')}</label>
                <div className="input bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                  {user.firstName}
                </div>
                <p className="help-text">{t('settings.profile.readOnlyHelp')}</p>
              </div>
              
              <div>
                <label className="label">{t('settings.profile.lastName')}</label>
                <div className="input bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                  {user.lastName}
                </div>
                <p className="help-text">{t('settings.profile.readOnlyHelp')}</p>
              </div>
            </div>

            <div>
              <label className="label">{t('settings.profile.email')}</label>
              <div className="input bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                {user.email}
              </div>
              <p className="help-text">{t('settings.profile.readOnlyEmailHelp')}</p>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('settings.profile.phone')}
                placeholder={t('settings.profile.phonePlaceholder')}
                {...register('userDetail.phone')}
                error={errors.userDetail?.phone?.message}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />

              <Input
                label={t('settings.profile.address')}
                placeholder={t('settings.profile.addressPlaceholder')}
                {...register('userDetail.address')}
                error={errors.userDetail?.address?.message}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
            </div>


            {/* Submit button */}
            <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Button
                type="submit"
                disabled={!isDirty || isLoading}
                className="btn-primary"
              >
                {isLoading ? t('settings.profile.saving') : t('settings.profile.saveChanges')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
