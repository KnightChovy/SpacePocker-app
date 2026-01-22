import Navbar from '@/components/Navbar';
import Hero from '@/components/landingDashboard/Hero';
import FeatureCard from '@/components/landingDashboard/FeatureCard';
import { FEATURES } from '../data/constant';
import Footer from '@/components/Footer';
import FeatureSpaceSection from '@/components/landingDashboard/FeatureSpaceSection';
import CTASection from '@/components/landingDashboard/CTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="grow">
        <Hero />

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>
        </section>

        <FeatureSpaceSection />

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
