import { Shield, Moon, Sun, Globe, Accessibility, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppSettings, type Language } from "@/context/AppSettingsContext";
import { useAuth } from "@/context/AuthContext";

const fontScales = ["small", "medium", "large", "xl"] as const;
const languages: { code: Language; flag: string; label: string }[] = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "hi", flag: "🇮🇳", label: "हिन्दी" },
  { code: "mr", flag: "🇮🇳", label: "मराठी" },
  { code: "ta", flag: "🇮🇳", label: "தமிழ்" },
  { code: "te", flag: "🇮🇳", label: "తెలుగు" },
  { code: "pa", flag: "🇮🇳", label: "ਪੰਜਾਬੀ" },
];

const fontLabels = { small: "A", medium: "A", large: "A", xl: "A" };
const fontSizes  = { small: "text-xs", medium: "text-sm", large: "text-base", xl: "text-lg" };

const navLinks = [
  { labelKey: "nav.home", route: "/" },
  { labelKey: "nav.quiz", route: "/game" },
  { labelKey: "nav.sandbox", route: "/simulators" },
  { labelKey: "nav.scamy", route: "/scam-simulator" },
  { labelKey: "nav.badges", route: "/progress" },
];

const Navbar = () => {
  const { darkMode, setDarkMode, elderlyMode, setElderlyMode, language, setLanguage, fontScale, setFontScale, t } =
    useAppSettings();
  const { user, logout } = useAuth();
  const isRelative = user?.role === "relative";
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isElderly = elderlyMode;

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 max-w-7xl">
        {/* Logo */}
        <a href="/" data-tour="navbar-logo" className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
          <div className="gradient-primary p-2 rounded-2xl shadow-card">
            <Shield className={`text-white ${isElderly ? "w-8 h-8" : "w-6 h-6"}`} />
          </div>
          <span className={`font-black text-foreground tracking-tight ${isElderly ? "text-3xl" : "text-2xl"}`}>
            Digi<span className="text-gradient">Rakshak</span>
          </span>
        </a>

        {/* Desktop Web Navigation Links */}
        {!isRelative && (
          <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ labelKey, route }) => (
            <a
              key={route}
              href={route}
              data-tour={route === "/progress" ? "badges-nav" : undefined}
              className={`font-bold transition-all hover:text-primary ${
                window.location.pathname === route ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              } ${isElderly ? "text-xl px-2 py-2" : "text-base px-1 py-1"}`}
            >
              {t(labelKey) || labelKey}
            </a>
          ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Auth Button */}
          {(() => {
            if (user) {
              return (
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className={`font-bold text-orange-500 hover:text-orange-600 transition-colors ${isElderly ? "text-lg px-2" : "text-sm px-2"}`}
                >
                  Logout ({user.name.split(" ")[0]})
                </button>
              );
            }
            return (
              <a
                href="/login"
                className={`font-bold gradient-primary text-white rounded-xl shadow-md transition-all active:scale-95 ${isElderly ? "text-lg px-4 py-2" : "text-sm px-4 py-2"}`}
              >
                Log In
              </a>
            );
          })()}

          {/* Additional Controls (Hidden for Relative) */}
          {!isRelative && (
            <>
              {/* Font size */}
              {!isElderly && (
            <div className="hidden sm:flex items-center gap-0.5 bg-muted rounded-xl p-1">
              {fontScales.map((s) => (
                <button
                  key={s}
                  onClick={() => setFontScale(s)}
                  className={`w-8 h-8 rounded-lg font-black transition-all flex items-center justify-center ${
                    fontSizes[s]
                  } ${
                    fontScale === s
                      ? "gradient-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={`Font size ${s}`}
                >
                  {fontLabels[s]}
                </button>
              ))}
            </div>
          )}

          {/* Language picker */}
          <div ref={langRef} className="relative">
            <button
              data-tour="language-toggle"
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all font-bold ${
                isElderly ? "text-lg" : "text-sm"
              }`}
            >
              <Globe className={isElderly ? "w-5 h-5" : "w-4 h-4"} />
              <span className="hidden sm:inline">
                {languages.find((l) => l.code === language)?.flag}{" "}
                {languages.find((l) => l.code === language)?.label}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-float overflow-hidden z-50 min-w-[180px]">
                {languages.map(({ code, flag, label }) => (
                  <button
                    key={code}
                    onClick={() => { setLanguage(code); setLangOpen(false); }}
                    className={`w-full text-left px-5 py-3.5 flex items-center gap-3 transition-colors ${
                      language === code
                        ? "gradient-primary text-white font-bold"
                        : "text-foreground hover:bg-muted font-bold"
                    } ${isElderly ? "text-lg" : "text-base"}`}
                  >
                    <span>{flag}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all ${
              isElderly ? "p-3" : "p-2.5"
            }`}
          >
            {darkMode
              ? <Sun className={isElderly ? "w-6 h-6" : "w-5 h-5"} />
              : <Moon className={isElderly ? "w-6 h-6" : "w-5 h-5"} />}
          </button>

          {/* Elderly mode */}
          <button
            data-tour="elderly-mode"
            onClick={() => setElderlyMode(!elderlyMode)}
            className={`flex items-center gap-2 px-4 rounded-xl transition-all font-bold ${
              isElderly
                ? "gradient-primary text-white shadow-card py-3.5"
                : "bg-muted text-muted-foreground hover:text-foreground py-2.5 text-sm"
            }`}
          >
            <Accessibility className={isElderly ? "w-6 h-6" : "w-5 h-5"} />
            <span className={`hidden md:inline ${isElderly ? "text-lg" : "text-sm"}`}>
              {t("settings.elderly")}
            </span>
          </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
