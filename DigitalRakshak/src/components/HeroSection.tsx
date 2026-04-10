import { ShieldCheck, Lightbulb } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";

const HeroSection = () => {
  const { elderlyMode, t } = useAppSettings();

  return (
    <section className="relative overflow-hidden pt-20 pb-28 text-center flex flex-col items-center justify-center min-h-[60vh]">
      {/* Wave decoration top */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, hsl(14 80% 58% / 0.1) 0%, transparent 60%)",
        }}
      />

      <div className="relative container mx-auto px-6 z-10 flex flex-col items-center justify-center max-w-4xl">
        {/* Tag pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-border text-sm font-bold mb-8 animate-fade-in-up shadow-glass text-primary">
          <ShieldCheck className="w-5 h-5" />
          {t("app.tagline")}
        </div>

        {/* Title */}
        <h1
          className={`font-black text-foreground leading-tight mb-8 animate-fade-in-up ${
            elderlyMode ? "text-7xl" : "text-6xl md:text-7xl"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          {t("hero.title1")}{" "}
          <span className="text-gradient block mt-2">{t("hero.title2")}</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-muted-foreground mb-10 animate-fade-in-up font-medium leading-relaxed max-w-2xl mx-auto ${
            elderlyMode ? "text-2xl" : "text-xl"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          {t("hero.subtitle")}
        </p>

        {/* Old Wisdom Empowerment Banner */}
        {elderlyMode && (
          <div className="bg-amber-100/50 border-2 border-amber-300 rounded-[2rem] p-6 lg:p-8 max-w-3xl mx-auto mt-6 shadow-sm animate-fade-in-up text-left flex flex-col sm:flex-row items-start gap-6" style={{ animationDelay: "0.3s" }}>
             <div className="w-16 h-16 bg-amber-400 text-amber-900 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
               <Lightbulb className="w-8 h-8" />
             </div>
             <div>
               <h3 className="font-black text-amber-900 text-3xl mb-3">Old Wisdom, New Tricks.</h3>
               <p className="text-amber-800 font-bold text-2xl leading-relaxed">
                 You would never hand your home keys to a stranger on the road. A "Digital Password" is just the key to your bank! You already know how to beat these tricksters in the real world—we just help you spot them on a screen.
               </p>
             </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
