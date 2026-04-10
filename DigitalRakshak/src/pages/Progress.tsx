import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface Badge {
  id: string;
  emoji: string;
  title: string;
  titleHi: string;
  desc: string;
  descHi: string;
  color: string;
  xpReward: number;
}

const allBadges: Badge[] = [
  {
    id: "scam_spotter",
    emoji: "👦🏽",
    title: "Video from Rahul",
    titleHi: "राहुल का वीडियो",
    desc: "Unlocked by passing Safe or Scam",
    descHi: "Safe or Scam पास करके खोला",
    color: "bg-emerald-500 text-white",
    xpReward: 50,
  },
  {
    id: "upi_pro",
    emoji: "👧🏽",
    title: "Photo from Priya",
    titleHi: "प्रिया की फ़ोटो",
    desc: "Unlocked by learning UPI Safety",
    descHi: "UPI सेफ्टी सीखकर खोला",
    color: "bg-rose-500 text-white",
    xpReward: 50,
  },
  {
    id: "scam_resister",
    emoji: "👨‍👩‍👦",
    title: "Family Voice Note",
    titleHi: "पारिवारिक वॉइस नोट",
    desc: "Unlocked by catching Scamy",
    descHi: "Scamy को पकड़कर खोला",
    color: "bg-purple-500 text-white",
    xpReward: 100,
  },
  {
    id: "digital_guardian",
    emoji: "💌",
    title: "Surprise Audio Memory",
    titleHi: "सरप्राइज ऑडियो",
    desc: "Unlock everything to see this!",
    descHi: "सब कुछ खोलकर इसे देखें!",
    color: "bg-amber-500 text-white",
    xpReward: 150,
  },
];

