import React from 'react';
import { Hero } from '../components/home/Hero';
import { HowItWorks } from '../components/home/HowItWorks';
import { Disclaimer } from '../components/common/Disclaimer';

interface HomeProps {
  onNavigateToUpload: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToUpload }) => {
  return (
    <div className="space-y-4">
      {/* Hero section */}
      <Hero onUploadClick={onNavigateToUpload} />

      {/* How it works */}
      <HowItWorks />

      {/* Medical Safety Disclaimer */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <Disclaimer />
      </section>
    </div>
  );
};
