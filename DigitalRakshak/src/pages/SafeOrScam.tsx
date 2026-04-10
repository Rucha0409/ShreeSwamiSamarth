import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Volume2, VolumeX } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";

/* ─── Scenario Types ─── */
type ScenarioType = "sms" | "whatsapp" | "call" | "email" | "upi";

interface Scenario {
  type: ScenarioType;
  isScam: boolean;
  explanation: string;
  whatToDo: string;
  sender?: string;
  message?: string;
  caller?: string;
  callScript?: string;
  from?: string;
  subject?: string;
  emailBody?: string;
  upiFrom?: string;
  upiAmount?: string;
  upiNote?: string;
  redFlags?: string[];
}

const scenariosEn: Scenario[] = [
  {
    type: "call",
    isScam: true,
    caller: "+91-800-BANK (Fake)",
    callScript: "'Hello sir, this is from SBI Bank. Your account will be blocked. Please share your OTP immediately to verify!'",
    explanation: "Banks NEVER ask for OTP over phone. This is a classic phishing call.",
    whatToDo: "Hang up immediately. Call your bank's official number directly.",
    redFlags: ["Asks for OTP", "Urgency/threat", "Unknown number"],
  },
  {
    type: "whatsapp",
    isScam: true,
    sender: "Unknown (+91 98765 43210)",
    message: "🎊 Congratulations! You've won ₹50,00,000 in KBC Lottery! Click http://bit.ly/kbc-win2024 to claim your prize NOW before it expires!",
    explanation: "You can't win a lottery you never entered. Shortened URLs are classic scam tricks.",
    whatToDo: "Delete the message. Block the sender. Never click shortened URLs.",
    redFlags: ["Unsolicited prize", "Shortened URL", "Urgency (expires soon)"],
  },
  {
    type: "sms",
    isScam: false,
    sender: "BK-HDFCBK",
    message: "Dear Customer, Rs.2500 debited from A/c XX1234 on 09-Apr. If not done by you, call 1800-XXX-XXXX. -HDFC Bank",
    explanation: "Official bank transaction SMSs come from registered sender IDs (like BK-HDFCBK), not random numbers.",
    whatToDo: "Review your account in the official app. If unauthorized, call the bank helpline.",
    redFlags: [],
  },
  {
    type: "upi",
    isScam: true,
    upiFrom: "Unknown Person (9876543210@okaxis)",
    upiAmount: "₹10,000",
    upiNote: "Sent by mistake, please approve collect request",
    explanation: "A 'Collect Request' makes YOU pay them — not receive money. This is the #1 UPI scam.",
    whatToDo: "DECLINE the request. Block the sender. Never approve unknown collect requests.",
    redFlags: ["Unknown sender", "Collect (not send) request", "'Sent by mistake' trick"],
  },
];

