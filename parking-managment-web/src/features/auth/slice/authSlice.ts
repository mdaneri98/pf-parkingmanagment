import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from '../../../shared/types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  roleValidationError: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    setCredentials(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.roleValidationError = null;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    setRoleValidationError(state, action: PayloadAction<string>) {
      state.roleValidationError = action.payload;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.roleValidationError = null;
    },
  },
});

export const { startLoading, stopLoading, setCredentials, setUser, setRoleValidationError, clearSession } = slice.actions;
export const authReducer = slice.reducer;


