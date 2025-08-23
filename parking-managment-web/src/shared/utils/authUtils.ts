import { store } from '@stores/store';
import { setCredentials, setUser, setError } from '@features/auth/slice/authSlice';
import { usersApi } from '@features/users/api/usersApi';
import { decodeJWT, extractUserRole } from './jwt';
import { logger } from './logger';
import type { AuthUser } from '@shared/types/auth';

/**
 * Centralized authentication utilities to eliminate code duplication
 * and race conditions between LoginPage and AuthInitializer
 */

export interface AuthInitResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Complete authentication flow: set tokens + fetch user data
 * Used by both login flow and auth restoration from storage
 */
export async function initializeUserSession(
  accessToken: string, 
  refreshToken: string, 
  email: string
): Promise<AuthInitResult> {
  const startTime = Date.now();
  
  try {
    logger.info('Initializing user session', {
      email,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });

    // Step 1: Validate and extract role from JWT
    const tokenPayload = decodeJWT(accessToken);
    if (!tokenPayload?.sub) {
      const error = 'Invalid token payload';
      logger.warn(error, { email, tokenLength: accessToken.length });
      return { success: false, error };
    }

    const userRole = extractUserRole(accessToken);
    if (!userRole || userRole !== 'manager') {
      const error = 'Access denied. Only manager accounts can log in.';
      logger.warn('Role validation failed', { 
        email, 
        extractedRole: userRole,
        expectedRole: 'manager'
      });
      return { success: false, error };
    }

    // Step 2: Set credentials in store (this persists to localStorage)
    store.dispatch(setCredentials({ accessToken, refreshToken }));
    logger.debug('Credentials set in store', { email });

    // Step 3: Fetch user details
    const userResult = await store.dispatch(
      usersApi.endpoints.getUserByEmail.initiate(email)
    );

    if ('error' in userResult) {
      const error = 'Failed to fetch user details';
      logger.error(error, { 
        email, 
        error: userResult.error,
        duration: Date.now() - startTime
      });
      return { success: false, error };
    }

    // Step 4: Create complete user object
    const userData = userResult.data.data;
    const user: AuthUser = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userRole as 'manager',
      imageUrl: userData.imageUrl,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    // Step 5: Set user in store
    store.dispatch(setUser(user));

    const duration = Date.now() - startTime;
    logger.authEvent('User session initialized successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
      duration,
    });

    return { success: true, user };

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during session initialization';
    
    logger.error('Session initialization failed', {
      email,
      error: errorMessage,
      duration,
    });

    return { success: false, error: errorMessage };
  }
}

/**
 * Handle authentication errors consistently
 */
export function handleAuthError(error: string, context?: Record<string, any>) {
  logger.error('Authentication error', { error, ...context });
  store.dispatch(setError(error));
}

/**
 * Extract email from token payload safely
 */
export function extractEmailFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.sub || null;
}
