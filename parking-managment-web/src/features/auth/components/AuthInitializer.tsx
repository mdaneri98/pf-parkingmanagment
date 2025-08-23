import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useLazyGetUserByEmailQuery } from '../../users/api/usersApi';
import { setUser } from '../slice/authSlice';
import { selectAuth } from '../selectors';
import { decodeJWT } from '../../../shared/utils/jwt';
import { useLogger } from '../../../hooks/useLogger';

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const { accessToken, isAuthenticated, user, isInitialized } = useAppSelector(selectAuth);
  const [triggerGetUserByEmail] = useLazyGetUserByEmailQuery();
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

      const tokenPayload = decodeJWT(accessToken);
      
      if (tokenPayload?.sub) {
        log.debug('Token decoded successfully, fetching user data', {
          userId: tokenPayload.sub,
          tokenExpiry: tokenPayload.exp ? new Date(tokenPayload.exp * 1000).toISOString() : undefined,
          tokenIssuedAt: tokenPayload.iat ? new Date(tokenPayload.iat * 1000).toISOString() : undefined,
        });

        const startTime = Date.now();
        
        triggerGetUserByEmail(tokenPayload.sub)
          .unwrap()
          .then((userRes) => {
            const responseTime = Date.now() - startTime;
            const u = userRes.data;
            
            log.info('User data restored successfully', {
              userId: u.id,
              email: u.email,
              responseTime,
              userRole: 'manager', // Default role since UserResponse doesn't have role
            });

            dispatch(setUser({ 
              id: u.id, 
              email: u.email, 
              firstName: u.firstName, 
              lastName: u.lastName, 
              role: 'manager' as const 
            }));

            log.authEvent('user_session_restored', {
              userId: u.id,
              email: u.email,
              method: 'stored_token',
              responseTime,
            });
          })
          .catch((error) => {
            const responseTime = Date.now() - startTime;
            
            log.error('Failed to restore user data from stored token', {
              userId: tokenPayload.sub,
              responseTime,
              error: error?.message || error?.toString(),
              status: error?.status,
            });

            // Log additional context for debugging
            if (error?.data) {
              log.debug('Error response data', {
                userId: tokenPayload.sub,
                errorData: error.data,
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
  }, [accessToken, isAuthenticated, user, isInitialized, dispatch, triggerGetUserByEmail, log]);

  return null;
}
