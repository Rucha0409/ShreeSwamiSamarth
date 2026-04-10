import { useAppSettings } from "@/context/AppSettingsContext";

const stats = [
  { emoji: "🛡️", valueKey: "trust.scams",  value: "2.4L+" },
  { emoji: "👥", valueKey: "trust.users",  value: "50K+" },
  { emoji: "💡", valueKey: "trust.tips",   value: "10K+" },
];

const TrustSection = () => {
  const { elderlyMode, t } = useAppSettings();

  return (
    <section className="container mx-auto px-5 pb-6">
      <div className="glass rounded-3xl border border-border shadow-card p-5 max-w-lg mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ emoji, valueKey, value }) => (
            <div key={valueKey} className="text-center">
              <div className={`${elderlyMode ? "text-4xl" : "text-3xl"} mb-1`}>{emoji}</div>
              <div className={`font-black text-gradient ${elderlyMode ? "text-2xl" : "text-xl"}`}>
                {value}
              </div>
              <div className={`text-muted-foreground font-semibold leading-tight ${elderlyMode ? "text-sm" : "text-xs"}`}>
                {t(valueKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
