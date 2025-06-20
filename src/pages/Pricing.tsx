
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PricingHeader from '@/components/Pricing/PricingHeader';
import PricingCard from '@/components/Pricing/PricingCard';
import TeamSection from '@/components/Pricing/TeamSection';
import ValueProposition from '@/components/Pricing/ValueProposition';
import PricingFAQ from '@/components/Pricing/PricingFAQ';
import FinalCTA from '@/components/Pricing/FinalCTA';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleUpgrade = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <PricingHeader />

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-16">
          <PricingCard plan="free" onButtonClick={handleGetStarted} />
          <PricingCard plan="premium" onButtonClick={handleUpgrade} />
          <PricingCard plan="certification" onButtonClick={handleUpgrade} />
          <PricingCard plan="cert-review" onButtonClick={handleUpgrade} />
        </div>

        <TeamSection onButtonClick={handleUpgrade} />
        <ValueProposition />
        <PricingFAQ />
        <FinalCTA onButtonClick={handleGetStarted} />
      </div>
    </div>
  );
};

export default Pricing;
