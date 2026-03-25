import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LeftSide from '@/components/auth/LeftSide';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useSignup } from '@/hooks/auth/use-signup';
import { registerSchema, type RegisterFormData } from '@/validations/user/auth.validation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormData) => {
    signupMutation.mutate(data, {
      onSuccess: () => {
        setTimeout(() => navigate('/'), 1000);
      },
    });
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

          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-5">
              <div className="relative flex flex-col gap-2">
                <Label
                  htmlFor="name"
                  className="text-[#0e0d1b] text-base font-semibold"
                >
                  Full Name
                </Label>
                <div className="relative flex items-center">
                  <User
                    size={24}
                    className="absolute left-4 text-[#5c5ba8] pointer-events-none"
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className={`w-full h-14 pl-14 pr-5 text-lg rounded-xl border-2 transition-all duration-300 ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#e5e7eb] focus:border-[#6366F1]'
                    }`}
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  htmlFor="phone"
                  className="text-[#0e0d1b] text-base font-semibold"
                >
                  Phone Number
                </Label>
                <div className="relative flex items-center">
                  <Phone
                    size={24}
                    className="absolute left-4 text-[#5c5ba8] pointer-events-none"
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    className={`w-full h-14 pl-14 pr-5 text-lg rounded-xl border-2 transition-all duration-300 ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#e5e7eb] focus:border-[#6366F1]'
                    }`}
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
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
                    placeholder="Min. 8 characters"
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    className={`w-full h-14 pl-14 pr-14 text-lg rounded-xl border-2 transition-all duration-300 ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#e5e7eb] focus:border-[#6366F1]'
                    }`}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-4 text-[#5c5ba8] hover:text-[#6366F1] transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={22} />
                    ) : (
                      <Eye size={22} />
                    )}
                  </button>
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
              disabled={isSubmitting || signupMutation.isPending}
              className="mt-1 w-full h-14 rounded-xl bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_20px_25px_-12px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signupMutation.isPending ? (
                'Creating account...'
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
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
