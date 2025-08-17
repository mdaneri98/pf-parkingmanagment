import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useLoginMutation } from '../api/authApi';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setCredentials, setUser } from '../slice/authSlice';
import { useLazyGetUserByEmailQuery } from '../../users/api/usersApi';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectAuth, selectIsAuthenticated } from '../selectors';
import { useEffect } from 'react';

type FormValues = { email: string; password: string };

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [triggerGetUserByEmail] = useLazyGetUserByEmailQuery();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { user } = useAppSelector(selectAuth);

  const onSubmit = async (values: FormValues) => {
    const res = await login(values).unwrap();
    dispatch(setCredentials({ accessToken: res.data.token, refreshToken: res.data.refreshToken }));
    try {
      const userRes = await triggerGetUserByEmail(res.data.email).unwrap();
      const u = userRes.data;
      dispatch(setUser({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: 'manager' }));
    } catch {}
    navigate('/app', { replace: true });
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


