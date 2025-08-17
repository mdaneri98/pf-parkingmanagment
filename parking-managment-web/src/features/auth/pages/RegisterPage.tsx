import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useRegisterMutation } from '../api/authApi';

type FormValues = { firstName: string; lastName: string; email: string; password: string };

export function RegisterPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [doRegister, { isLoading, error, isSuccess }] = useRegisterMutation();

  const onSubmit = async (values: FormValues) => {
    await doRegister({ ...values, manager: false }).unwrap();
  };

  return (
    <AuthCard title="Create account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">First name</label>
            <input className="w-full border rounded px-3 py-2 bg-transparent" {...register('firstName', { required: true })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Last name</label>
            <input className="w-full border rounded px-3 py-2 bg-transparent" {...register('lastName', { required: true })} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2 bg-transparent" {...register('email', { required: true })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2 bg-transparent" {...register('password', { required: true })} />
        </div>
        {error ? <p className="text-sm text-red-600">Registration failed</p> : null}
        {isSuccess ? <p className="text-sm text-green-600">Registration successful. You can sign in now.</p> : null}
        <button type="submit" disabled={isSubmitting || isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2">
          {isSubmitting || isLoading ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <div className="mt-4 text-sm flex justify-between">
        <span />
        <Link to="/login" className="text-blue-600 hover:underline">Already have an account?</Link>
      </div>
    </AuthCard>
  );
}


