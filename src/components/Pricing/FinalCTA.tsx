
import React from 'react';
import { Button } from '@/components/ui/button';

interface FinalCTAProps {
  onButtonClick: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onButtonClick }) => {
  return (
    <div className="text-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-12 border border-blue-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Ready to prove your PM instincts?
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Join thousands of product managers building real skills through daily practice. 
        Start free, upgrade when ready, get certified when you're confident.
      </p>
      <Button 
        onClick={onButtonClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium animate-pulse whitespace-nowrap !text-white force-white-text"
        style={{ color: 'white !important' }}
      >
        <span className="text-white">Start Building Your Skills Today</span>
      </Button>
      <p className="text-sm text-gray-500 mt-4">
        No credit card required • Free forever plan available • 10x more affordable than traditional certifications
      </p>
    </div>
  );
};

export default FinalCTA;
