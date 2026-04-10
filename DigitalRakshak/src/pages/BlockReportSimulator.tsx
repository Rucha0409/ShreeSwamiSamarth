import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Phone, PhoneOff, AlertTriangle, ShieldCheck, 
  User, MessageSquare, History, Ban, CheckCircle2, ShieldAlert
} from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import Navbar from "@/components/Navbar";

const BlockReportSimulator = () => {
  const { elderlyMode, simplify, t } = useAppSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); 
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleAnswer = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleDecline = () => {
    setShowError(false);
    setStep(1); // Proceed to Call Log
  };

  const handleCallerTap = () => {
    setStep(2); // Proceed to Caller Details
  };

  const handleBlockReportBtn = () => {
    setStep(3); // Proceed to Modal
  };

  const handleSubmitReport = () => {
    if (reportReason !== "scam") {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setStep(4); // Success
  };

  const getPhoneUI = () => {
    switch (step) {
      case 0:
        return (
          <div className="h-full flex flex-col bg-red-600 rounded-3xl overflow-hidden relative shadow-2xl animate-pulse">
            <div className="p-8 text-center mt-10">
              <AlertTriangle className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-white font-black text-2xl tracking-widest uppercase mb-2">SPAM REPORTED</h2>
              <p className="text-red-200 font-bold text-lg mb-8">10,000+ reports</p>
              
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-6">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-white font-black text-3xl mb-1">Customer Care</h3>
              <p className="text-white/80 font-bold text-xl">+91 98765-XXXXX</p>
              <p className="text-white/80 font-bold text-lg mt-2">New Delhi, India</p>

              {showError && (
                <div className="mt-8 bg-black/40 text-white p-4 rounded-2xl font-bold animate-bounce-in">
                  ❌ Incorrect! Never answer calls marked as spam. Tap Decline.
                </div>
              )}
            </div>
            
            <div className="mt-auto p-10 flex justify-between bg-black/10">
              <button onClick={handleDecline} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <PhoneOff className="w-8 h-8 text-white" />
                </div>
                <span className="text-white font-bold tracking-widest">DECLINE</span>
              </button>
              
              <button onClick={handleAnswer} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg animate-bounce">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <span className="text-white font-bold tracking-widest">ANSWER</span>
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="h-full flex flex-col bg-slate-50 rounded-3xl overflow-hidden shadow-2xl animate-fade-in text-gray-900 border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-white">
               <h2 className="font-black text-2xl">Recent Calls</h2>
            </div>
            <div className="flex-1 p-2">
              <div 
                onClick={handleCallerTap}
                className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-red-600 text-lg">Customer Care (Spam)</p>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <PhoneOff className="w-3 h-3 text-red-500" /> Missed • Just now
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center text-gray-500">
                  ℹ️
                </div>
              </div>

              <div className="p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Mom</p>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      Incoming • 2 hrs ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col bg-slate-50 rounded-3xl overflow-hidden shadow-2xl animate-slide-up text-gray-900 border border-gray-200">
             <div className="p-6 border-b border-gray-200 bg-white flex items-center gap-4">
               <ArrowLeft className="w-6 h-6 text-gray-500" />
               <h2 className="font-black text-xl">Contact Info</h2>
             </div>
             
             <div className="p-6 text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                   <User className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="font-black text-2xl text-red-600">Customer Care</h3>
                <p className="text-gray-500 font-bold text-lg">+91 98765-XXXXX</p>
                <div className="mt-4 bg-red-600 text-white px-4 py-2 rounded-xl inline-flex items-center gap-2 font-bold text-sm shadow-md">
                   <AlertTriangle className="w-4 h-4" /> SPAM REPORTED
                </div>
             </div>

             <div className="grid grid-cols-4 gap-2 px-6 pb-6 border-b border-gray-200">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                   <div className="w-12 h-12 bg-white rounded-full border shadow-sm flex items-center justify-center"><Phone className="w-5 h-5"/></div>
                   <span className="text-xs font-bold">Call</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-gray-500">
                   <div className="w-12 h-12 bg-white rounded-full border shadow-sm flex items-center justify-center"><MessageSquare className="w-5 h-5"/></div>
                   <span className="text-xs font-bold">Text</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-gray-500">
                   <div className="w-12 h-12 bg-white rounded-full border shadow-sm flex items-center justify-center"><History className="w-5 h-5"/></div>
                   <span className="text-xs font-bold">History</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-red-600" onClick={handleBlockReportBtn}>
                   <div className="w-12 h-12 bg-red-100 rounded-full border border-red-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-red-200 hover:scale-110 transition-all"><Ban className="w-5 h-5"/></div>
                   <span className="text-xs font-black">Block</span>
                </div>
             </div>

             <div className="flex-1 bg-white p-6">
               <button 
                  onClick={handleBlockReportBtn}
                  className="w-full flex items-center gap-4 text-red-600 font-bold p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <Ban className="w-6 h-6" /> Block & Report Spam
               </button>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col bg-black/60 rounded-3xl overflow-hidden shadow-2xl relative text-gray-900 border border-gray-200">
             {/* Background content blurred out */}
             <div className="absolute inset-0 p-6 flex flex-col bg-slate-50 filter blur-sm">
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto" />
             </div>
             
             {/* Report Modal */}
             <div className="mt-auto bg-white rounded-t-[2.5rem] p-8 shadow-2xl relative z-10 animate-slide-up">
                <h3 className="font-black text-2xl text-gray-900 mb-2">Block & Report</h3>
                <p className="text-gray-500 font-bold mb-6">Help keep others safe by selecting a reason.</p>
                
                <div className="space-y-3 mb-8">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${reportReason === 'sales' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" className="w-5 h-5 accent-blue-600" name="reason" value="sales" onChange={() => setReportReason('sales')} />
                    <span className="font-bold text-lg">Sales/Telemarketing</span>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${reportReason === 'scam' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" className="w-5 h-5 accent-red-600" name="reason" value="scam" onChange={() => setReportReason('scam')} />
                    <span className="font-bold text-lg text-red-600">Scam/Fraud</span>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${reportReason === 'harassment' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" className="w-5 h-5 accent-blue-600" name="reason" value="harassment" onChange={() => setReportReason('harassment')} />
                    <span className="font-bold text-lg">Harassment</span>
                  </label>
                </div>

                {showError && (
                  <p className="text-red-500 font-bold mb-4 animate-shake text-center">
                     Make sure to report it as Scam/Fraud!
                  </p>
                )}

                <button 
                  onClick={handleSubmitReport}
                  disabled={!reportReason}
                  className="w-full bg-red-600 text-white font-black py-4 rounded-xl disabled:opacity-50 active:scale-95 transition-all text-xl"
                >
                  Block Number
                </button>
             </div>
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col bg-emerald-500 rounded-3xl overflow-hidden shadow-2xl animate-fade-in text-white justify-center items-center text-center p-8">
             <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-card animate-bounce-in">
               <ShieldCheck className="w-20 h-20 text-emerald-500" />
             </div>
             <h2 className="font-black text-4xl mb-4">You did it!</h2>
             <p className="text-emerald-100 font-bold text-xl mb-12 leading-relaxed">
               By declining the call and reporting the number, you stayed safe and helped protect millions of others in India from this scam.
             </p>
             <button 
                onClick={() => navigate("/simulators")}
                className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xl shadow-lg hover:scale-105 transition-transform"
             >
               Go back to Hub
             </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-7xl animate-fade-in flex flex-col lg:flex-row gap-12">
        {/* Left Side: Context Panel */}
        <div className="flex-1 w-full max-w-2xl">
           <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate("/simulators")} className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`font-black text-foreground flex items-center gap-3 ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
                <ShieldAlert className="w-8 h-8 text-red-600" />
                Block & Report
              </h1>
            </div>
           </div>

           <div className="bg-card rounded-[3rem] p-8 lg:p-10 border-2 border-border shadow-float relative">
              
              <div className="mb-8">
                <span className="px-4 py-2 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-red-600">
                  ⚠️ INCOMING CALL
                </span>
                <h2 className={`mt-4 font-black text-foreground ${elderlyMode ? "text-3xl" : "text-2xl"}`}>
                  {step === 0 && "Your phone is ringing. What should you do?"}
                  {step === 1 && "Great! Now let's view recent calls to block them."}
                  {step === 2 && "Tap the Block button to restrict this number."}
                  {step === 3 && "Select why you are reporting them so the network knows."}
                  {step === 4 && "Simulation Complete!"}
                </h2>
                <p className={`mt-4 text-muted-foreground font-semibold leading-relaxed ${elderlyMode ? "text-xl" : "text-lg"}`}>
                  {step === 0 && simplify("When you see a caller ID colored red with 'SPAM REPORTED', it means thousands of users have flagged it as a fraudster. Never answer to talk to them, as they can record your voice.")}
                  {step === 1 && simplify("You declined the call. Now tap on the red missed call in your call log to see more options.")}
                  {step === 2 && simplify("Here you can see the caller's details. Find the 'Block' or 'Block & Report' button and tap on it.")}
                  {step === 3 && simplify("Always select 'Scam/Fraud' if they are a malicious caller. This updates the global Caller ID system, helping everyone.")}
                  {step === 4 && simplify("You have successfully learned how to block and report a scammer. Excellent work!")}
                </p>
              </div>

              {/* Progress UI */}
              <div className="flex gap-2 w-full mt-10">
                {[0, 1, 2, 3, 4].map(s => (
                  <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? "bg-red-500" : "bg-muted"}`} />
                ))}
              </div>
           </div>
        </div>

        {/* Right Side: Phone Visual */}
        <div className="flex-none lg:w-[400px] flex justify-center py-4">
           {/* Phone Frame */}
           <div className="phone-frame w-[340px] h-[720px] bg-black rounded-[3rem] p-3 shadow-2xl relative">
              {/* Screen Content */}
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                 {/* Top Status Bar (fake) */}
                 <div className="absolute top-0 w-full h-8 flex items-center justify-between px-6 z-50 pointer-events-none">
                    <span className={`text-xs font-bold ${step === 0 ? "text-white" : "text-gray-900"}`}>12:30</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${step === 0 ? "bg-white" : "bg-gray-900"}`} />
                      <div className={`w-4 h-3 rounded-full ${step === 0 ? "bg-white" : "bg-gray-900"}`} />
                    </div>
                 </div>
                 {getPhoneUI()}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
export default BlockReportSimulator;
