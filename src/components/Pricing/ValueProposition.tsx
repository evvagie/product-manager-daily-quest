
import React from 'react';

const ValueProposition = () => {
  return (
    <div className="text-center mb-16 bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        A certification designed for real-world PM instincts — not just memory
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Traditional PM Certifications:</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• €1,500+ investment</li>
            <li>• 6-8 weeks of theory</li>
            <li>• Memorization-based testing</li>
            <li>• Limited practical application</li>
            <li>• One-size-fits-all approach</li>
          </ul>
        </div>
        <div className="text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Yuno Certification:</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• €89-149 investment</li>
            <li>• 20 minutes daily practice</li>
            <li>• Real scenario simulations</li>
            <li>• Hands-on decision making</li>
            <li>• Personalized learning path</li>
          </ul>
        </div>
      </div>
      <p className="text-lg text-gray-700 mt-6 max-w-3xl mx-auto">
        This isn't a formal diploma — it's proof that you can think like a PM when it matters. 
        Perfect for your CV, LinkedIn, or simply proving to yourself that you've got what it takes.
      </p>
    </div>
  );
};

export default ValueProposition;
