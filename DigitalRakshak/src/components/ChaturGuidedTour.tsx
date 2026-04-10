import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOUR_STEPS = [
  {
    target: "navbar-logo",
    message: "Namaste! Main hoon Chatur 🛡️ Let me show you around!",
  },
  {
    target: "quiz-card",
    message: "Start here! Test if you can spot a scam!",
  },
  {
    target: "simulator-card",
    message: "Practice real scenarios safely here!",
  },
  {
    target: "scamy-card",
    message: "Chat with a fake scammer and learn to resist tricks!",
  },
  {
    target: "elderly-mode",
    message: "Elderly Mode makes everything simpler to read.",
  },
  {
    target: "language-toggle",
    message: "Switch to your preferred language anytime.",
  },
  {
    target: "badges-nav",
    message: "Track your progress. You're ready to begin! 🎉",
  }
];

export default function ChaturGuidedTour({ lang, elderlyMode, onComplete }: { lang: string, elderlyMode: boolean, onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  // Read message using SpeechSynthesis
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(TOUR_STEPS[currentStep].message);
      msg.lang = "en-IN"; // Set an appropriate Indian-English voice or adapt based on lang
      window.speechSynthesis.speak(msg);
    }
  }, [currentStep, lang]);

  useEffect(() => {
    const updateRect = () => {
      const targetEl = document.querySelector(`[data-tour="${TOUR_STEPS[currentStep].target}"]`);
      if (targetEl) {
        setElementRect(targetEl.getBoundingClientRect());
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);
    
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const isComplete = currentStep === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-auto">
        {/* Dark overlay with mask for spotlight */}
        <div 
          className="absolute inset-0 bg-black/60 transition-all duration-500 ease-in-out"
          style={{
            clipPath: elementRect 
              ? `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${elementRect.left - 10}px ${elementRect.top - 10}px, ${elementRect.left - 10}px ${elementRect.bottom + 10}px, ${elementRect.right + 10}px ${elementRect.bottom + 10}px, ${elementRect.right + 10}px ${elementRect.top - 10}px, ${elementRect.left - 10}px ${elementRect.top - 10}px)`
              : "none"
          }}
        />

        {/* Highlight border around the target */}
        {elementRect && (
          <motion.div
            className="absolute rounded-lg border-4 border-dashed border-orange-500"
            animate={{
              top: elementRect.top - 10,
              left: elementRect.left - 10,
              width: elementRect.width + 20,
              height: elementRect.height + 20,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        )}

        {/* Chatur & Message Dialog */}
        <motion.div 
          className="absolute max-w-sm w-[90%] md:w-96 bg-white rounded-2xl shadow-2xl p-5 border-2 border-orange-200"
          animate={{
            top: elementRect ? (elementRect.bottom > window.innerHeight - 250 ? elementRect.top - 200 : elementRect.bottom + 30) : '50%',
            left: elementRect ? Math.min(Math.max(20, elementRect.left + elementRect.width / 2 - 192), window.innerWidth - 400) : '50%',
            scale: 1,
            opacity: 1
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          {/* Arrow removed as requested */}

          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-500 flex-shrink-0 animate-pulse">
              <span className="text-3xl">🛡️</span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-orange-600 mb-1">Chatur</h3>
              <p className="text-gray-700 text-sm md:text-base font-medium min-h-[60px]">
                {TOUR_STEPS[currentStep].message}
              </p>
              
              {/* Progress dots */}
              <div className="flex gap-1 mt-4 mb-3">
                {TOUR_STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full flex-1 ${i <= currentStep ? 'bg-orange-500' : 'bg-gray-200'}`} />
                ))}
              </div>

              <div className="flex justify-between items-center mt-2">
                <button 
                  onClick={onComplete}
                  className="text-gray-400 text-xs font-semibold hover:text-gray-600"
                >
                  Skip Tour
                </button>
                <button 
                  onClick={handleNext}
                  className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                >
                  {isComplete ? "Begin!" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
