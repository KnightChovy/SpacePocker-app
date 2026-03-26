import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LeftSide from '@/components/auth/LeftSide';
import { useLogin } from '@/hooks/auth/use-login';
import type { USER_DATA } from '@/types/auth/auth-type';
import {
  loginSchema,
  type LoginFormData,
} from '@/validations/user/auth.validation';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (user: USER_DATA) => {
        setTimeout(() => {
          switch (user.role) {
            case 'ADMIN':
              navigate('/admin/dashboard');
              break;
            case 'MANAGER':
              navigate('/manager/dashboard');
              break;
            case 'USER':
            default:
              navigate('/');
              break;
          }
        }, 1000);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      <LeftSide />

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white pl-6 pr-4 sm:pl-12 sm:pr-6 py-6 h-screen overflow-y-auto relative">
        <div className="w-full max-w-120 flex flex-col gap-6 relative z-10 py-8">
          <div className="lg:hidden flex items-center gap-2 text-primary mb-2">
            <span className="text-xl font-black tracking-tight text-[#0e0d1b] dark:text-white">
              SPACEPOCKER
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-[#0e0d1b] dark:text-white text-3xl md:text-4xl font-black leading-[1.1] tracking-[-0.02em]">
              Welcome back
            </h1>
            <p className="text-[#4d4c9a] dark:text-gray-400 text-base font-normal">
              Please enter your details to sign in.
            </p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-5">
              <div className="relative flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="text-[#0e0d1b] text-base font-semibold"
                >
                  Email
                </Label>
                <div className="relative flex items-center">
                  <Mail
                    size={24}
                    className="absolute left-4 text-[#5c5ba8] pointer-events-none"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`w-full h-14 pl-14 pr-14 text-lg rounded-xl border-2 transition-all duration-300 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#e5e7eb] focus:border-[#6366F1]'
                    }`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-4 text-[#5c5ba8] hover:text-[#6366F1] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-2">
                <a
                  className="text-primary font-bold hover:text-[#8B5CF6] hover:underline transition-colors"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              className="mt-4 w-full h-14 rounded-xl bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_20px_25px_-12px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
            >
              <span>
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
              </span>
              {!loginMutation.isPending && <LogIn />}
            </Button>
            <p className="text-center text-[#4d4c9a] text-base font-medium">
              Don't have an account?{' '}
              <a
                className="text-primary font-medium hover:text-[#8B5CF6] hover:underline transition-colors"
                href="/auth-register"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
        <div className="absolute bottom-10 text-xs text-gray-400 dark:text-gray-600 hidden md:block">
          © {new Date().getFullYear()} SPACEPOCKER
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
