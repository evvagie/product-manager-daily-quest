
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Award, MessageSquare } from 'lucide-react';

interface PricingCardProps {
  plan: 'free' | 'premium' | 'certification' | 'cert-review';
  onButtonClick: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onButtonClick }) => {
  const planConfigs = {
    free: {
      title: 'Free',
      price: 'Free forever',
      description: 'Perfect to get started',
      badge: null,
      features: [
        { icon: Check, text: '4 daily micro-challenges', color: 'text-green-600' },
        { icon: Check, text: 'Basic skill areas', color: 'text-green-600' },
        { icon: Check, text: 'Progress tracking', color: 'text-green-600' },
        { icon: Check, text: 'Community access', color: 'text-green-600' },
      ],
      buttonText: 'Get Started Free',
      buttonClass: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium',
      cardClass: 'bg-white border-gray-200 shadow-lg',
    },
    premium: {
      title: 'Premium',
      price: '€9/month',
      description: 'For ambitious PMs',
      badge: { icon: Star, text: 'Most Popular', class: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' },
      features: [
        { icon: Check, text: 'Everything in Free', color: 'text-green-600' },
        { icon: Zap, text: 'Advanced scenarios', color: 'text-blue-600' },
        { icon: Zap, text: 'Expert-level challenges', color: 'text-blue-600' },
        { icon: Zap, text: 'Performance analytics', color: 'text-blue-600' },
        { icon: Zap, text: 'Personalized paths', color: 'text-blue-600' },
      ],
      buttonText: 'Upgrade to Premium',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium',
      cardClass: 'bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 shadow-xl relative',
    },
    certification: {
      title: 'Certification',
      price: '€89 one-time',
      description: 'Proof-of-sense for your CV',
      badge: null,
      features: [
        { icon: Award, text: 'Full Premium access', color: 'text-yellow-600' },
        { icon: Award, text: 'Final simulation test', color: 'text-yellow-600' },
        { icon: Award, text: 'Digital badge & certificate', color: 'text-yellow-600' },
        { icon: Award, text: 'LinkedIn verification', color: 'text-yellow-600' },
        { icon: Award, text: 'Lifetime validity', color: 'text-yellow-600' },
      ],
      buttonText: 'Get Certified',
      buttonClass: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium',
      cardClass: 'bg-white border-yellow-300 border-2 shadow-lg',
    },
    'cert-review': {
      title: 'Cert + Review',
      price: '€149 one-time',
      description: 'With expert feedback',
      badge: { icon: MessageSquare, text: 'Premium Review', class: 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white' },
      features: [
        { icon: Check, text: 'Everything in Basic Cert', color: 'text-green-600' },
        { icon: MessageSquare, text: 'Written feedback from real PM', color: 'text-orange-600' },
        { icon: MessageSquare, text: 'Personalized improvement areas', color: 'text-orange-600' },
        { icon: MessageSquare, text: 'Career guidance notes', color: 'text-orange-600' },
        { icon: Award, text: 'Premium certificate', color: 'text-yellow-600' },
      ],
      buttonText: 'Get Premium Cert',
      buttonClass: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium',
      cardClass: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-xl relative',
    },
  };

  const config = planConfigs[plan];

  return (
    <Card className={`${config.cardClass} flex flex-col`}>
      {config.badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className={`${config.badge.class} px-3 py-1 whitespace-nowrap`}>
            <config.badge.icon className="h-3 w-3 mr-1" />
            {config.badge.text}
          </Badge>
        </div>
      )}
      <CardHeader className={`text-center pb-6 ${config.badge ? 'pt-8' : ''}`}>
        <CardTitle className="text-xl font-bold text-gray-900">{config.title}</CardTitle>
        <div className="text-2xl font-bold text-gray-900 mt-2">
          {config.price.includes('/') ? (
            <>
              {config.price.split(' ')[0]}<span className="text-base font-normal">{config.price.split(' ')[1]}</span>
            </>
          ) : config.price.includes('one-time') ? (
            <>
              {config.price.split(' ')[0]}<span className="text-base font-normal"> {config.price.split(' ')[1]}</span>
            </>
          ) : (
            config.price
          )}
        </div>
        <p className="text-gray-600 mt-2">{config.description}</p>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="space-y-3 flex-grow">
          {config.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <feature.icon className={`h-4 w-4 ${feature.color} mr-3`} />
              <span className="text-sm text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>
        <Button 
          onClick={onButtonClick}
          className={`w-full mt-6 ${config.buttonClass} whitespace-nowrap`}
        >
          {config.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
