
import React from 'react';

const PricingHeader = () => {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Your safest space to grow as a PM
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
        Master product management through daily micro-challenges. Practice real scenarios, 
        build confidence, and get certified — all at your own pace.
      </p>
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 max-w-4xl mx-auto border border-blue-200">
        <p className="text-lg font-semibold text-gray-800 mb-2">
          For 10x less than a traditional PM certification, prove what actually matters: your product judgment.
        </p>
        <p className="text-gray-700">
          You don't need €1500 and 8 weeks. You need 20 minutes a day and a sharp mind.
        </p>
      </div>
    </div>
  );
};

export default PricingHeader;