const scenariosHi: Scenario[] = [
  {
    type: "call",
    isScam: true,
    caller: "+91-800-BANK (नकली)",
    callScript: "'हैलो सर, यह SBI बैंक से है। आपका खाता बंद होने वाला है। कृपया अभी OTP बताएं!'",
    explanation: "बैंक कभी फोन पर OTP नहीं मांगता। यह फिशिंग कॉल है।",
    whatToDo: "तुरंत फोन काटें। बैंक के आधिकारिक नंबर पर कॉल करें।",
    redFlags: ["OTP मांगना", "धमकी/urgency", "अज्ञात नंबर"],
  },
  {
    type: "whatsapp",
    isScam: true,
    sender: "अज्ञात (+91 98765 43210)",
    message: "🎊 बधाई! आपने KBC में ₹50,00,000 जीते! अभी claim करें: http://bit.ly/kbc-win2024 — जल्दी करें!",
    explanation: "आप वह lottery नहीं जीत सकते जिसमें आपने भाग नहीं लिया। Shortened URLs scam की निशानी हैं।",
    whatToDo: "संदेश delete करें। भेजने वाले को block करें। Shortened URLs पर click न करें।",
    redFlags: ["अनचाहा prize", "Shortened URL", "जल्दी (expires soon)"],
  },
  {
    type: "sms",
    isScam: false,
    sender: "BK-HDFCBK",
    message: "प्रिय ग्राहक, आपके खाते XX1234 से ₹2500 काटे गए। अगर यह आपने नहीं किया तो 1800-XXX-XXXX पर call करें। -HDFC Bank",
    explanation: "आधिकारिक बैंक SMSs registered sender IDs से आते हैं, random numbers से नहीं।",
    whatToDo: "Official app में account check करें। अनधिकृत हो ক্যাম हो तो बैंक helpline पर call करें।",
    redFlags: [],
  },
  {
    type: "upi",
    isScam: true,
    upiFrom: "अज्ञात व्यक्ति (9876543210@okaxis)",
    upiAmount: "₹10,000",
    upiNote: "गलती से भेजा, कृपया collect request approve करें",
    explanation: "'Collect Request' आपसे पैसे लेती है — देती नहीं। यह #1 UPI scam है।",
    whatToDo: "Request DECLINE करें। भेजने वाले को block करें।",
    redFlags: ["अज्ञात sender", "Collect request", "'गलती से भेजा' trick"],
  },
];

/* ─── Visual Renderers ─── */
const PhoneCallCard = ({ s, lang }: { s: Scenario; lang: string }) => {
  const { simplify, elderlyMode } = useAppSettings();
  return (
  <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-900 shadow-2xl bg-gray-900 w-[320px] mx-auto scale-100 transition-transform">
    <div className="bg-gray-800 px-4 pt-10 pb-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-4xl mx-auto mb-4">📞</div>
      <p className="text-white text-sm font-semibold opacity-70 mb-1">
        {lang === "hi" ? "इनकमिंग कॉल" : "Incoming Call"}
      </p>
      <p className={`text-white font-black ${elderlyMode ? "text-2xl" : "text-xl"}`}>{s.caller}</p>
    </div>
    <div className="bg-gray-700 px-6 py-6 h-[200px] flex items-center">
      <div className="bg-gray-600 rounded-3xl px-5 py-4 w-full">
        <p className={`text-gray-200 italic leading-relaxed text-center ${elderlyMode ? "text-xl" : "text-base"}`}>
          "{simplify(s.callScript || "")}"
        </p>
      </div>
    </div>
    <div className="bg-gray-900 px-6 py-10 flex justify-center gap-12">
      <div className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors flex items-center justify-center text-3xl shadow-lg">📵</div>
      <div className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors flex items-center justify-center text-3xl shadow-lg">📱</div>
    </div>
  </div>
);
};

const SmsCard = ({ s }: { s: Scenario }) => {
  const { simplify, elderlyMode } = useAppSettings();
  return (
  <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-900 shadow-2xl bg-white w-[320px] mx-auto min-h-[500px]">
    <div className="bg-gray-100 px-5 py-6 flex items-center gap-4 border-b border-gray-200 pt-10">
      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
        {s.sender?.[0] || "?"}
      </div>
      <div>
        <p className="font-bold text-gray-800 text-lg">{s.sender}</p>
        <p className="text-sm text-gray-500">09 Apr, 2:34 PM</p>
      </div>
    </div>
    <div className="px-5 py-8 bg-white">
      <div className="sms-bubble-in inline-block px-5 py-4 max-w-full shadow-sm text-base">
        <p className={`text-gray-800 leading-relaxed ${elderlyMode ? "text-xl" : "text-base"}`}>{simplify(s.message || "")}</p>
      </div>
    </div>
  </div>
);
};

