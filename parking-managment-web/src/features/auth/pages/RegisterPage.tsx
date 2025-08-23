import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { useRegisterMutation } from '../api/authApi';
import { Button, Input, Alert, AlertDescription } from '@shared/ui/components';

type FormValues = { firstName: string; lastName: string; email: string; password: string };

export function RegisterPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  const [doRegister, { isLoading, error, isSuccess }] = useRegisterMutation();

  const onSubmit = async (values: FormValues) => {
    await doRegister(values).unwrap();
  };

  return (
    <AuthCard title="Create account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First name"
            placeholder="Enter your first name"
            {...register('firstName', { required: true })}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <Input
            label="Last name"
            placeholder="Enter your last name"
            {...register('lastName', { required: true })}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </div>
        
        <Input
          type="email"
          label="Email address"
          placeholder="Enter your email"
          {...register('email', { required: true })}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="Create a strong password"
          helpText="Use at least 8 characters with a mix of letters, numbers and symbols"
          {...register('password', { required: true })}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        {error && (
          <Alert variant="error">
            <AlertDescription>
              Registration failed. Please check your information and try again.
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert variant="success">
            <AlertDescription>
              Registration successful! You can now sign in with your credentials.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          loading={isSubmitting || isLoading}
        >
          Create account
        </Button>
      </form>
      
      <div className="flex justify-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link 
          to="/login" 
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </AuthCard>
  );
}


