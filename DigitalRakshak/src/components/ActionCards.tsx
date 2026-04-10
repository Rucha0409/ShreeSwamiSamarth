import { useNavigate } from "react-router-dom";
import { useAppSettings } from "@/context/AppSettingsContext";
import { ArrowRight } from "lucide-react";

const cards = [
  {
    emoji: "🎮",
    titleKey: "card.game.title",
    descKey: "card.game.desc",
    bg: "bg-coral-card",
    route: "/game",
    delay: "0s",
  },
  {
    emoji: "📱",
    titleKey: "card.sandbox.title",
    descKey: "card.sandbox.desc",
    bg: "bg-teal-card",
    route: "/simulators",
    delay: "0.1s",
  },
  {
    emoji: "🤖",
    titleKey: "card.scamy.title",
    descKey: "card.scamy.desc",
    bg: "bg-purple-card",
    route: "/scam-simulator",
    delay: "0.2s",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    titleKey: "card.progress.title",
    descKey: "card.progress.desc",
    fallbackTitle: "Family & Rakhi",
    fallbackDesc: "View your Digital Rakhi promise and unlock family memory rewards.",
    bg: "bg-amber-card",
    route: "/progress",
    delay: "0.3s",
  },
  {
    emoji: "🕵️",
    titleKey: "card.deepfake.title",
    descKey: "card.deepfake.desc",
    bg: "bg-blue-card",
    route: "/deepfake-lab",
    delay: "0.4s",
  },
];

const ActionCards = () => {
  const { elderlyMode, t } = useAppSettings();
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-6 pb-20 max-w-7xl">
      <div className={`grid gap-6 ${elderlyMode ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
        {cards.map((card) => (
          <button
            key={card.route}
            data-tour={
              card.route === "/game" ? "quiz-card" : 
              card.route === "/simulators" ? "simulator-card" : 
              card.route === "/scam-simulator" ? "scamy-card" : undefined
            }
            onClick={() => navigate(card.route)}
            className={`${card.bg} rounded-[2rem] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 active:scale-[0.98] text-white text-left animate-fade-in-up overflow-hidden relative group p-8 lg:p-10 flex flex-col justify-between`}
            style={{ animationDelay: card.delay, minHeight: "260px" }}
          >
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 opacity-10 text-9xl leading-none select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
              {card.emoji}
            </div>

            <div className={`flex flex-col gap-4 relative z-10`}>
              <span className="text-6xl drop-shadow-md mb-2">{card.emoji}</span>
              <h3 className={`font-black text-white leading-tight ${elderlyMode ? "text-3xl" : "text-2xl"}`}>
                {t(card.titleKey) || card.titleKey}
              </h3>
              <p className={`text-white/85 font-medium leading-relaxed ${elderlyMode ? "text-lg" : "text-base"}`}>
                {t(card.descKey) || card.descKey}
              </p>
            </div>
            
            <div className="relative z-10 mt-6 inline-flex items-center gap-2 text-white font-black text-lg group-hover:gap-4 transition-all bg-black/10 self-start px-6 py-3 rounded-xl backdrop-blur-sm">
                {t("card.cta") || "Start"} <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ActionCards;
