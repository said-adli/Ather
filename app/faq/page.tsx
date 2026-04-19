"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, HelpCircle, Info } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: "fq1",
    question: "Is my fast valid if I am traveling?",
    answer: "Yes. While travelers are permitted to break their fast and make it up later, fasting while traveling is valid and accepted as long as it does not cause severe hardship to the traveler."
  },
  {
    id: "fq2",
    question: "How long can I wipe over my socks for Wudu?",
    answer: "A resident may wipe over their socks for 24 hours from the first time they wipe after breaking wudu. A traveler may wipe for up to 72 hours (3 days and nights)."
  },
  {
    id: "fq3",
    question: "Do I have to perform missed (Qada) prayers in order?",
    answer: "It is generally required to make up missed prayers in chronological order if the number of missed prayers is small (less than six). However, if time is short for the current prayer, one must pray the current one first."
  },
  {
    id: "fq4",
    question: "If I miss Witr, can I make it up?",
    answer: "Yes, it is highly recommended to make up the Witr prayer during the morning (Duha time), but it is prayed as an even number of rak'ahs (e.g., if you usually pray 3, you make up 4)."
  },
  {
    id: "fq5",
    question: "What breaks the fast inadvertently?",
    answer: "Swallowing something unintentionally, forgetting you are fasting and eating/drinking, or having a wet dream do not break the fast. You simply continue fasting."
  }
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] px-6 pt-12 pb-32 safe-area-inset-top">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          FAQ & Fiqh <HelpCircle className="text-emerald-500" size={28} />
        </h1>
        <p className="text-slate-500 font-medium mt-1">Common daily questions and fatwas.</p>
      </header>

      {/* Disclaimer Card */}
      <div className="bg-amber-50 rounded-2xl p-4 mb-8 border border-amber-100 flex items-start gap-4">
        <div className="bg-amber-100 p-2 rounded-full mt-0.5">
          <Info size={20} className="text-amber-700" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 mb-1">General Guidelines</h3>
          <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
            These answers are curated for standard daily inquiries based on general consensus. For complex or situation-specific rulings, please consult a qualified scholar.
          </p>
          <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors">
            Official Dar al-Ifta <ExternalLink size={12} strokeWidth={3} />
          </a>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          
          return (
            <div 
              key={faq.id} 
              className={`bg-white rounded-2xl border transition-colors overflow-hidden ${isOpen ? 'border-emerald-200 shadow-sm' : 'border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)]'}`}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
              >
                <span className={`font-semibold text-sm transition-colors ${isOpen ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {faq.question}
                </span>
                <motion.div
                  initial={false}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`${isOpen ? 'text-emerald-500' : 'text-slate-400'}`}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-slate-50/50">
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
