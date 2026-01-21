import React, { useState } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      //   onLogin(email);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      <div
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTUKlrbWweEhTIsMCDyHh9Quo2Ja6uVORCyxaldKUOLGvESW_KOi3X5ueAuN1WqHE8K_Qt3b1nHMY-S3ukomJw3SpgDiDO83nkdUu1B5raK_m4UEDmPrE0ZL3OSKuPuXA-yMwGL5Bx4hM_WXCa0CY6LIVyEznBqz8VsEuYOEkMLoJrUxnpwGklW-4E2VRKe1SaBO1L3TFOLXTKJsqtOul-hSc_OmXGXnJ1VH3WiXndSKlta6gCxW9Yjyq1LgUi3H5nSxRhnN3zFcy7')`,
        }}
      >
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-[#1c1e31]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/30 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>

        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg glass-card"></div>
            <span className="text-2xl font-black tracking-tight">
              SPACEPOCKER
            </span>
          </div>
        </div>

        <div className="relative z-10 glass-card rounded-xl p-6 max-w-lg mt-auto animate-fade-in-up hover:scale-[1.01] transition-transform duration-500 ease-out">
          <div className="flex flex-col gap-4">
            <div className="flex gap-1 text-[#FFD700]">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className="material-symbols-outlined text-[20px] fill-1"
                >
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-white text-xl font-medium leading-relaxed tracking-tight">
              "Spacepocker completely transformed how we manage our university's
              study pods. The booking flow is seamless and the interface is
              stunning."
            </p>
            <div className="flex items-center gap-4 mt-2 pt-4 border-t border-white/10">
              <div
                className="w-12 h-12 rounded-full ring-2 ring-white/30 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0epEoHMaSCepXaFlkmUci9EDtDD6rkcHs27ywPLuiG_khCWZdafrMxlY_ztx2LZ53n5tx8oIb0hwhFlh-YCdbIjszn2MoUqIHbEAn6eWI4Nre90j9v7YGbNsg87eSB3zllYLETa93EKtB4GsdDUIg8hFIQletuN6mu1SPjM3WpXHEbrQgvMI05XXWiEfWTafzgSejXoJzj2Y-oF7ebiQQUR4Gj_hXvhS-P65_1JAVa7dVll6I8SFmWwKxty0KAz8RiuyNlP_7odPC')`,
                }}
              ></div>
              <div>
                <p className="text-white font-bold text-base">
                  Elena Rodriguez
                </p>
                <p className="text-white/70 text-sm">Campus Facilities Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-6 sm:p-12 h-screen overflow-y-auto relative">
        <div className="w-full max-w-110 flex flex-col gap-8 relative z-10">
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
            <img
              alt="Google Logo"
              className="w-5 h-5"
              src="../../../public/google.png"
            />
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

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="group relative">
                <Label
                  className="block text-[#0e0d1b] dark:text-gray-200 text-sm font-semibold mb-2 ml-1"
                  htmlFor="email"
                >
                  Email
                </Label>
                <div className="relative">
                  <Input
                    className="peer w-full h-12 pl-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1c1e31] text-[#0e0d1b] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/80 focus:bg-white dark:focus:bg-[#1c1e31] transition-all duration-200 ease-out shadow-sm"
                    id="email"
                    placeholder="name@company.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 peer-focus:text-primary transition-colors">
                    <Mail />
                  </div>
                </div>
              </div>
              <div className="group relative">
                <Label
                  className="block text-[#0e0d1b] dark:text-gray-200 text-sm font-semibold mb-2 ml-1"
                  htmlFor="password"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    className="peer w-full h-12 pl-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1c1e31] text-[#0e0d1b] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/80 focus:bg-white dark:focus:bg-[#1c1e31] transition-all duration-200 ease-out shadow-sm"
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 peer-focus:text-primary transition-colors">
                    <Lock />
                  </div>
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
            </div>

            <Button
              className="mt-4 w-full h-14 rounded-xl bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_20px_25px_-12px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-300 flex items-center justify-center gap-2 group"
              type="submit"
            >
              <span>Sign In</span>
              <LogIn />
            </Button>
            <p className="text-center text-[#4d4c9a] dark:text-gray-400 text-sm mt-2">
              Don't have an account?{' '}
              <a
                className="text-primary font-bold hover:text-[#8B5CF6] hover:underline transition-colors"
                href="#"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
        <div className="absolute bottom-6 text-xs text-gray-400 dark:text-gray-600 hidden md:block">
          © {new Date().getFullYear()} SPACEPOCKER
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
