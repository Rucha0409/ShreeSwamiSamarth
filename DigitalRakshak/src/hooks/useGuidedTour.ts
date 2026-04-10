import { useState, useEffect } from "react";

export const useGuidedTour = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("digirakshak_tour_completed");
    if (!hasSeenTour) {
      // Small delay so UI renders first
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem("digirakshak_tour_completed", "true");
    setShowTour(false);
  };

  const restartTour = () => {
    setShowTour(true);
  };

  return { showTour, completeTour, restartTour };
};
