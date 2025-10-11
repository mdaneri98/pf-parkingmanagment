import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from '@slices/appSlice';
import { authReducer } from '@auth/slice/authSlice';
import { authApi } from '@auth/api/authApi';
import { usersApi } from '@users/api/usersApi';
import { parkingApi } from '@parking/api/parkingApi';
import { parkingReducer } from '@parking/slice/parkingSlice';
import { pricesApi } from '@prices/api/pricesApi';
import { pricesReducer } from '@prices/slice/pricesSlice';
import { reservationApi } from '@reservations/api/reservationApi';
import { reservationsReducer } from '@reservations/slice/reservationsSlice';



export const store = configureStore({
  reducer: {
    // App
    app: appReducer,

    // Auth
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    // Parking
    parking: parkingReducer,
    [parkingApi.reducerPath]: parkingApi.reducer,

    // Prices
    prices: pricesReducer,
    [pricesApi.reducerPath]: pricesApi.reducer,

    // Users
    [usersApi.reducerPath]: usersApi.reducer,
    // Reservations
    reservations: reservationsReducer,
    [reservationApi.reducerPath]: reservationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(parkingApi.middleware)
      .concat(pricesApi.middleware)
      .concat(reservationApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;