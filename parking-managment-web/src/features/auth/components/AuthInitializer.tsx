import { useEffect } from 'react';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useLogger } from '@hooks/useLogger';
import { setUser, setCredentials, setInitialized, startLoading, stopLoading } from '../slice/authSlice';
import { selectAuth } from '../selectors';
import { decodeJWT, validateStoredTokens } from '@shared/utils/jwt';

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
    if (isInitialized) {
      log.debug('Auth already initialized, skipping storage check');
      return;
    }

    log.debug('Starting auth initialization from stored tokens');
    dispatch(startLoading());

    try {
      const validation = validateStoredTokens();
      log.debug('Token validation result', validation);
      
      if (validation.accessToken && validation.refreshToken) {
        log.info('Found stored tokens, initializing authentication state');
        
        // Set credentials in state (even if expired - refresh logic will handle it)
        dispatch(setCredentials({ 
          accessToken: validation.accessToken, 
          refreshToken: validation.refreshToken 
        }));

        log.info('Authentication initialization successful', {
          hasAccessToken: !!validation.accessToken,
          hasRefreshToken: !!validation.refreshToken
        });
      } else {
        log.debug('No stored tokens found, skipping authentication initialization');
      }

      dispatch(setInitialized(true));
    } catch (error) {
      log.error('Error during auth initialization', { error });
      dispatch(setInitialized(true));
    } finally {
      dispatch(stopLoading());
    }
  }, [dispatch, log, isInitialized]);

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
