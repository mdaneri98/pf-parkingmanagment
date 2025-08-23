import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from '@shared/types';
import { validateStoredTokens, decodeJWT, extractUserRole } from '@shared/utils/jwt';
import { appStorage } from '@shared/utils/storage';
import { logger } from '@shared/utils/logger';

// Async thunk to initialize auth from stored tokens
export const initializeAuthFromStorage = createAsyncThunk(
  'auth/initializeFromStorage',
  async (_, { dispatch }) => {
    logger.debug('Starting auth initialization from stored tokens');
    const validation = validateStoredTokens();
    logger.debug('Token validation result', validation);
    
    // If we have both tokens (even if expired), try to initialize
    if (validation.accessToken && validation.refreshToken) {
      logger.info('Found stored tokens, initializing authentication state');
      
      // Set credentials in state (even if expired - let refresh logic handle it)
      dispatch(setCredentials({ 
        accessToken: validation.accessToken, 
        refreshToken: validation.refreshToken 
      }));

      // Extract user email from JWT payload
      const tokenPayload = decodeJWT(validation.accessToken);
      if (!tokenPayload?.sub) {
        logger.warn('Invalid token payload found, clearing stored auth');
        appStorage.clearAuth();
        return { success: false };
      }

      logger.info('Authentication initialization successful', {
        hasAccessToken: !!validation.accessToken,
        hasRefreshToken: !!validation.refreshToken,
        userRole: validation.userRole || 'manager'
      });
      return { 
        success: true, 
        accessToken: validation.accessToken,
        refreshToken: validation.refreshToken,
        userRole: validation.userRole || 'manager'
      };
    }
    
    logger.debug('No stored tokens found, skipping authentication initialization');
    return { success: false };
  }
);

// Async thunk to restore user data
export const restoreUserData = createAsyncThunk(
  'auth/restoreUserData',
  async (email: string, { dispatch }) => {
    try {
      return { success: true, email };
    } catch (error) {
      return { success: false, error };
    }
  }
);

const initialState: AuthState & { isInitialized: boolean } = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false
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
      state.error = null;
      
      // Persist tokens to storage
      const userRole = extractUserRole(action.payload.accessToken);
      appStorage.setAuth(action.payload.accessToken, action.payload.refreshToken, userRole);
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      
      // Clear stored tokens on error
      appStorage.clearAuth();
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear stored tokens
      appStorage.clearAuth();
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuthFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuthFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload.success && action.payload.accessToken && action.payload.refreshToken) {
          state.isAuthenticated = true;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(initializeAuthFromStorage.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      })
      .addCase(restoreUserData.fulfilled, (state, action) => {
        if (action.payload.success) {
          // User data restoration completed successfully
          // Additional logic can be added here if needed
        }
      });
  },
});

export const { 
  startLoading, 
  stopLoading, 
  setCredentials, 
  setUser, 
  setError, 
  clearSession,
  setInitialized 
} = slice.actions;

export const authReducer = slice.reducer;


