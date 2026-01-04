/**
 * Async Storage Service
 * Wrapper around AsyncStorage for type-safe key-value storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// Storage Service
// ============================================================================

class StorageService {
  /**
   * Get an item from storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`[Storage] Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Set an item in storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`[Storage] Error setting item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove an item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage] Error removing item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a JSON object from storage
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const value = await this.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`[Storage] Error getting object ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a JSON object in storage
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      await this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[Storage] Error setting object ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[Storage] Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('[Storage] Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Get multiple items
   */
  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('[Storage] Error getting multiple items:', error);
      return [];
    }
  }

  /**
   * Set multiple items
   */
  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('[Storage] Error setting multiple items:', error);
      throw error;
    }
  }

  /**
   * Remove multiple items
   */
  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('[Storage] Error removing multiple items:', error);
      throw error;
    }
  }
}

// ============================================================================
// Export
// ============================================================================

export const storage = new StorageService();
export default storage;
