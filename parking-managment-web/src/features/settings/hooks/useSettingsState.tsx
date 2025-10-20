import { useState } from 'react';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import type { SettingsTab } from '../types';

export function useSettingsState() {
  const [activeTab, setActiveTab] = useState<SettingsTab['id']>('profile');
  const { t } = useTypedTranslation();

  const tabs: SettingsTab[] = [
    {
      id: 'profile',
      label: t('settings.tabs.profile'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'parking-lots',
      label: t('settings.tabs.parkingLots'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return {
    activeTab,
    setActiveTab,
    tabs,
  };
}
