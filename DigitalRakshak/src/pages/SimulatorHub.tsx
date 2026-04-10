import { useNavigate } from "react-router-dom";
import { ArrowLeft, SmartphoneNfc, Laptop, Download, ShieldAlert, BadgeCheck } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import Navbar from "@/components/Navbar";

const SimulatorHub = () => {
  const { elderlyMode, simplify } = useAppSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-7xl animate-fade-in">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate("/")} className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className={`font-black text-foreground flex items-center gap-3 ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
              <ShieldAlert className="w-8 h-8 text-teal-600" />
              {simplify("Safety Simulators Sandbox")}
            </h1>
            <p className={`text-muted-foreground font-bold mt-1 ${elderlyMode ? "text-xl" : "text-lg"}`}>
              {simplify("Practice your defense in safe, simulated environments")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. UPI Sandbox (Existing) */}
          <div className="bg-card rounded-[2.5rem] p-8 border-2 border-border shadow-float hover:-translate-y-1 transition-all flex flex-col items-start gap-4">
            <div className="bg-teal-100 p-4 rounded-full text-teal-600 mb-2 shadow-sm">
              <SmartphoneNfc className="w-8 h-8" />
            </div>
            <div>
              <h3 className={`font-black text-foreground ${elderlyMode ? "text-3xl" : "text-2xl"}`}>UPI Safety</h3>
              <p className={`text-muted-foreground mt-2 font-bold ${elderlyMode ? "text-xl" : "text-base"}`}>
                 {simplify("Learn exactly how to use UPI safely and avoid the common Collect Request trap.")}
              </p>
            </div>
            <button 
              onClick={() => navigate("/upi-training")}
              className={`mt-auto bg-teal-600 text-white rounded-xl font-bold w-full active:scale-95 transition-all shadow-md ${elderlyMode ? "py-4 text-xl" : "py-3"}`}
            >
              Start Simulation
            </button>
          </div>

          {/* 2. Block & Report Sandbox */}
          <div className="bg-card rounded-[2.5rem] p-8 border-2 border-border shadow-float hover:-translate-y-1 transition-all flex flex-col items-start gap-4">
            <div className="bg-red-100 p-4 rounded-full text-red-600 mb-2 shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className={`font-black text-foreground ${elderlyMode ? "text-3xl" : "text-2xl"}`}>Block & Report Spam</h3>
              <p className={`text-muted-foreground mt-2 font-bold ${elderlyMode ? "text-xl" : "text-base"}`}>
                 {simplify("Practice identifying spam callers and learn how to properly block and report them.")}
              </p>
            </div>
            <button 
              onClick={() => navigate("/block-report")}
              className={`mt-auto bg-red-600 text-white rounded-xl font-bold w-full active:scale-95 transition-all shadow-md ${elderlyMode ? "py-4 text-xl" : "py-3"}`}
            >
              Start Simulation
            </button>
          </div>

          {/* 3. Dangerous APK Sandbox Placeholder */}
          <div className="bg-card rounded-[2.5rem] p-8 border-2 border-dashed border-border flex flex-col items-start gap-4 relative overflow-hidden group">
            <div className="bg-red-100 p-4 rounded-full text-red-600 mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <Download className="w-8 h-8" />
            </div>
            <div className="opacity-60 group-hover:opacity-100 transition-opacity">
              <h3 className={`font-black text-foreground ${elderlyMode ? "text-3xl" : "text-2xl"}`}>Dangerous App Download</h3>
              <p className={`text-muted-foreground mt-2 font-bold ${elderlyMode ? "text-xl" : "text-base"}`}>
                 {simplify("Practice identifying and stopping the installation of dangerous fake apps disguised as utility bills.")}
              </p>
            </div>
            <div className={`mt-auto rounded-xl font-black w-full bg-muted text-center text-muted-foreground flex items-center justify-center gap-2 shadow-inner ${elderlyMode ? "py-4 text-xl" : "py-3"}`}>
              ⏳ Coming Soon
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default SimulatorHub;
