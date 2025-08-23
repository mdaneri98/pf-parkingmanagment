import { useEffect } from 'react';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useLogger } from '@hooks/useLogger';
import { setUser } from '../slice/authSlice';
import { selectAuth } from '../selectors';
import { decodeJWT } from '@shared/utils/jwt';

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken, isAuthenticated, user, isInitialized } = useAppSelector(selectAuth);

  const log = useLogger();

  useEffect(() => {
    log.componentMount('AuthInitializer', { 
      hasAccessToken: !!accessToken, 
      isAuthenticated, 
      hasUser: !!user,
      isInitialized,
    });

    return () => {
      log.componentUnmount('AuthInitializer');
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      log.debug('Auth not yet initialized, waiting...', {
        isInitialized,
        hasAccessToken: !!accessToken,
        isAuthenticated,
        hasUser: !!user,
      });
      return;
    }

    if (accessToken && isAuthenticated && !user) {
      log.info('Initializing user authentication from stored token', {
        hasToken: !!accessToken,
        tokenLength: accessToken.length,
        isAuthenticated,
        hasUser: !!user,
      });

      // Extract email from token for user session initialization
      const tokenPayload = decodeJWT(accessToken);
      
      if (tokenPayload?.sub) {
        log.debug('Token decoded successfully, initializing session', {
          userId: tokenPayload.sub,
          tokenExpiry: tokenPayload.exp ? new Date(tokenPayload.exp * 1000).toISOString() : undefined,
          tokenIssuedAt: tokenPayload.iat ? new Date(tokenPayload.iat * 1000).toISOString() : undefined,
        });

        // Use centralized auth utility (no need to set credentials again, they're already set)
        import('@shared/utils/authUtils').then(async ({ initializeUserSession }) => {
          // Since credentials are already set, just use the current tokens
          
          const result = await initializeUserSession(
            accessToken,
            refreshToken!,
            tokenPayload.sub
          );

          if (result.success) {
            log.authEvent('user_session_restored', {
              userId: result.user?.id,
              email: result.user?.email,
              method: 'stored_token',
            });
          } else {
            log.error('Failed to restore user session from stored token', {
              userId: tokenPayload.sub,
              error: result.error,
            });
          }
        });
      } else {
        log.warn('Invalid token payload, cannot restore user session', {
          hasToken: !!accessToken,
          hasSub: !!tokenPayload?.sub,
          tokenPayload: tokenPayload ? Object.keys(tokenPayload) : undefined,
        });
      }
    } else {
      log.debug('Skipping user initialization', {
        hasAccessToken: !!accessToken,
        isAuthenticated,
        hasUser: !!user,
        isInitialized,
        reason: !isInitialized ? 'not_initialized' : !accessToken ? 'no_token' : !isAuthenticated ? 'not_authenticated' : 'user_exists',
      });
    }
  }, [accessToken, isAuthenticated, user, isInitialized, dispatch, log]);

  return null;
}