const WhatsAppCard = ({ s }: { s: Scenario }) => {
  const { simplify, elderlyMode } = useAppSettings();
  return (
  <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-900 shadow-2xl w-[320px] mx-auto min-h-[500px]" style={{ background: "#e5ddd5" }}>
    <div className="flex items-center gap-4 px-5 py-6 pt-10" style={{ background: "#128C7E" }}>
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
        {s.sender?.[0] || "?"}
      </div>
      <div>
        <p className="text-white font-bold text-lg">{s.sender}</p>
        <p className="text-green-200 text-sm">WhatsApp</p>
      </div>
    </div>
    <div className="px-5 py-8">
      <div className="bg-white rounded-2xl px-5 py-4 shadow-md inline-block max-w-full relative">
        <p className={`text-gray-800 leading-relaxed ${elderlyMode ? "text-xl font-medium" : "text-base"}`}>{simplify(s.message || "")}</p>
        <p className="text-right text-gray-400 text-xs mt-2">2:34 PM ✓✓</p>
        <div className="absolute top-0 -left-2 w-4 h-4 bg-white transform rotate-45"></div>
      </div>
    </div>
  </div>
);
};

const UpiCard = ({ s }: { s: Scenario }) => {
  const { simplify, elderlyMode } = useAppSettings();
  return (
  <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-900 shadow-2xl bg-white w-[320px] mx-auto min-h-[500px]">
    <div className="px-5 py-5 pt-10 flex items-center gap-2" style={{ background: "#5f259f" }}>
      <span className="text-white font-black text-lg">💳 UPI Collect Request</span>
    </div>
    <div className="px-6 py-8 space-y-6">
      <div className="text-center mt-4">
        <p className="text-5xl font-black text-gray-800 mb-2">{s.upiAmount}</p>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Collect Request</p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">FROM</p>
        <p className="text-base font-bold text-gray-800">{s.upiFrom}</p>
        <p className={`text-gray-600 bg-white p-3 rounded-xl border border-gray-100 mt-2 italic shadow-sm ${elderlyMode ? "text-lg font-medium" : "text-sm"}`}>"{simplify(s.upiNote || "")}"</p>
      </div>
      <div className="flex gap-4 pt-4">
        <button className="flex-1 py-4 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors font-black text-center text-sm shadow-sm active:scale-95 cursor-pointer">DECLINE</button>
        <button className="flex-1 py-4 rounded-2xl bg-green-100 text-green-600 hover:bg-green-200 transition-colors font-black text-center text-sm shadow-sm active:scale-95 cursor-pointer">PAY</button>
      </div>
    </div>
  </div>
);
};

function ScenarioVisual({ scenario, lang }: { scenario: Scenario; lang: string }) {
  switch (scenario.type) {
    case "call":      return <PhoneCallCard s={scenario} lang={lang} />;
    case "sms":       return <SmsCard s={scenario} />;
    case "whatsapp":  return <WhatsAppCard s={scenario} />;
    case "upi":       return <UpiCard s={scenario} />;
    default:          return null;
  }
}

