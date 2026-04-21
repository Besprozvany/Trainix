import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

interface AuthPageProps {
  mode: 'login' | 'register';
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [apiError, setApiError] = useState('');

  const isRegister = mode === 'register';

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setApiError('');
    try {
      if (isRegister) {
        await register(data.name, data.email, data.password);
      } else {
        await login(data.email, data.password);
      }
      navigate('/');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message =
        axiosError.response?.data?.message ?? 'Something went wrong. Please try again.';
      setApiError(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <h1 className="text-2xl font-bold text-[#e8e8f0]">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-[#8b8ba0]">
            {isRegister ? 'Start your fitness journey today' : 'Sign in to your Trainix account'}
          </p>
        </div>

        <div className="rounded-2xl border border-[#2e2e3e] bg-[#18181f] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {isRegister && (
              <Input
                label="Full name"
                placeholder="Alex Novak"
                error={errors.name?.message}
                {...registerField('name')}
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...registerField('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...registerField('password')}
            />

            {apiError && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {apiError}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full justify-center">
              {isRegister ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8b8ba0]">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <a
              href={isRegister ? '/login' : '/register'}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isRegister ? 'Sign in' : 'Sign up'}
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
