import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ShieldAlert, Download, AlertTriangle, ShieldCheck,
  Smartphone, FileWarning, Settings, Trash2, X
} from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import Navbar from "@/components/Navbar";

const ApkSimulator = () => {
  const { elderlyMode, simplify } = useAppSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); 
  const [showError, setShowError] = useState(false);

  const handleError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3500);
  };

  const handleLinkClick = () => {
    setShowError(false);
    setStep(1); // Proceed to Browser Warning
  };

  const handleBrowserCancel = () => {
    setStep(4); // Success! They didn't even download it.
  };

  const handleBrowserDownload = () => {
    setStep(2); // Proceed to Chrome Download UI
  };

  const handleOpenApk = () => {
    setStep(3); // Proceed to Android Install Warning
  };

  const handleCancelInstall = () => {
    setStep(4); // Success! They canceled the install.
  };

  const getPhoneUI = () => {
    switch (step) {
      case 0:
        return (
          <div className="h-full flex flex-col bg-[#e5ddd5] rounded-3xl overflow-hidden relative shadow-2xl text-gray-900 border border-gray-200">
             <div className="bg-[#075e54] text-white p-4 font-bold flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                   <User className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-lg">Electricity Board</p>
                   <p className="text-xs text-white/70">online</p>
                </div>
             </div>
             
             <div className="flex-1 p-4 flex flex-col justify-end space-y-4 pb-16">
                <div className="bg-white p-4 rounded-xl shadow-sm max-w-[85%] relative self-start">
                   <p className="text-black font-bold mb-2">
                     Dear Customer, your electricity power will be disconnected at 9:30 PM tonight. 
                     Your previous month bill was not updated.
                   </p>
                   <p className="text-black mb-2">
                     Please download the official app to pay ₹10 immediately:
                   </p>
                   <div 
                      onClick={handleLinkClick}
                      className="text-blue-600 underline font-black text-lg cursor-pointer hover:bg-blue-50 p-2 rounded-lg break-words"
                   >
                     http://bit.ly/update-bill-app-apk
                   </div>
                   <p className="text-right text-gray-400 text-xs mt-2">12:28 PM</p>
                   <div className="absolute top-0 -left-2 w-4 h-4 bg-white transform rotate-45"></div>
                </div>

                {showError && (
                  <div className="bg-red-600 text-white p-4 rounded-2xl font-bold animate-bounce-in shadow-xl mx-2">
                    ❌ Incorrect! Don't reply. Tap the blue link to see what happens next.
                  </div>
                )}
             </div>

             <div className="bg-[#f0f0f0] p-4 flex items-center gap-4 absolute bottom-0 w-full animate-slide-up">
                <div className="bg-white flex-1 rounded-full px-4 py-3 text-gray-500 font-bold flex items-center justify-between shadow-sm cursor-pointer" onClick={handleError}>
                   Type a message
                   <span className="text-2xl opacity-50">📱</span>
                </div>
             </div>
          </div>
        );
      case 1:
        return (
          <div className="h-full flex flex-col bg-slate-50 rounded-3xl overflow-hidden shadow-2xl animate-fade-in text-gray-900 border border-gray-200">
            <div className="bg-gray-200 p-4 flex items-center gap-4">
               <ArrowLeft className="w-5 h-5 text-gray-600" />
               <div className="bg-white flex-1 p-2 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                  <span>🔒</span> bit.ly/update-bill-app-apk
               </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
               <FileWarning className="w-24 h-44 text-amber-500 mb-6 animate-pulse" />
               <h2 className="font-black text-2xl text-gray-900 mb-4">File might be harmful</h2>
               <p className="text-gray-600 font-bold mb-8 text-lg">
                 Do you want to download <strong>Electricity_Bill_Update.apk</strong> anyway?
               </p>
               
               <div className="w-full space-y-4">
                 <button onClick={handleBrowserCancel} className="w-full p-4 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                   Cancel
                 </button>
                 <button onClick={handleBrowserDownload} className="w-full p-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md">
                   Download anyway
                 </button>
               </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col bg-slate-50 rounded-3xl overflow-hidden shadow-2xl animate-fade-in text-gray-900 border border-gray-200">
            <div className="bg-gray-200 p-4 flex items-center gap-4">
               <ArrowLeft className="w-5 h-5 text-gray-600" />
               <div className="bg-white flex-1 p-2 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                  <span>🔒</span> bit.ly/update-bill-app-apk
               </div>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-end">
               {/* Fixed bottom snackbar */}
               <div className="bg-gray-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-slide-up mb-4 mx-2">
                 <div className="flex items-center gap-3">
                    <Download className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="font-bold">File downloaded</p>
                      <p className="text-xs text-gray-400">Electricity_Bill_Update.apk · 2.4 MB</p>
                    </div>
                 </div>
                 <button onClick={handleOpenApk} className="text-blue-400 font-black uppercase tracking-wider px-2 py-1">
                   Open
                 </button>
               </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col bg-slate-100 rounded-3xl overflow-hidden shadow-2xl animate-slide-up text-gray-900 border border-gray-200 justify-center relative">
             
             {/* Dim background */}
             <div className="absolute inset-0 bg-black/40 z-0"></div>

             {/* Android System UI Modal */}
             <div className="bg-white rounded-t-3xl sm:rounded-2xl m-4 p-6 shadow-2xl relative z-10">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-blue-200 shadow-sm">
                   <Settings className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-black text-2xl text-center mb-2">Electricity Bill Update</h3>
                <p className="text-gray-600 text-center mb-8 font-bold">
                   Do you want to install this application? It will have access to:
                </p>

                <div className="space-y-3 mb-8 bg-amber-50 p-4 rounded-xl border border-amber-200">
                   <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                     ⚠️ Read all SMS messages
                   </p>
                   <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                     ⚠️ Intercept calls
                   </p>
                   <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                     ⚠️ Access contacts
                   </p>
                </div>

                {showError && (
                  <p className="text-red-500 font-bold mb-4 animate-shake text-center">
                     Installing this will compromise your phone! Tap Cancel.
                  </p>
                )}

                <div className="flex gap-4">
                  <button onClick={handleCancelInstall} className="flex-1 py-4 text-gray-600 font-black rounded-xl hover:bg-gray-100">
                    Cancel
                  </button>
                  <button onClick={handleError} className="flex-1 py-4 text-blue-600 font-black rounded-xl hover:bg-blue-50">
                    Install
                  </button>
                </div>
             </div>
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col bg-emerald-500 rounded-3xl overflow-hidden shadow-2xl animate-fade-in text-white justify-center items-center text-center p-8">
             <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-card animate-bounce-in relative">
               <ShieldCheck className="w-20 h-20 text-emerald-500" />
               <div className="absolute -bottom-2 -right-2 bg-red-500 text-white rounded-full p-2 border-4 border-emerald-500 animate-pulse">
                  <Trash2 className="w-6 h-6" />
               </div>
             </div>
             <h2 className="font-black text-4xl mb-4">Threat Averted!</h2>
             <p className="text-emerald-100 font-bold text-xl mb-12 leading-relaxed">
               By canceling the installation, you prevented a dangerous app from stealing your banking messages and passwords.
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
                <Download className="w-8 h-8 text-red-600" />
                Dangerous App Download
              </h1>
            </div>
           </div>

           <div className="bg-card rounded-[3rem] p-8 lg:p-10 border-2 border-border shadow-float relative">
              
              <div className="mb-8">
                <span className="px-4 py-2 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-red-600">
                  ⚠️ MALWARE SIMULATION
                </span>
                <h2 className={`mt-4 font-black text-foreground ${elderlyMode ? "text-3xl" : "text-2xl"}`}>
                  {step === 0 && "You received an urgent electricity bill message."}
                  {step === 1 && "Your phone browser is warning you."}
                  {step === 2 && "The file has downloaded. What happens if you open it?"}
                  {step === 3 && "The installation screen. Read the permissions!"}
                  {step === 4 && "Simulation Complete!"}
                </h2>
                <p className={`mt-4 text-muted-foreground font-semibold leading-relaxed ${elderlyMode ? "text-xl" : "text-lg"}`}>
                  {step === 0 && simplify("Scammers often send fake messages threatening to cut your electricity. They provide a link to download an APK file to 'pay'. Tap the blue link to see how this scam progresses.")}
                  {step === 1 && simplify("When you try to download an APK (Android Package Kit) from a random website, Android will warn you. It is best to tap Cancel right here. But for the simulation, tap 'Download anyway'.")}
                  {step === 2 && simplify("The malicious file is now on your device, but it hasn't infected you yet. Tap 'Open' to start the installation.")}
                  {step === 3 && simplify("This is the most critical step. Look at the permissions! A simple bill payment app does NOT need to read your SMS messages. If you install this, the scammer can read your bank OTPs. Tap Cancel.")}
                  {step === 4 && simplify("You successfully stopped the malware. Always remember: Never install applications from outside the official Google Play Store or Apple App Store.")}
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
export default ApkSimulator;
