import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useLoginMutation } from '../api/authApi';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { setError } from '../slice/authSlice';
import { useAppSelector } from '@hooks/useAppSelector';
import { selectAuth, selectIsAuthenticated } from '../selectors';
import { useEffect } from 'react';
import { useErrorHandler, ErrorCodes } from '@shared/utils/errorHandling';

type FormValues = { email: string; password: string };

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { user, error: authError } = useAppSelector(selectAuth);
  const { handleError, getUserFriendlyMessage } = useErrorHandler();

  const onSubmit = async (values: FormValues) => {
    try {
      // Step 1: Login and get JWT token
      const res = await login(values).unwrap();
      
      // Step 2: Initialize complete user session (tokens + user data + role validation)
      const { initializeUserSession } = await import('@shared/utils/authUtils');
      const result = await initializeUserSession(
        res.data.token,
        res.data.refreshToken,
        res.data.email
      );

      if (!result.success) {
        const error = handleError(result.error || 'Authentication failed', {
          component: 'LoginPage',
          action: 'session_initialization',
          code: ErrorCodes.AUTH_ACCESS_DENIED,
        });
        dispatch(setError(getUserFriendlyMessage(error)));
        return;
      }
      
      // Step 3: Redirect to dashboard page
      navigate('/app', { replace: true });
    } catch (loginError) {
      const error = handleError(loginError, {
        component: 'LoginPage',
        action: 'login_attempt',
      });
      dispatch(setError(getUserFriendlyMessage(error)));
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <AuthCard title="Sign in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2 bg-transparent" {...register('email', { required: true })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2 bg-transparent" {...register('password', { required: true })} />
        </div>
        {error ? <p className="text-sm text-red-600">Login failed</p> : null}
        {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
        <button type="submit" disabled={isSubmitting || isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2">
          {isSubmitting || isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <div className="mt-4 text-sm flex justify-between">
        <Link to="/register" className="text-blue-600 hover:underline">Create account</Link>
        <Link to="/password-recovery" className="text-blue-600 hover:underline">Forgot password?</Link>
      </div>
    </AuthCard>
  );
}


