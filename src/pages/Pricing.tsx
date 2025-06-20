
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Star, Award, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
    // For now, redirect to signup if not logged in, or dashboard if logged in
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your safest space to grow as a PM
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master product management through daily micro-challenges. Practice real scenarios, 
            build confidence, and get certified — all at your own pace.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Free</CardTitle>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                Free forever
              </div>
              <p className="text-gray-600 mt-2">Perfect to get started</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">4 daily micro-challenges</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Basic skill areas</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Progress tracking</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Community access</span>
                </div>
              </div>
              <Button 
                onClick={handleGetStarted}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 shadow-xl relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                <Star className="h-4 w-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Premium</CardTitle>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                €9<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-gray-600 mt-2">For ambitious PMs</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Everything in Free</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Advanced scenarios</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Expert-level challenges</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Detailed performance analytics</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Personalized learning paths</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Priority support</span>
                </div>
              </div>
              <Button 
                onClick={handleUpgrade}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
              >
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>

          {/* Certification Add-on */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Certification</CardTitle>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                €89<span className="text-lg font-normal"> one-time</span>
              </div>
              <p className="text-gray-600 mt-2">Validate your expertise</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-gray-700">Official PM certification</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-gray-700">Comprehensive assessment</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-gray-700">LinkedIn badge</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-gray-700">Industry recognition</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-gray-700">Lifetime validity</span>
                </div>
              </div>
              <Button 
                onClick={handleUpgrade}
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium"
              >
                Get Certified
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-semibold">
                How is Yuno different from other PM courses?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yuno focuses on micro-learning through daily challenges rather than long lectures. 
                You practice real PM scenarios in bite-sized sessions, making it easier to build 
                consistent habits and retain knowledge.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-semibold">
                Can I cancel my Premium subscription anytime?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutely! You can cancel your Premium subscription at any time. You'll continue 
                to have access to Premium features until the end of your billing period, then 
                automatically return to the Free plan.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-semibold">
                Is the certification recognized by employers?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our certification is designed to demonstrate practical PM skills through real-world 
                scenarios. While recognition varies by employer, the certificate validates your 
                hands-on experience with product management challenges and decision-making.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-semibold">
                What if I'm not satisfied with Premium?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                We offer a 14-day money-back guarantee for Premium subscriptions. If you're not 
                completely satisfied, contact our support team for a full refund within your 
                first two weeks.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to level up your PM skills?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of product managers who practice daily with Yuno. 
            Start free, upgrade when you're ready.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium"
          >
            Start Your PM Journey
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
