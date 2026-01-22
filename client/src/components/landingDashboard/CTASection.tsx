const CTASection = () => {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-linear-to-r from-primary to-[#8B5CF6] px-6 py-16 shadow-2xl sm:px-16 md:py-24">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-75 w-75 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-75 w-75 rounded-full bg-indigo-900/20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
            Monetize your empty space today.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-white/90 font-medium">
            Join thousands of hosts earning extra income by renting out their
            classrooms, studios, and meeting rooms.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105 active:scale-95">
              List your Space
            </button>
            <button className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
              Learn How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
