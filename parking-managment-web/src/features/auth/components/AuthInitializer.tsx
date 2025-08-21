import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useLazyGetUserByEmailQuery } from '../../users/api/usersApi';
import { setUser } from '../slice/authSlice';
import { selectAuth } from '../selectors';
import { decodeJWT } from '../../../shared/utils/jwt';

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const { accessToken, isAuthenticated, user } = useAppSelector(selectAuth);
  const [triggerGetUserByEmail] = useLazyGetUserByEmailQuery();

  useEffect(() => {
    if (accessToken && isAuthenticated && !user) {
      const tokenPayload = decodeJWT(accessToken);
      if (tokenPayload?.sub) {
        triggerGetUserByEmail(tokenPayload.sub)
          .unwrap()
          .then((userRes) => {
            const u = userRes.data;
            dispatch(setUser({ 
              id: u.id, 
              email: u.email, 
              firstName: u.firstName, 
              lastName: u.lastName, 
              role: 'manager' as const 
            }));
          })
          .catch((error) => {
            console.error('Failed to restore user data:', error);
          });
      }
    }
  }, [accessToken, isAuthenticated, user, dispatch, triggerGetUserByEmail]);

  return null;
}
