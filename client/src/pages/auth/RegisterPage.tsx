import React from 'react';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import logoGoogle from '/logoGoogle.jpg';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      {/* Left Panel: Branding & Visuals (Hidden on mobile) */}
      <div
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTUKlrbWweEhTIsMCDyHh9Quo2Ja6uVORCyxaldKUOLGvESW_KOi3X5ueAuN1WqHE8K_Qt3b1nHMY-S3ukomJw3SpgDiDO83nkdUu1B5raK_m4UEDmPrE0ZL3OSKuPuXA-yMwGL5Bx4hM_WXCa0CY6LIVyEznBqz8VsEuYOEkMLoJrUxnpwGklW-4E2VRKe1SaBO1L3TFOLXTKJsqtOul-hSc_OmXGXnJ1VH3WiXndSKlta6gCxW9Yjyq1LgUi3H5nSxRhnN3zFcy7')`,
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-[#1c1e31]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/30 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>

        {/* Brand Logo */}
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 text-white">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl glass-card"></div>
            <span className="text-3xl font-black tracking-tighter">
              SPACEPOCKER
            </span>
          </div>
        </div>

        {/* Testimonial Card */}
        <div
          className="relative z-10 glass-card rounded-2xl p-8 max-w-xl mt-auto animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex flex-col gap-5">
            <div className="flex gap-1 text-[#FFD700]">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-white text-2xl font-medium leading-relaxed tracking-tight">
              "Spacepocker completely transformed how we manage our university's
              study pods. The booking flow is seamless and the interface is
              stunning."
            </p>
            <div className="flex items-center gap-5 mt-4 pt-6 border-t border-white/10">
              <div
                className="w-14 h-14 rounded-full ring-2 ring-white/30 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0epEoHMaSCepXaFlkmUci9EDtDD6rkcHs27ywPLuiG_khCWZdafrMxlY_ztx2LZ53n5tx8oIb0hwhFlh-YCdbIjszn2MoUqIHbEAn6eWI4Nre90j9v7YGbNsg87eSB3zllYLETa93EKtB4GsdDUIg8hFIQletuN6mu1SPjM3WpXHEbrQgvMI05XXWiEfWTafzgSejXoJzj2Y-oF7ebiQQUR4Gj_hXvhS-P65_1JAVa7dVll6I8SFmWwKxty0KAz8RiuyNlP_7odPC')`,
                }}
              />
              <div>
                <p className="text-white font-bold text-lg">Elena Rodriguez</p>
                <p className="text-white/70 text-base">Campus HCM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Registration Form */}
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
                href="#"
                className="text-primary font-black hover:underline underline-offset-4"
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

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  icon: string | React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type,
  placeholder,
  icon,
}) => (
  <div className="group flex flex-col gap-2">
    <Label className="text-[#0e0d1b] text-sm font-bold ml-1" htmlFor={id}>
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full h-12 px-5 rounded-xl border border-gray-200 bg-gray-50/50 text-[#0e0d1b] placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 shadow-sm"
      />
      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
        {typeof icon === 'string' ? (
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        ) : (
          icon
        )}
      </div>
    </div>
  </div>
);

export default RegisterPage;
