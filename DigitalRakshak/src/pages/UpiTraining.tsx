import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, ArrowRight, ShieldCheck, User, Zap } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";

/* ─── Story Assets ─── */
const MeenaAvatar = ({ size = 64 }: { size?: number }) => (
  <img 
    src="/images/meena.jpg" 
    alt="Meena Didi" 
    className="rounded-full object-cover border-4 border-amber-200"
    style={{ width: size, height: size }}
  />
);

const RajuAvatar = ({ size = 64 }: { size?: number }) => (
  <img 
    src="/images/raju.png" 
    alt="Raju" 
    className="rounded-full object-cover border-4 border-blue-200"
    style={{ width: size, height: size }}
  />
);

const ScamyAvatar = ({ size = 64 }: { size?: number }) => (
  <img 
    src="/images/scamy.jpg" 
    alt="Scamy" 
    className="rounded-full object-cover border-4 border-red-200"
    style={{ width: size, height: size }}
  />
);

/* ─── Mock Phone Screen UI Components ─── */
const MockPhone = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[320px] mx-auto rounded-[3rem] border-[12px] border-slate-800 bg-slate-50 shadow-2xl overflow-hidden relative" style={{ height: "600px" }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
    {children}
  </div>
);

const AppMock = ({ amount, buttonText, onAction, actionColor = "bg-green-600" }: { amount?: string, buttonText: string, onAction?: () => void, actionColor?: string }) => (
  <div className="h-full flex flex-col pt-10">
    <div className="bg-primary text-white p-6 pb-8 text-center rounded-b-[2rem] shadow-sm">
      <User className="w-16 h-16 mx-auto mb-2 opacity-80" />
      <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Paying</p>
      <p className="text-2xl font-black">Raju (Grocery Store)</p>
      <p className="opacity-80">+91 98765 43210</p>
    </div>
    
    <div className="flex-1 px-6 flex flex-col justify-center gap-6">
      {amount ? (
        <div className="text-center">
          <p className="text-6xl font-black text-slate-800">
            <span className="text-4xl text-slate-400 font-medium">₹</span>{amount}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">Amount</p>
          <div className="flex items-center justify-center gap-2 border-b-2 border-primary pb-2">
            <span className="text-2xl text-slate-400">₹</span>
            <span className="text-4xl font-black text-slate-800">500</span>
          </div>
        </div>
      )}
    </div>

    <div className="p-6">
      <button 
        onClick={onAction}
        className={`w-full py-4 rounded-2xl text-white font-black text-lg transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${actionColor} hover:brightness-110`}
      >
        {buttonText} <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const PinMock = ({ onPin }: { onPin: () => void }) => {
  const [dots, setDots] = useState(0);
  return (
    <div className="h-full flex flex-col pt-12 pb-6 px-6 bg-slate-900 text-white">
      <div className="text-center mb-8">
        <p className="font-bold text-lg mb-2">ENTER UPI PIN</p>
        <p className="text-slate-400 text-sm">Raju (Grocery Store)</p>
      </div>
      
      <div className="flex justify-center gap-4 mb-12">
        {[1,2,3,4].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 border-slate-500 ${dots >= i ? 'bg-white border-white scale-125' : ''} transition-all`} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mt-auto">
        {[1,2,3,4,5,6,7,8,9].map(num => (
          <button 
            key={num} 
            onClick={() => setDots(d => Math.min(d + 1, 4))}
            className="h-16 rounded-full text-3xl font-medium hover:bg-slate-800 transition-colors"
          >
            {num}
          </button>
        ))}
        <button className="h-16 rounded-full hover:bg-slate-800 flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-slate-400" />
        </button>
        <button 
          onClick={() => setDots(d => Math.min(d + 1, 4))}
          className="h-16 rounded-full text-3xl font-medium hover:bg-slate-800 transition-colors"
        >
          0
        </button>
        <button 
          onClick={() => dots === 4 ? onPin() : null}
          className={`h-16 rounded-full flex items-center justify-center transition-colors ${dots === 4 ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-800'}`}
        >
           <Zap className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

/* ─── Story Steps ─── */
interface Step {
  id: number;
  character: "meena" | "raju" | "scammer";
  dialogueHi: string;
  dialogueEn: string;
  interactive?: "payButton" | "pinPad" | "scamChoice";
  tipHi?: string;
  tipEn?: string;
}

const STORY_STEPS: Step[] = [
  {
    id: 1,
    character: "meena",
    dialogueHi: "अरे राजू! मैं पहली बार बाज़ार में फोन से पैसे (UPI) देने की कोशिश कर रही हूँ। थोड़ा डर लग रहा है!",
    dialogueEn: "Hey Raju! I am trying to pay with my phone (UPI) at the market for the first time. I'm a bit scared!",
  },
  {
    id: 2,
    character: "raju",
    dialogueHi: "चिंता मत करो माँ! बस यह याद रखना: पैसे भेजने के लिए PIN डालना होता है, पैसे पाने के लिए नहीं।",
    dialogueEn: "Don't worry Mom! Just remember this golden rule: You only enter the PIN to SEND money, never to receive money.",
    tipHi: "गोल्डन रूल: PIN = पैसे कटेंगे।",
    tipEn: "Golden Rule: Entering PIN = Money goes OUT.",
  },
  {
    id: 3,
    character: "meena",
    dialogueHi: "ठीक है, मैंने QR कोड स्कैन कर लिया है। अब मुझे ₹500 भेजने हैं। मैं आगे क्या करूँ?",
    dialogueEn: "Okay, I have scanned the QR code. I need to send ₹500. What do I do next?",
    interactive: "payButton",
  },
  {
    id: 4,
    character: "raju",
    dialogueHi: "शाबाश माँ! अब सुरक्षित जगह देखकर अपना 4-अंकों का UPI PIN डालो। किसी को दिखाना मत!",
    dialogueEn: "Great job Mom! Now make sure nobody is looking, and enter your 4-digit UPI PIN.",
    interactive: "pinPad",
    tipHi: "अपना PIN हमेशा छुपा कर डालें।",
    tipEn: "Always hide your screen when entering your PIN.",
  },
  {
    id: 5,
    character: "meena",
    dialogueHi: "पैसे चले गए! यह तो बहुत आसान था! धन्यवाद बेटा।",
    dialogueEn: "Money sent! That was so easy! Thanks son.",
  },
  {
    id: 6,
    character: "scammer",
    dialogueHi: "नमस्ते मैडम! आपने एक 'कैशबैक ऑफर' जीता है! आपके खाते में ₹2000 भेजे जा रहे हैं। बस इसे 'Accept' करें और पैसे पाने के लिए अपना PIN डालें!",
    dialogueEn: "Hello Madam! You have won a 'Cashback Offer'! We are sending ₹2000 to your account. Just 'Accept' the request and enter your PIN to receive it!",
    interactive: "scamChoice",
  },
  {
    id: 7,
    character: "meena",
    dialogueHi: "अरे वाह! कैशबैक? रुको... राजू ने क्या कहा था?",
    dialogueEn: "Wow! Cashback? Wait... what did Raju say?",
  },
];

const UpiTraining = () => {
  const { elderlyMode, language } = useAppSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) {
      const xp = parseInt(localStorage.getItem("dr_xp") || "0");
      localStorage.setItem("dr_xp", String(xp + 50));
      const badges: string[] = JSON.parse(localStorage.getItem("dr_badges") || "[]");
      if (!badges.includes("upi_pro")) {
        badges.push("upi_pro");
        localStorage.setItem("dr_badges", JSON.stringify(badges));
      }
    }
  }, [completed]);

  const nextStep = () => {
    if (step < STORY_STEPS.length - 1) setStep(s => s + 1);
    else setCompleted(true);
  };

  const currentStory = STORY_STEPS[step];
  const progress = ((step) / (STORY_STEPS.length - 1)) * 100;

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-20 flex items-center justify-center max-w-7xl">
          <div className={`glass rounded-[3rem] shadow-float text-center max-w-2xl w-full border border-border animate-bounce-in p-12 ${elderlyMode ? "p-16" : ""}`}>
            <div className="gradient-teal w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-card text-white">
              <ShieldCheck className="w-16 h-16" />
            </div>
            <h2 className={`font-black text-foreground mb-4 ${elderlyMode ? "text-5xl" : "text-4xl"}`}>
              {language === "hi" ? "UPI ट्रेनिंग पूरी हुई!" : "UPI Training Complete!"}
            </h2>
            <p className={`text-muted-foreground font-medium mb-10 leading-relaxed ${elderlyMode ? "text-2xl" : "text-xl"}`}>
              {language === "hi" 
                ? "बहुत बढ़िया! मीना दीदी ने सफलतापूर्वक सुरक्षित भुगतान करना सीख लिया है। याद रखें: पैसे पाने के लिए कभी PIN नहीं डालना!"
                : "Excellent! Meena Didi successfully learned to pay safely. Remember: Never enter PIN to receive money!"}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className={`gradient-primary text-white rounded-2xl font-black shadow-card hover:scale-105 transition-transform ${elderlyMode ? "px-10 py-6 text-2xl" : "px-8 py-5 text-xl"}`}
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
      
      {/* Header Container */}
      <div className="container mx-auto px-6 py-8 max-w-6xl animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/")} className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className={`font-black text-foreground ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
              📱 {language === "hi" ? "UPI सुरक्षा ट्रेनिंग" : "UPI Safety Training"}
            </h1>
            <Progress value={progress} className="h-4 mt-4 rounded-full bg-muted shadow-inner" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20 max-w-6xl flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side: DIALOGUE AND CHARACTERS */}
        <div className="flex-1 w-full max-w-3xl flex flex-col gap-6">
          <div className="flex gap-5 animate-slide-up">
            <div className="flex-shrink-0 animate-bounce">
              {currentStory.character === "meena" && <MeenaAvatar size={100} />}
              {currentStory.character === "raju" && <RajuAvatar size={100} />}
              {currentStory.character === "scammer" && <ScamyAvatar size={100} />}
            </div>
            <div className={`flex flex-col gap-3 justify-center w-full`}>
              <p className={`font-black uppercase tracking-widest text-sm ${
                currentStory.character === "scammer" ? "text-red-500" : "text-primary"
              }`}>
                {currentStory.character.toUpperCase()}
              </p>
              <div className={`p-8 rounded-[2rem] shadow-sm font-medium border-2 ${elderlyMode ? "text-3xl" : "text-2xl"} leading-relaxed ${
                currentStory.character === "meena" ? "bg-amber-50 border-amber-200 text-amber-900 rounded-tl-sm" : 
                currentStory.character === "raju" ? "bg-blue-50 border-blue-200 text-blue-900 rounded-tl-sm" : 
                "bg-red-50 border-red-200 text-red-900 rounded-tl-sm font-bold"
              }`}>
                {language === "hi" ? currentStory.dialogueHi : currentStory.dialogueEn}
              </div>
            </div>
          </div>

          {(currentStory.tipHi || currentStory.tipEn) && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-[2rem] p-6 shadow-sm flex gap-4 ml-[120px] animate-fade-in-up mt-2">
              <span className="text-3xl">💡</span>
              <p className={`text-emerald-800 font-bold ${elderlyMode ? "text-2xl" : "text-xl"}`}>
                {language === "hi" ? currentStory.tipHi : currentStory.tipEn}
              </p>
            </div>
          )}

          {!currentStory.interactive && (
            <div className="ml-[120px] mt-4">
                <button
                onClick={nextStep}
                className={`gradient-primary text-white flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black shadow-card hover:scale-105 active:scale-95 transition-all ${elderlyMode ? "text-2xl" : "text-xl"}`}
                >
                {language === "hi" ? "आगे बढ़ें" : "Continue"} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
          )}
        </div>

        {/* Right Side: MOCK PHONE APP */}
        <div className="flex-1 w-full animate-fade-in-up shrink-0 flex justify-center">
          {currentStory.interactive === "payButton" && (
            <MockPhone>
              <AppMock 
                buttonText={language === "hi" ? "पे (PAY) ₹500" : "PAY ₹500"} 
                onAction={nextStep} 
              />
            </MockPhone>
          )}

          {currentStory.interactive === "pinPad" && (
            <MockPhone>
              <PinMock onPin={nextStep} />
            </MockPhone>
          )}

          {currentStory.interactive === "scamChoice" && (
            <MockPhone>
              <div className="h-full flex flex-col pt-12 px-6 bg-slate-50 relative">
                  <div className="absolute top-0 left-0 right-0 h-32 bg-red-600 rounded-b-[2rem] shadow-sm -z-0"></div>
                  
                  <div className="bg-white rounded-3xl shadow-xl p-6 relative z-10 text-center border-t-8 border-red-500 mt-8 mb-auto">
                      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 -mt-14 ring-4 ring-white shadow-sm">
                          <User className="w-8 h-8" />
                      </div>
                      <p className="text-red-500 font-black tracking-widest uppercase text-xs mb-1">CASHBACK REWARD (FAKE)</p>
                      <p className="text-4xl font-black text-slate-800 mb-2">₹2,000</p>
                      <p className="text-slate-500 font-medium text-sm">is requested from you</p>
                  </div>

                  <div className="flex flex-col gap-4 mb-8">
                    <button 
                      onClick={() => alert(language === "hi" ? "गलत! पैसे पाने के लिए कभी PIN नहीं डालना चाहिए। दोबारा कोशिश करें।" : "Wrong! Never enter your PIN to receive money. Try again.")}
                      className="w-full py-4 rounded-2xl bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-black text-lg transition-colors shadow-sm"
                    >
                      {language === "hi" ? "PIN डालें और पैसे लें" : "Enter PIN & Receive"} ❌
                    </button>
                    <button 
                      onClick={nextStep}
                      className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl transition-transform active:scale-95 shadow-md flex justify-center items-center gap-2"
                    >
                      {language === "hi" ? "डिक्लाइन करें (DECLINE)" : "DECLINE"} 🛡️
                    </button>
                  </div>
              </div>
            </MockPhone>
          )}

          {!currentStory.interactive && step < 5 && (
            <div className="w-[320px] h-[600px] border-4 border-dashed border-border rounded-[3rem] flex items-center justify-center text-muted-foreground bg-muted/30">
              <p className="font-bold text-lg">{language === "hi" ? "सिमुलेशन यहाँ दिखेगा" : "Simulation appears here"}</p>
            </div>
          )}
          
          {!currentStory.interactive && step === 5 && (
            <MockPhone>
              <div className="h-full bg-emerald-50 border-4 border-emerald-500 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center text-emerald-800">
                  <div className="w-24 h-24 bg-emerald-500 rounded-full text-white flex items-center justify-center mb-6 shadow-lg rotate-12">
                      <ShieldCheck className="w-12 h-12" />
                  </div>
                  <p className="text-3xl font-black mb-2">₹500</p>
                  <p className="font-bold text-lg">{language === "hi" ? "सफलतापूर्वक भेजे गए!" : "Sent Successfully!"}</p>
              </div>
            </MockPhone>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpiTraining;
