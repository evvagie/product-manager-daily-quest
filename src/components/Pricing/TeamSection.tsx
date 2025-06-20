
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TeamSectionProps {
  onButtonClick: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ onButtonClick }) => {
  return (
    <div className="mb-16">
      <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-300 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Team Training Package</h3>
          </div>
          <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
            Perfect for bootcamps, companies, and cohorts. Get your entire team certified with 
            group dashboards, progress tracking, and bulk certification.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">€250-500</div>
              <div className="text-sm text-gray-600">Custom pricing based on team size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Group Dashboard</div>
              <div className="text-sm text-gray-600">Track team progress in real-time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Bulk Certification</div>
              <div className="text-sm text-gray-600">Certify your entire cohort</div>
            </div>
          </div>
          <div className="text-center">
            <Button 
              onClick={onButtonClick}
              className="bg-gradient-to-r from-blue-400 to-red-400 hover:from-blue-500 hover:to-red-500 text-white px-8 py-3 text-lg font-medium whitespace-nowrap"
            >
              Contact for Team Pricing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSection;
