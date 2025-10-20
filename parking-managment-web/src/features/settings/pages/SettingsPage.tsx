import { useSettingsState } from '../hooks';
import { UserProfileForm, ParkingLotManagement, LanguageSwitcher } from '../components';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import { useAppSelector } from '@hooks/useAppSelector';
import { selectAuthUser } from '@auth/selectors';

export function SettingsPage() {
  const { activeTab, setActiveTab, tabs } = useSettingsState();
  const { t } = useTypedTranslation();
  const user = useAppSelector(selectAuthUser);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {t('settings.title')}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('settings.description')}
            </p>
          </div>
          
          {/* Language Switcher */}
          {user && (
            <div className="flex flex-col items-end">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t('settings.profile.language')}
              </label>
              <LanguageSwitcher />
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'profile' && <UserProfileForm />}
        {activeTab === 'parking-lots' && <ParkingLotManagement />}
      </div>
    </div>
  );
}
