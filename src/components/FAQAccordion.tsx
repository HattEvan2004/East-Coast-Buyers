import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const FAQS: FAQItem[] = [
  {
    id: 'repairs',
    question: 'Do I have to make repairs first?',
    answer: 'Absolutely not. You can reach out even if the property needs serious structural work, cleanup, or roof repairs. We review properties in 100% as-is condition so you can sell without sanding, painting, or spending a dime on renovations.'
  },
  {
    id: 'obligation',
    question: 'Is there any commitment or obligation?',
    answer: 'None at all. Submitting your property details simply asks our local team to take a look. We walk you through a free property analysis. If there is a fit, we will make a proposal, but you are under no constraint to accept it. Our process is strictly pressure-free.'
  },
  {
    id: 'types',
    question: 'What types of Nova Scotia properties do you review?',
    answer: 'We consider a wide range of properties, focusing on older family homes, inherited holdings, estate liquidations, vacant single-family houses, rental buildings with existing tenants, properties with delayed structural maintenance, and vacant land or tear-down lots.'
  },
  {
    id: 'perfect',
    question: 'Do you only buy perfect houses?',
    answer: 'No, in fact we specialize in properties that need some extra TLC or homes that Traditional Agents find difficult to sell due to condition issues, outdated interiors, or complex landlord-tenant blockages.'
  },
  {
    id: 'timeline',
    question: 'How fast will you follow up with me?',
    answer: 'Once you submit property details online, our local Nova Scotia agents commence a preliminary directory assessment of local comps. We typically follow up strictly in 12 to 24 hours to have a simple, direct conversation!'
  }
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {FAQS.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div 
            key={faq.id} 
            className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-all soft-card-shadow hover:border-maritime-200"
          >
            <button
              onClick={() => toggle(faq.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-display font-semibold text-stone-900 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-maritime-500 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="h-4 sm:h-5 w-4 sm:w-5 text-maritime-700 flex-shrink-0" />
                {faq.question}
              </span>
              <ChevronDown 
                className={`h-4 w-4 text-stone-500 transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? 'transform rotate-180 text-maritime-800' : ''
                }`} 
              />
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-5 pb-5 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
