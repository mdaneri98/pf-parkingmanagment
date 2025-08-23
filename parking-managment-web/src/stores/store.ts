import { configureStore } from '@reduxjs/toolkit';
import { authReducer, initializeAuthFromStorage } from '../features/auth/slice/authSlice';
import { authApi } from '../features/auth/api/authApi';
import { usersApi } from '../features/users/api/usersApi';
import { parkingApi } from '../features/parking/api/parkingApi';
import { parkingReducer } from '../features/parking/slice/parkingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [parkingApi.reducerPath]: parkingApi.reducer,
    parking: parkingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(parkingApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Function to initialize auth from stored tokens
export const initializeAuth = () => {
  console.log('[initializeAuth] Dispatching auth initialization...');
  store.dispatch(initializeAuthFromStorage());
};


