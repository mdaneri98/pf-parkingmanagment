import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useRequestPasswordRecoveryMutation } from '../api/authApi';

type FormValues = { email: string };

export function RequestRecoveryPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [requestRecovery, { isLoading, error, isSuccess }] = useRequestPasswordRecoveryMutation();

  const onSubmit = async (values: FormValues) => {
    await requestRecovery(values).unwrap();
  };

  return (
    <AuthCard title="Password recovery">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2 bg-transparent" {...register('email', { required: true })} />
        </div>
        {error ? <p className="text-sm text-red-600">Request failed</p> : null}
        {isSuccess ? <p className="text-sm text-green-600">Email sent if account exists.</p> : null}
        <button type="submit" disabled={isSubmitting || isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2">
          {isSubmitting || isLoading ? 'Sending...' : 'Send recovery link'}
        </button>
      </form>
      <div className="mt-4 text-sm flex justify-between">
        <span />
        <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link>
      </div>
    </AuthCard>
  );
}


