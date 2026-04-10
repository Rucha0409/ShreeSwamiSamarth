import { useNavigate, useLocation } from "react-router-dom";
import { Home, Gamepad2, Smartphone, Bot, Trophy } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";

const navItems = [
  { icon: Home,        label: "nav.home",    route: "/" },
  { icon: Gamepad2,    label: "nav.quiz",    route: "/game" },
  { icon: Smartphone,  label: "nav.upi",     route: "/upi-training" },
  { icon: Bot,         label: "nav.scamy",   route: "/scam-simulator" },
  { icon: Trophy,      label: "nav.badges",  route: "/progress" },
];

const labelFallbacks: Record<string, string> = {
  "nav.home":   "Home",
  "nav.quiz":   "Quiz",
  "nav.upi":    "UPI",
  "nav.scamy":  "Scamy",
  "nav.badges": "Badges",
};

export default function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { elderlyMode, t } = useAppSettings();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border"
      style={{
        boxShadow: "0 -4px 24px hsl(14 80% 58% / 0.10)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, label, route }) => {
          const active = location.pathname === route;
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 ${
                elderlyMode ? "py-4 gap-1.5" : "py-3 gap-1"
              } ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              aria-label={labelFallbacks[label]}
            >
              {/* Active indicator dot */}
              <div className="relative flex items-center justify-center">
                {active && (
                  <span
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full gradient-primary"
                  />
                )}
                <div
                  className={`rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    active
                      ? "gradient-primary shadow-card"
                      : "bg-transparent"
                  } ${elderlyMode ? "w-14 h-10" : "w-11 h-8"}`}
                >
                  <Icon
                    className={`transition-all duration-200 ${
                      active ? "text-white" : ""
                    } ${elderlyMode ? "w-7 h-7" : "w-5 h-5"}`}
                  />
                </div>
              </div>
              <span
                className={`font-semibold transition-all duration-200 ${
                  active ? "text-primary" : "text-muted-foreground"
                } ${elderlyMode ? "text-sm" : "text-[10px]"}`}
              >
                {labelFallbacks[label]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