const Progress = () => {
  const { elderlyMode, language } = useAppSettings();
  const navigate = useNavigate();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const badges: string[] = JSON.parse(localStorage.getItem("dr_badges") || "[]");
    const storedXp = parseInt(localStorage.getItem("dr_xp") || "0");

    if (
      badges.includes("scam_spotter") &&
      badges.includes("upi_pro") &&
      badges.includes("scam_resister") &&
      !badges.includes("digital_guardian")
    ) {
      badges.push("digital_guardian");
      localStorage.setItem("dr_badges", JSON.stringify(badges));
      localStorage.setItem("dr_xp", String(storedXp + 150));
    }

    setEarnedBadges(badges);
    setXp(parseInt(localStorage.getItem("dr_xp") || "0"));
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const xpToNext = 100 - (xp % 100);
  const progressPct = (xp % 100);
  const earnedCount = earnedBadges.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-6 py-10 max-w-7xl flex-1 flex flex-col gap-8">

        {/* Header Title */}
        <div className="flex items-center gap-6 animate-fade-in-up">
          <button onClick={() => navigate("/")} className="p-4 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-8 h-8" />
          </button>
          <div>
            <h1 className={`font-black text-foreground ${elderlyMode ? "text-5xl" : "text-4xl"}`}>
              👨‍👩‍👧‍👦 {language === "hi" ? "डिजिटल राखी और पारिवारिक यादें" : "Digital Rakhi & Memories"}
            </h1>
            <p className={`text-muted-foreground font-bold mt-2 ${elderlyMode ? "text-2xl" : "text-xl"}`}>
              {earnedCount}/{allBadges.length} {language === "hi" ? "परिवार के संदेश खुले हैं" : "family messages unlocked"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Digital Rakhi */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="gradient-primary rounded-[3rem] p-8 lg:p-10 text-white shadow-card animate-fade-in-up hover:shadow-card-hover transition-all border-4 border-amber-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className={`font-black ${elderlyMode ? "text-5xl" : "text-4xl"} mb-2`}>
                    🛡️ Digital Rakhi
                  </p>
                  <p className={`text-amber-100 font-bold ${elderlyMode ? "text-2xl" : "text-xl"}`}>
                    Tied by: Rahul (Grandson)
                  </p>
                </div>
              </div>

              <div className="bg-black/10 rounded-2xl p-5 mb-6 shadow-inner italic border-l-4 border-amber-400">
                <p className={`text-white/95 font-bold leading-relaxed ${elderlyMode ? "text-2xl" : "text-lg"}`}>
                   "Dadaji, I promise to help you whenever you are confused by a message. You promise to call me before sending money or OTPs to anyone you don't know!"
                </p>
              </div>

              <div className="bg-white text-blue-700 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors shadow-lg active:scale-95">
                 <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-black text-2xl">
                   📞
                 </div>
                 <div>
                   <p className={`font-black uppercase tracking-wider ${elderlyMode ? "text-xl" : "text-base"}`}>Call Rahul Now</p>
                   <p className="text-sm font-bold opacity-80">Primary Trusted Contact</p>
                 </div>
              </div>
            </div>

            {/* How to unlock */}
            <div className="bg-card rounded-[2.5rem] border-2 border-border p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h3 className={`font-black text-foreground mb-4 ${elderlyMode ? "text-3xl" : "text-2xl"}`}>
                💌 {language === "hi" ? "वीडियो कैसे खोलें?" : "How to Unlock Messages?"}
              </h3>
              <p className={`font-bold text-muted-foreground leading-snug ${elderlyMode ? "text-xl" : "text-lg"} mb-6`}>
                 Your family recorded special messages for you! Complete safety modules to unlock them.
              </p>
              <div className="space-y-4">
                {[
                  { emoji: "🎮", text: language === "hi" ? "'Safe or Scam' Quiz पूरा करें" : "Complete Safe or Scam Quiz" },
                  { emoji: "📱", text: language === "hi" ? "UPI Training पूरी करें" : "Finish UPI Training" },
                  { emoji: "🕵️", text: language === "hi" ? "RealityCheck Lab पास करें" : "Pass RealityCheck Lab" },
                ].map(({ emoji, text }) => (
                  <div key={text} className={`flex items-center gap-4 bg-muted/60 rounded-2xl px-5 py-4 border border-transparent hover:border-border transition-colors`}>
                    <span className={elderlyMode ? "text-4xl" : "text-3xl"}>{emoji}</span>
                    <p className={`font-bold text-foreground leading-snug ${elderlyMode ? "text-xl" : "text-lg"}`}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Family Memories Grid */}
          <div className="lg:col-span-2">
            <h2 className={`font-black text-foreground mb-6 pl-2 ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
              💝 {language === "hi" ? "आपका पारिवारिक एल्बम" : "Your Family Album"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {allBadges.map((badge, i) => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`rounded-[2.5rem] border-4 p-8 transition-all animate-fade-in-up flex flex-col justify-between ${
                      earned
                        ? `${badge.color} border-transparent shadow-card hover:scale-[1.02]`
                        : "bg-muted border-border opacity-60 grayscale hover:grayscale-0"
                    }`}
                    style={{ animationDelay: `${0.15 + i * 0.1}s`, minHeight: '260px' }}
                  >
                    <div>
                        <div className={`flex items-center justify-between mb-4`}>
                            <div className={`${elderlyMode ? "text-7xl" : "text-6xl"} filter drop-shadow-md`}>
                                {badge.emoji}
                            </div>
                        </div>
                        <p className={`font-black mb-2 ${earned ? "text-white" : "text-muted-foreground"} ${elderlyMode ? "text-3xl" : "text-2xl"}`}>
                        {language === "hi" ? badge.titleHi : badge.title}
                        </p>
                        <p className={`font-semibold leading-relaxed ${earned ? "text-white/90" : "text-muted-foreground"} ${elderlyMode ? "text-xl" : "text-lg"}`}>
                        {language === "hi" ? badge.descHi : badge.desc}
                        </p>
                    </div>

                    <div className="mt-4 border-t border-white/20 pt-4">
                        {earned ? (
                        <button className={`w-full bg-white text-gray-900 rounded-xl px-4 py-3 font-black shadow-md mt-4 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                            ▶️ {language === "hi" ? "अब चलाएं" : "Play Message"}
                        </button>
                        ) : (
                        <p className={`text-muted-foreground font-black flex items-center gap-2 mt-4 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                            🔒 {language === "hi" ? "सिखलाई से खोलें" : "Locked (Train to open)"}
                        </p>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple embedded component to replace standard lucide if missing check circle.
const CheckCircle = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
)

export default Progress;
