/**
 * Redux Store Configuration
 * Configures store with Redux Toolkit and Redux Persist
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reducers
import authReducer from '@features/auth/slice/authSlice';

// ============================================================================
// Root Reducer
// ============================================================================

const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers here as features are implemented
  // parking: parkingReducer,
  // reservations: reservationsReducer,
  // etc.
});

// ============================================================================
// Persist Configuration
// ============================================================================

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [], // Don't persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ============================================================================
// Store Configuration
// ============================================================================

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

export const persistor = persistStore(store);

// ============================================================================
// Types
// ============================================================================

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ============================================================================
// Export
// ============================================================================

export default store;
