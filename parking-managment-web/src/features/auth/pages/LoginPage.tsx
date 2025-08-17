import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useLoginMutation } from '../api/authApi';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setCredentials } from '../slice/authSlice';

type FormValues = { email: string; password: string };

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (values: FormValues) => {
    const res = await login(values).unwrap();
    dispatch(setCredentials({ accessToken: res.data.token, refreshToken: res.data.refreshToken }));
  };

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


