import { useNavigate } from "react-router-dom";

const LeftSide = () => {
  const navigate = useNavigate();

  return (
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
          <div className="flex items-center gap-2 text-white hover:cursor-pointer" onClick={() => navigate('/')}>
            <span className="flex text-2xl font-black tracking-tight items-center">
              <img
                alt="Logo trang"
                className="w-13 h-10"
                src="logomautrang.png"
              />
              SPACEPOCKER
            </span>
          </div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-lg mt-auto border border-white/20 shadow-2xl hover:bg-white/15 hover:border-white/30 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] hover:scale-[1.02] transition-all duration-500 ease-out">
          <div className="flex flex-col gap-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-[#FFD700] text-xl">
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-white text-lg font-normal leading-relaxed">
              "Spacepocker completely transformed how we manage our university's
              study pods. The booking flow is seamless and the interface is
              stunning."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0epEoHMaSCepXaFlkmUci9EDtDD6rkcHs27ywPLuiG_khCWZdafrMxlY_ztx2LZ53n5tx8oIb0hwhFlh-YCdbIjszn2MoUqIHbEAn6eWI4Nre90j9v7YGbNsg87eSB3zllYLETa93EKtB4GsdDUIg8hFIQletuN6mu1SPjM3WpXHEbrQgvMI05XXWiEfWTafzgSejXoJzj2Y-oF7ebiQQUR4Gj_hXvhS-P65_1JAVa7dVll6I8SFmWwKxty0KAz8RiuyNlP_7odPC')`,
                }}
              ></div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Elena Rodriguez
                </p>
                <p className="text-white/60 text-xs">Campus Facilities Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default LeftSide;