/**
 * Auth Redux Slice
 * Manages authentication state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  LoginRequest,
  RegisterRequest,
  User,
  Vehicle,
} from '@types';
import { authService, userService } from '../services';

// ============================================================================
// Types
// ============================================================================

export interface AuthState {
  user: User | null;
  vehicles: Vehicle[];
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: AuthState = {
  user: null,
  vehicles: [],
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Login user
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      console.error('[Login Error]', error);
      const errorMessage =
        error?.error?.message ||
        error?.message ||
        JSON.stringify(error) ||
        'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  },
);

/**
 * Register user
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    { data, isManager = false }: { data: RegisterRequest; isManager?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.register(data, isManager);
      return response;
    } catch (error: any) {
      console.error('[Register Error]', error);
      const errorMessage =
        error?.error?.message ||
        error?.message ||
        JSON.stringify(error) ||
        'Registration failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  },
);

/**
 * Logout user
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      } else {
        await authService.clearAuth();
      }

      return null;
    } catch (error: any) {
      // Even if logout fails on the server, clear local state
      await authService.clearAuth();
      return rejectWithValue(
        error?.error?.message || 'Logout failed.',
      );
    }
  },
);

/**
 * Fetch current user profile
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await userService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error?.error?.message || 'Failed to fetch user profile.',
      );
    }
  },
);

/**
 * Fetch user vehicles
 */
export const fetchUserVehicles = createAsyncThunk(
  'auth/fetchUserVehicles',
  async (userId: number, { rejectWithValue }) => {
    try {
      const vehicles = await userService.getUserVehicles(userId);
      return vehicles;
    } catch (error: any) {
      return rejectWithValue(
        error?.error?.message || 'Failed to fetch vehicles.',
      );
    }
  },
);

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (
    {
      userId,
      data,
    }: {
      userId: number;
      data: { firstName: string; lastName: string; email: string };
    },
    { rejectWithValue },
  ) => {
    try {
      const user = await userService.updateUser(userId, data);
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error?.error?.message || 'Failed to update profile.',
      );
    }
  },
);

// ============================================================================
// Slice
// ============================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set authentication tokens (for hydration from storage)
     */
    setAuthTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set vehicles
     */
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ========================================================================
    // Login
    // ========================================================================
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });

    // ========================================================================
    // Register
    // ========================================================================
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });

    // ========================================================================
    // Logout
    // ========================================================================
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        return { ...initialState }; // Reset to initial state
      })
      .addCase(logoutUser.rejected, (state) => {
        return { ...initialState }; // Reset even on error
      });

    // ========================================================================
    // Fetch Current User
    // ========================================================================
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // Fetch User Vehicles
    // ========================================================================
    builder
      .addCase(fetchUserVehicles.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserVehicles.fulfilled, (state, action) => {
        state.vehicles = action.payload;
        state.error = null;
      })
      .addCase(fetchUserVehicles.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // ========================================================================
    // Update User Profile
    // ========================================================================
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================================================
// Actions
// ============================================================================

export const { setAuthTokens, clearError, setVehicles } = authSlice.actions;

// ============================================================================
// Selectors
// ============================================================================

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectVehicles = (state: { auth: AuthState }) =>
  state.auth.vehicles;

// ============================================================================
// Export
// ============================================================================

export default authSlice.reducer;
