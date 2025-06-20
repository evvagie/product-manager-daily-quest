
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PricingFAQ = () => {
  return (
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
  );
};

export default PricingFAQ;
