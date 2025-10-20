import i18n from '../i18n/config';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '@stores/store';
import { logger } from '../utils/logger';

/**
 * Service to synchronize i18n language with Redux state and user preferences
 */
class I18nSyncService {
  private store: Store<RootState> | null = null;
  private unsubscribe: (() => void) | null = null;
  private currentLang: string | null = null;

  /**
   * Initialize the service with the Redux store
   */
  initialize(store: Store<RootState>): void {
    this.store = store;
    
    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      this.syncLanguage();
    });
    
    // Initial sync
    this.syncLanguage();
    
    logger.debug('I18nSyncService initialized');
  }

  /**
   * Synchronize language from Redux state to i18n
   */
  private syncLanguage(): void {
    if (!this.store) return;

    const state = this.store.getState();
    const user = state.auth.user;
    const userLang = user?.userDetail?.lang;

    // If user has a language preference and it's different from current
    if (userLang && userLang !== this.currentLang) {
      this.changeLanguage(userLang);
    }
  }

  /**
   * Change the current language
   */
  changeLanguage(lang: string): void {
    if (lang === this.currentLang) return;

    i18n.changeLanguage(lang)
      .then(() => {
        this.currentLang = lang;
        logger.debug(`Language changed to: ${lang}`);
      })
      .catch((error) => {
        logger.error('Failed to change language:', error);
      });
  }

  /**
   * Get the current language
   */
  getCurrentLanguage(): string {
    return i18n.language || 'en';
  }

  /**
   * Clean up subscriptions
   */
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.store = null;
    logger.debug('I18nSyncService cleaned up');
  }
}

export const i18nSyncService = new I18nSyncService();

