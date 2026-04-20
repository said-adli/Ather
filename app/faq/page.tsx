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
    question: "هل صيامي صحيح إذا كنت مسافراً؟",
    answer: "نعم. المسافر مُرخَّص له الفطر وقضاؤه لاحقاً، لكن الصيام أثناء السفر صحيح ومقبول ما لم يسبب مشقة شديدة للمسافر."
  },
  {
    id: "fq2",
    question: "كم مدة المسح على الجوارب في الوضوء؟",
    answer: "يجوز للمقيم المسح على جوربيه لمدة يوم وليلة (24 ساعة) من أول مسح بعد الحدث. والمسافر يمسح حتى ثلاثة أيام بلياليها (72 ساعة)."
  },
  {
    id: "fq3",
    question: "هل يجب أداء الصلوات الفائتة (القضاء) بالترتيب؟",
    answer: "يجب عموماً قضاء الصلوات الفائتة بالترتيب الزمني إذا كان عدد الصلوات الفائتة قليلاً (أقل من ست). لكن إن ضاق وقت الصلاة الحاضرة، وجب أداؤها أولاً."
  },
  {
    id: "fq4",
    question: "إذا فاتتني صلاة الوتر، هل يمكنني قضاؤها؟",
    answer: "نعم، يُستحب قضاء صلاة الوتر في وقت الضحى، لكنها تُصلى شفعاً (مثلاً: إذا كنت تصلي عادةً 3 ركعات، تقضي 4 ركعات)."
  },
  {
    id: "fq5",
    question: "ما الذي يُبطل الصيام دون قصد؟",
    answer: "ابتلاع شيء عن غير قصد، أو نسيان الصيام والأكل/الشرب، أو الاحتلام لا تُبطل الصيام. تستمر في صيامك فحسب."
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
          أسئلة فقهية <HelpCircle className="text-emerald-500" size={28} />
        </h1>
        <p className="text-slate-500 font-medium mt-1">أسئلة يومية شائعة وفتاوى</p>
      </header>

      {/* Disclaimer Card */}
      <div className="bg-amber-50 rounded-2xl p-4 mb-8 border border-amber-100 flex items-start gap-4">
        <div className="bg-amber-100 p-2 rounded-full mt-0.5">
          <Info size={20} className="text-amber-700" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 mb-1">إرشادات عامة</h3>
          <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
            هذه الإجابات مُعدَّة للأسئلة اليومية المعتادة بناءً على الإجماع العام. للأحكام المعقدة أو الخاصة بحالتك، يرجى استشارة عالم مؤهل.
          </p>
          <a href="https://www.dar-alifta.org" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors">
            دار الإفتاء الرسمية <ExternalLink size={12} strokeWidth={3} />
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
                className="w-full text-right px-5 py-4 flex items-center justify-between focus:outline-none"
              >
                <span className={`font-semibold text-sm transition-colors ${isOpen ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {faq.question}
                </span>
                <motion.div
                  initial={false}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`flex-shrink-0 mr-3 ${isOpen ? 'text-emerald-500' : 'text-slate-400'}`}
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
