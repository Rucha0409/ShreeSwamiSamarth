import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ActionCards from "@/components/ActionCards";
import ChaturGuidedTour from "@/components/ChaturGuidedTour";
import { useGuidedTour } from "@/hooks/useGuidedTour";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { language, elderlyMode } = useAppSettings();
  const { showTour, completeTour, restartTour } = useGuidedTour();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "relative") {
      navigate("/progress");
    }
  }, [user, navigate]);

  if (user && user.role === "relative") return null;

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <Navbar />
      <HeroSection />
      <ActionCards />

      {/* Add tour button so users can restart */}
      <button
        onClick={restartTour}
        className="fixed bottom-24 left-4 z-40 bg-white border border-orange-200 text-orange-500 text-xs px-3 py-2 rounded-full shadow-md hover:bg-orange-50"
      >
        🛡️ Tour
      </button>

      {showTour && (
        <ChaturGuidedTour
          lang={language}
          elderlyMode={elderlyMode}
          onComplete={completeTour}
        />
      )}
    </div>
  );
};

export default Index;
