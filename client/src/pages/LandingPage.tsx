import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landingDashboard/Hero';
import FeatureCard from '@/components/landingDashboard/FeatureCard';
import { FEATURES } from '../data/constant';
import Footer from '@/components/Footer';
import FeatureSpaceSection from '@/components/landingDashboard/FeatureSpaceSection';
import CTASection from '@/components/landingDashboard/CTASection';

const toIsoFromDateAndHour = (date: string, hour: string) => {
  if (!date || !hour) return '';
  const composed = `${date}T${hour}:00`;
  const localDateTime = new Date(composed);
  if (Number.isNaN(localDateTime.getTime())) return '';
  return localDateTime.toISOString();
};

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('11:00');

  const searchStartTimeIso = toIsoFromDateAndHour(searchDate, startHour);
  const searchEndTimeIso = toIsoFromDateAndHour(searchDate, endHour);

  const handleSearchSubmit = () => {
    const section = document.getElementById('popular-near-you');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="grow">
        <Hero
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchDate={searchDate}
          startHour={startHour}
          endHour={endHour}
          onSearchDateChange={setSearchDate}
          onStartHourChange={setStartHour}
          onEndHourChange={setEndHour}
          onSearchSubmit={handleSearchSubmit}
        />

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {FEATURES.map(feature => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>
        </section>
        <FeatureSpaceSection
          searchQuery={searchQuery}
          startTime={searchStartTimeIso}
          endTime={searchEndTimeIso}
          sectionId="popular-near-you"
        />

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
