import { store } from '@stores/store';
import { setCredentials, setUser } from '@features/auth/slice/authSlice';
import { usersApi } from '@features/users/api/usersApi';
import { validateAccessToken, hasAllowedRole } from './jwt';
import { logger } from './logger';
import { authService } from '@shared/services/authService';
import type { AuthUser } from '@shared/types/auth';

export interface SessionInitResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export async function initializeUserSession(
  accessToken: string,
  refreshToken: string,
  email: string
): Promise<SessionInitResult> {
  const startTime = Date.now();

  try {
    logger.info('Initializing user session', {
      email,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });

    // 1. Store credentials
    store.dispatch(setCredentials({ accessToken, refreshToken }));

    // 2. Ensure we have a valid access token 
    const validAccessToken = await authService.getValidAccessToken();
    if (!validAccessToken) {
      const error = 'Unable to obtain valid access token';
      logger.warn(error, { email });
      return { success: false, error };
    }

    // 3. Validate token payload + expiration
    const { isValid, isExpired, payload } = validateAccessToken(validAccessToken);
    if (!isValid || isExpired || !payload?.sub) {
      const error = 'Invalid or expired access token';
      logger.warn(error, { email });
      return { success: false, error };
    }

    // 4. Role check
    const roles = payload.roles || [];
    if (!hasAllowedRole(roles, ['MANAGER'])) {
      const error = 'Access denied. Only manager accounts can log in.';
      logger.warn('Role validation failed', { email, roles });
      return { success: false, error };
    }

    // 5. Fetch user details
    const userResult = await store.dispatch(
      usersApi.endpoints.getUserByEmail.initiate(email)
    );

    if ('error' in userResult) {
      const error = 'Failed to fetch user details';
      logger.error(error, { email, error: userResult.error });
      return { success: false, error };
    }

    const userData = userResult.data?.data;
    if (!userData) {
      const error = 'Invalid user data received';
      logger.error(error, { email });
      return { success: false, error };
    }

    const user: AuthUser = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'manager',
      imageUrl: userData.imageUrl,
    };

    // 6. Save user in store
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
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error during session initialization';

    logger.error('Session initialization failed', {
      email,
      error: errorMessage,
      duration,
    });

    return { success: false, error: errorMessage };
  }
}
