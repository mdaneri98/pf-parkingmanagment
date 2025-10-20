import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/components';
import { useParkingLotMutations } from '@parking/hooks/mutations/useParkingLotMutations';
import { CreateParkingLotModal } from '@parking/components/lots';
import { useState } from 'react';
import type { CreateParkingLotRequest } from '@parking/types';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

export function WelcomePage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { mutations, loadingStates } = useParkingLotMutations();
  const { t } = useTypedTranslation();

  const handleCreateLot = async (data: CreateParkingLotRequest) => {
    await mutations.createLot(data, (createdLot) => {
      setIsCreateModalOpen(false);
      navigate(`/app/dashboard/${createdLot.id}`);
    });
  };

  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          {/* Welcome Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {t('parking.welcome.title')}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            {t('parking.welcome.message')}
          </p>

          {/* Create Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={loadingStates.createLot}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            leftIcon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            {loadingStates.createLot ? t('parking.welcome.creating') : t('parking.welcome.createFirstLot')}
          </Button>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{t('parking.welcome.manageSpots')}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-center">
                {t('parking.welcome.manageSpotsDesc')}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{t('parking.welcome.trackAnalytics')}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-center">
                {t('parking.welcome.trackAnalyticsDesc')}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{t('parking.welcome.setPricing')}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-center">
                {t('parking.welcome.setPricingDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Parking Lot Modal */}
      <CreateParkingLotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLot}
        isLoading={loadingStates.createLot}
      />
    </>
  );
}
