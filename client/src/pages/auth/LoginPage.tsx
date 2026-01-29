import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import logoGoogle from '/logoGoogle.jpg';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LeftSide from '@/components/auth/LeftSide';
import { authAPI, type AuthError } from '@/apis/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserEmail = useUserStore((state) => state.setEmail);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      toast.success('Login successful! Welcome back! 🎉');

      if (data.accessToken) {
        setUserEmail(data.user.email);
        setAccessToken(data.accessToken);
      }

      setTimeout(() => {
        navigate('/');
      }, 1000);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const errorMessage =
          (error.response?.data as AuthError)?.message ||
          'Login failed. Please check your credentials.';
        toast.error(errorMessage);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
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

          <Button className="group flex w-full cursor-pointer items-center justify-center rounded-xl h-14 px-5 bg-white dark:bg-[#1c1e31] border border-[#e5e7eb] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#252840] hover:border-[#d1d5db] dark:hover:border-gray-600 shadow-[0_10px_20px_-10px_rgba(99,102,241,0.3)] hover:shadow-[0_20px_25px_-12px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300 gap-3 relative overflow-hidden">
            <img alt="Google Logo" className="w-5 h-5" src={logoGoogle} />
            <span className="text-[#0e0d1b] dark:text-white font-semibold text-base">
              Sign in with Google
            </span>
          </Button>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="shrink-0 mx-4 text-gray-400 text-sm font-medium">
              Or sign in with email
            </span>
            <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
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
                    type="password"
                    placeholder="Enter your password"
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
