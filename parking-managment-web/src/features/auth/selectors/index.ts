import type { RootState } from '../../../stores/store';

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthTokens = (state: RootState) => ({
  accessToken: state.auth.accessToken,
  refreshToken: state.auth.refreshToken,
});
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthInitialized = (state: RootState) => state.auth.isInitialized;


