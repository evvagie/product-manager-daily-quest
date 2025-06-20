
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Star, Award, Zap, Users, MessageSquare } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
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

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-16">
          {/* Free Plan */}
          <Card className="bg-white border-gray-200 shadow-lg flex flex-col">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-bold text-gray-900">Free</CardTitle>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                Free forever
              </div>
              <p className="text-gray-600 mt-2">Perfect to get started</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">4 daily micro-challenges</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Basic skill areas</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Progress tracking</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Community access</span>
                </div>
              </div>
              <Button 
                onClick={handleGetStarted}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium whitespace-nowrap"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 shadow-xl relative flex flex-col">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-xl font-bold text-gray-900">Premium</CardTitle>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                €9<span className="text-base font-normal">/month</span>
              </div>
              <p className="text-gray-600 mt-2">For ambitious PMs</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Everything in Free</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-700">Advanced scenarios</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-700">Expert-level challenges</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-700">Performance analytics</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-700">Personalized paths</span>
                </div>
              </div>
              <Button 
                onClick={handleUpgrade}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium whitespace-nowrap"
              >
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>

          {/* Certification Basic */}
          <Card className="bg-white border-yellow-300 border-2 shadow-lg flex flex-col">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-bold text-gray-900">Certification</CardTitle>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                €89<span className="text-base font-normal"> one-time</span>
              </div>
              <p className="text-gray-600 mt-2">Proof-of-sense for your CV</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-700">Full Premium access</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-700">Final simulation test</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-700">Digital badge & certificate</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-700">LinkedIn verification</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-700">Lifetime validity</span>
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

          {/* Certification + Review */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-xl relative flex flex-col">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-3 py-1 whitespace-nowrap">
                <MessageSquare className="h-3 w-3 mr-1" />
                Premium Review
              </Badge>
            </div>
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-xl font-bold text-gray-900">Cert + Review</CardTitle>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                €149<span className="text-base font-normal"> one-time</span>
              </div>
              <p className="text-gray-600 mt-2">With expert feedback</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Everything in Basic Cert</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-orange-600 mr-3" />
                  <span className="text-sm text-gray-700">Written feedback from real PM</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-orange-600 mr-3" />
                  <span className="text-sm text-gray-700">Personalized improvement areas</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-orange-600 mr-3" />
                  <span className="text-sm text-gray-700">Career guidance notes</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-700">Premium certificate</span>
                </div>
              </div>
              <Button 
                onClick={handleUpgrade}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
              >
                Get Premium Cert
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Team/Corporate Section */}
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
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-blue-400 to-red-400 hover:from-blue-500 hover:to-red-500 text-white px-8 py-3 text-lg font-medium whitespace-nowrap"
                >
                  Contact for Team Pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition Section */}
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

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-semibold">
                How is this different from a €1,500 PM certification?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Traditional certifications focus on theory and frameworks you'll memorize and forget. 
                Yuno builds your product instincts through daily practice with real scenarios. 
                You're not just learning about prioritization — you're actually making tough priority calls every day.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-semibold">
                Will employers recognize this certification?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                This is a "proof-of-sense" certification, not a formal academic credential. 
                It demonstrates your practical PM judgment and decision-making skills. 
                Many employers value demonstrated competency over theoretical knowledge — 
                especially when you can show consistent daily practice and real scenario experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-semibold">
                What's included in the expert review (€149 option)?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                A real PM reviews your final simulation performance and provides written feedback on 
                your decision-making patterns, strengths, improvement areas, and career guidance. 
                You'll get personalized insights you can't get from automated scoring — 
                perfect for understanding your PM thinking style and growth opportunities.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-semibold">
                How does team pricing work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Team packages (€250-500) include group dashboards, progress tracking, and bulk certification. 
                Perfect for bootcamps, company training, or cohort learning. Pricing depends on team size 
                and specific needs. Contact us for a custom quote tailored to your organization.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg font-semibold">
                Can I cancel my Premium subscription anytime?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutely! You can cancel your Premium subscription at any time. You'll continue 
                to have access to Premium features until the end of your billing period, then 
                automatically return to the Free plan. Certification purchases are one-time and non-refundable.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-12 border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to prove your PM instincts?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of product managers building real skills through daily practice. 
            Start free, upgrade when ready, get certified when you're confident.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium animate-pulse whitespace-nowrap"
          >
            Start Building Your Skills Today
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free forever plan available • 10x more affordable than traditional certifications
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
