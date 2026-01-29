import { ArrowRight, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logoGoogle from '/logoGoogle.jpg';
import { Button } from '@/components/ui/button';
import LeftSide from '@/components/auth/LeftSide';
import { authAPI } from '@/apis/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      toast.success('Registration successful! Welcome aboard! 🎉');

      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }

      setTimeout(() => {
        navigate('/auth-login');
      }, 1500);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      <LeftSide />

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white pl-6 pr-4 sm:pl-12 sm:pr-6 py-6 h-screen overflow-y-auto relative">
        <div className="w-full max-w-120 flex flex-col gap-6 relative z-10 py-8">
          <header className="flex flex-col gap-2">
            <h1 className="text-[#0e0d1b] text-4xl font-black tracking-tight leading-none">
              Create your account
            </h1>
            <p className="text-[#5c5ba8] text-md font-medium tracking-tight">
              Unlock spaces that inspire creativity and collaboration.
            </p>
          </header>

          <Button className="group flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-5 bg-white dark:bg-[#1c1e31] border border-[#e5e7eb] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#252840] hover:border-[#d1d5db] dark:hover:border-gray-600 shadow-[0_10px_20px_-10px_rgba(99,102,241,0.3)] hover:shadow-[0_20px_25px_-12px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300 gap-3 relative overflow-hidden">
            <img alt="Google Logo" className="w-5 h-5" src={logoGoogle} />
            <span className="text-[#0e0d1b] font-bold text-base">
              Sign up with Google
            </span>
          </Button>

          <div className="relative flex items-center">
            <div className="grow border-t border-gray-200"></div>
            <span className="shrink-0 mx-6 text-gray-400 text-sm font-semibold uppercase tracking-widest">
              Or continue with email
            </span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-5">
              <div className="relative flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="text-[#0e0d1b] text-base font-semibold"
                >
                  Work Email
                </Label>
                <div className="relative flex items-center">
                  <Mail
                    size={24}
                    className="absolute left-4 text-[#5c5ba8] pointer-events-none"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full h-14 pl-14 pr-5 text-lg rounded-xl border-2 transition-all duration-300 ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#e5e7eb] focus:border-[#6366F1]'
                    }`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative flex flex-col gap-2">
                <Label
                  htmlFor="password"
                  className="text-[#0e0d1b] text-base font-semibold"
                >
                  Password
                </Label>
                <div className="relative flex items-center">
                  <Lock
                    size={24}
                    className="absolute left-4 text-[#5c5ba8] pointer-events-none"
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    className={`w-full h-14 pl-14 pr-5 text-lg rounded-xl border-2 transition-all duration-300 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#e5e7eb] focus:border-[#6366F1]'
                    }`}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative flex flex-col gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[#0e0d1b] text-base font-semibold"
                >
                  Confirm Password
                </Label>
                <div className="relative flex items-center">
                  <Lock
                    size={24}
                    className="absolute left-4 text-[#5c5ba8] pointer-events-none"
                  />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    className={`w-full h-14 pl-14 pr-5 text-lg rounded-xl border-2 transition-all duration-300 ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#e5e7eb] focus:border-[#6366F1]'
                    }`}
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || registerMutation.isPending}
              className="mt-1 w-full h-14 rounded-xl bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_20px_25px_-12px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {registerMutation.isPending
                  ? 'Creating Account...'
                  : 'Get Started'}
              </span>
              {!registerMutation.isPending && <ArrowRight size={20} />}
            </Button>

            <p className="text-center text-[#4d4c9a] text-base font-medium">
              Already have an account?{' '}
              <a
                className="text-primary font-bold hover:text-[#8B5CF6] hover:underline transition-colors"
                href="/auth-login"
              >
                Sign in
              </a>
            </p>
          </form>

          <div className="absolute lg:bottom-0 w-full text-center text-xs text-gray-400">
            © {new Date().getFullYear()} SPACEPOCKER
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
