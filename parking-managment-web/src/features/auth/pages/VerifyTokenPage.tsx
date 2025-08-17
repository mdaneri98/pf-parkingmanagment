import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useVerifyRecoveryTokenMutation } from '../api/authApi';

type FormValues = { token: string };

export function VerifyTokenPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [verifyToken, { isLoading, isSuccess, error }] = useVerifyRecoveryTokenMutation();

  const onSubmit = async (values: FormValues) => {
    await verifyToken(values).unwrap();
  };

  return (
    <AuthCard title="Verify token">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Token</label>
          <input className="w-full border rounded px-3 py-2 bg-transparent" {...register('token', { required: true })} />
        </div>
        {error ? <p className="text-sm text-red-600">Invalid token</p> : null}
        {isSuccess ? <p className="text-sm text-green-600">Token valid</p> : null}
        <button type="submit" disabled={isSubmitting || isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2">
          {isSubmitting || isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      <div className="mt-4 text-sm flex justify-between">
        <span />
        <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link>
      </div>
    </AuthCard>
  );
}


