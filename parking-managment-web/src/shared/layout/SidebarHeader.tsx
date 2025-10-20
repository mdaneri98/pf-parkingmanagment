import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  const { t } = useTypedTranslation();

  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-200/50 dark:border-neutral-700/50 bg-gradient-to-r from-primary-50/30 to-transparent dark:from-primary-900/10">
      {!collapsed && (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t('shared.sidebarHeader.appName')}
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {t('shared.sidebarHeader.subtitle')}
            </p>
          </div>
        </div>
      )}
      
      <button
        onClick={onToggle}
        className={`p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors ${
          collapsed ? 'mx-auto' : ''
        }`}
        title={collapsed ? t('shared.sidebarHeader.expandSidebar') : t('shared.sidebarHeader.collapseSidebar')}
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
