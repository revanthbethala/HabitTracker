import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/api/services/auth';
import { useAuth } from '@/features/auth/AuthContext';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        login(response.data.accessToken, response.data.refreshToken, response.data.user);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--bg)] p-8 rounded-2xl shadow-[var(--shadow)] border border-[var(--border)]"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold font-heading text-[var(--text-h)] mb-2">Welcome back</h2>
        <p className="text-[var(--text)]">Enter your credentials to access your habits</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isSubmitting}
          size="lg"
        >
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--text)]">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-[var(--accent)] hover:underline">
          Sign up
        </Link>
      </div>
    </motion.div>
  );
};