const SafeOrScam = () => {
  const { elderlyMode, language, t, simplify } = useAppSettings();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ]   = useState(0);
  const [score, setScore]         = useState(0);
  const [answered, setAnswered]   = useState(false);
  const [selected, setSelected]   = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [speaking, setSpeaking]   = useState(false);

  const scenarios = language === "hi" ? scenariosHi : scenariosEn;
  const scenario  = scenarios[currentQ];
  const progress  = ((currentQ + (answered ? 1 : 0)) / scenarios.length) * 100;
  const isCorrect = selected === scenario.isScam;

  useEffect(() => {
    if (gameComplete) {
      const xp = parseInt(localStorage.getItem("dr_xp") || "0");
      localStorage.setItem("dr_xp", String(xp + score * 10));
      const badges: string[] = JSON.parse(localStorage.getItem("dr_badges") || "[]");
      if (!badges.includes("scam_spotter")) {
        badges.push("scam_spotter");
        localStorage.setItem("dr_badges", JSON.stringify(badges));
      }
    }
  }, [gameComplete]);

  const speakText = (text: string) => {
    window.speechSynthesis?.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = language === "hi" ? "hi-IN" : "en-IN";
    utt.rate = 0.88;
    setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const handleAnswer = (answeredScam: boolean) => {
    setSelected(answeredScam);
    setAnswered(true);
    if (answeredScam === scenario.isScam) setScore((s) => s + 1);
  };

  const handleNext = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    if (currentQ + 1 >= scenarios.length) {
      setGameComplete(true);
    } else {
      setCurrentQ((q) => q + 1);
      setAnswered(false);
      setSelected(null);
    }
  };

  if (gameComplete) {
    const pct = score / scenarios.length;
    const grade = pct >= 0.8 ? "🏆 Expert!" : pct >= 0.5 ? "👍 Good!" : "📚 Keep Learning!";
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-20 flex items-center justify-center">
          <div className={`glass rounded-[3rem] border border-border shadow-float text-center max-w-xl w-full animate-bounce-in ${
            elderlyMode ? "p-16" : "p-12"
          }`}>
            <div className="gradient-primary w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-card">
              {pct >= 0.8 ? "🏆" : pct >= 0.5 ? "⭐" : "📚"}
            </div>
            <h2 className={`font-black text-foreground mb-2 ${elderlyMode ? "text-5xl" : "text-4xl"}`}>
              {language === "hi" ? "आपका स्कोर" : "Your Score"}
            </h2>
            <p className={`text-gradient font-black mb-4 ${elderlyMode ? "text-8xl" : "text-7xl"}`}>
              {score}/{scenarios.length}
            </p>
            <p className={`font-bold text-muted-foreground mb-10 ${elderlyMode ? "text-2xl" : "text-xl"}`}>{grade}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => { setCurrentQ(0); setScore(0); setAnswered(false); setSelected(null); setGameComplete(false); }}
                className={`gradient-primary text-white rounded-2xl font-bold flex items-center gap-3 justify-center shadow-card hover:scale-105 transition-transform ${
                  elderlyMode ? "px-10 py-6 text-2xl" : "px-8 py-5 text-xl"
                }`}
              >
                <RotateCcw className="w-6 h-6" />
                {language === "hi" ? "फिर से खेलें" : "Play Again"}
              </button>
              <button
                onClick={() => navigate("/")}
                className={`bg-muted text-foreground rounded-2xl font-bold hover:bg-muted/80 transition-colors ${elderlyMode ? "px-10 py-6 text-2xl" : "px-8 py-5 text-xl"}`}
              >
                {language === "hi" ? "होम पर वापस" : "Back to Home"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header Area */}
      <div className="container mx-auto px-6 py-8 max-w-7xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`font-black text-foreground ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
                🎮 {t("game.title")}
              </h1>
              <p className={`text-muted-foreground font-bold mt-1 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                Question {currentQ + 1} of {scenarios.length} • {score} {language === "hi" ? "सही" : "correct"}
              </p>
            </div>
          </div>
          <button
            onClick={() => speaking ? window.speechSynthesis.cancel() : speakText(scenario.explanation)}
            className={`p-4 rounded-2xl transition-all shadow-sm ${speaking ? "gradient-primary text-white" : "bg-card border-2 hover:bg-muted"}`}
          >
            {speaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
        <Progress value={progress} className="h-3 rounded-full bg-muted" />
      </div>

      {/* Main Split Content */}
      <div className="container mx-auto px-6 pb-20 max-w-7xl flex flex-col lg:flex-row gap-12 items-start mt-4">
        
        {/* Left column: Phone visual */}
        <div className={`flex-1 w-full animate-fade-in-up flex justify-center py-4 ${answered && !isCorrect ? "animate-shake" : ""}`}>
           <ScenarioVisual scenario={scenario} lang={language} />
        </div>

        {/* Right column: Action Panel */}
        <div className="flex-1 w-full max-w-2xl bg-card rounded-[3rem] p-10 border-2 border-border shadow-float">
          
          <div className="flex items-center gap-4 mb-10">
            <span className={`px-4 py-2 rounded-2xl font-black text-white text-xs uppercase tracking-widest ${
              scenario.type === "call" ? "bg-blue-500" :
              scenario.type === "sms" ? "bg-green-500" :
              scenario.type === "whatsapp" ? "bg-emerald-600" : "bg-purple-600"
            }`}>
              {scenario.type === "call" ? "📞 PHONE CALL" : 
               scenario.type === "sms" ? "✉️ SMS MESSAGE" : 
               scenario.type === "whatsapp" ? "💬 WHATSAPP" : 
               scenario.type === "email" ? "📧 EMAIL" : "💳 UPI PAYMENT"}
            </span>
            <span className="text-foreground text-xl font-bold">
              {language === "hi" ? "क्या यह Safe है या Scam?" : "Is this Safe or a Scam?"}
            </span>
          </div>

          {!answered ? (
            <div className="grid grid-cols-1 gap-8 animate-fade-in-up">
              <button
                onClick={() => handleAnswer(false)}
                className={`rounded-[2rem] border-[3px] border-emerald-400 bg-emerald-50/50 text-emerald-600 font-black hover:bg-emerald-100 hover:scale-[1.02] transition-all shadow-sm flex items-center justify-center gap-3 ${
                  elderlyMode ? "py-8 text-3xl" : "py-6 text-2xl"
                }`}
              >
                {t("game.safe")}
              </button>
              
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-muted-foreground font-bold text-sm tracking-widest uppercase">OR</span>
                  <div className="flex-grow border-t border-border"></div>
              </div>

              <button
                onClick={() => handleAnswer(true)}
                className={`rounded-[2rem] border-[3px] border-red-400 bg-red-50/50 text-red-600 font-black hover:bg-red-100 hover:scale-[1.02] transition-all shadow-sm flex items-center justify-center gap-3 ${
                  elderlyMode ? "py-8 text-3xl" : "py-6 text-2xl"
                }`}
              >
                {t("game.scam")}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
              <div className={`rounded-3xl p-8 border-4 flex items-start gap-5 ${
                isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400"
                  : "bg-red-50 dark:bg-red-900/20 border-red-400"
              }`}>
                {isCorrect
                  ? <CheckCircle className="w-12 h-12 text-emerald-500 flex-shrink-0" />
                  : <XCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
                }
                <div>
                  <p className={`font-black mb-3 ${isCorrect ? "text-emerald-700" : "text-red-700"} ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
                    {isCorrect ? t("game.correct") : t("game.wrong")}
                  </p>
                  <p className={`leading-relaxed text-foreground font-medium ${elderlyMode ? "text-2xl" : "text-xl"}`}>
                    {simplify(scenario.explanation)}
                  </p>
                </div>
              </div>

              {scenario.redFlags && scenario.redFlags.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 rounded-3xl p-6 shadow-sm">
                  <p className={`font-black text-amber-800 dark:text-amber-400 mb-3 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                    🚩 {language === "hi" ? "Red Flags:" : "Red Flags Spotted:"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {scenario.redFlags.map((f, i) => (
                      <span key={i} className="px-4 py-2 bg-amber-200 dark:bg-amber-800/40 text-amber-900 dark:text-amber-200 rounded-lg text-sm font-black shadow-sm">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-muted rounded-3xl p-6 border-2 border-border">
                <p className={`font-black text-foreground mb-2 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                  💡 {t("game.whatToDo")}:
                </p>
                <p className={`text-muted-foreground font-semibold leading-relaxed ${elderlyMode ? "text-xl" : "text-lg"}`}>
                  {simplify(scenario.whatToDo)}
                </p>
              </div>

              <button
                onClick={handleNext}
                className={`w-full gradient-primary text-white rounded-2xl font-black shadow-card hover:scale-[1.02] active:scale-95 transition-all mt-4 ${
                  elderlyMode ? "py-8 text-2xl" : "py-6 text-xl"
                }`}
              >
                {currentQ + 1 >= scenarios.length
                  ? (language === "hi" ? "🏆 स्कोर देखें" : "🏆 See Score")
                  : (language === "hi" ? "अगला सवाल →" : "Next Question →")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafeOrScam;
