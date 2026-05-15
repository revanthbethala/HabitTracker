import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/api/services/auth';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // The backend register endpoint probably expects name, email, password
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password
      };
      
      const response = await authService.register(payload);
      if (response.success || response.data) { // Assuming success returns true or data
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
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
        <h2 className="text-3xl font-bold font-heading text-[var(--text-h)] mb-2">Create an account</h2>
        <p className="text-[var(--text)]">Start your journey to better habits today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          {...register('name')}
          error={errors.name?.message}
        />

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

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          className="w-full mt-4"
          isLoading={isSubmitting}
          size="lg"
        >
          Sign up
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--text)]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
};
