import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import logoGoogle from '/logoGoogle.jpg';
import InputField from '@/components/common/InputField';
import { Button } from '@/components/ui/button';
import LeftSide from '@/components/auth/LeftSide';

const RegisterPage = () => {
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
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-5">
              <InputField
                label="Full Name"
                id="name"
                type="text"
                placeholder="Enter your full name"
                icon={<User size={24} />}
              />
              <InputField
                label="Work Email"
                id="email"
                type="email"
                placeholder="name@company.com"
                icon={<Mail size={24} />}
              />
              <InputField
                label="Password"
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                icon={<Lock size={24} />}
              />
            </div>

            <Button className="mt-1 w-full h-14 rounded-xl bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_20px_25px_-12px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-300 flex items-center justify-center gap-2 group">
              <span>Get Started</span>
              <ArrowRight size={20} />
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
