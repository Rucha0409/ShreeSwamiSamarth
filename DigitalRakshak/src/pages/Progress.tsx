import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface Badge {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  color: string;
}

const myselfBadges: Badge[] = [
  { id: "scam_spotter", emoji: "🛡️", title: "Scam Spotter", desc: "Passed Safe or Scam quiz", color: "bg-emerald-500 text-white" },
  { id: "upi_pro", emoji: "💸", title: "UPI Pro", desc: "Completed UPI Safety Training", color: "bg-rose-500 text-white" },
  { id: "scam_resister", emoji: "🤖", title: "Scam Resister", desc: "Tricked Scamy", color: "bg-purple-500 text-white" },
  { id: "digital_guardian", emoji: "🎓", title: "Digital Guardian", desc: "Mastered all modules", color: "bg-amber-500 text-white" }
];

const Progress = () => {
  const { elderlyMode, language, t } = useAppSettings();
  const getT = (en: string, hi: string) => language === "hi" ? hi : en;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const badges: string[] = JSON.parse(localStorage.getItem("dr_badges") || "[]");
    const storedXp = parseInt(localStorage.getItem("dr_xp") || "0");

    if (
      badges.includes("scam_spotter") &&
      badges.includes("upi_pro") &&
      badges.includes("scam_resister") &&
      !badges.includes("digital_guardian")
    ) {
      badges.push("digital_guardian");
      localStorage.setItem("dr_badges", JSON.stringify(badges));
      localStorage.setItem("dr_xp", String(storedXp + 150));
    }

    setEarnedBadges(badges);
    setXp(parseInt(localStorage.getItem("dr_xp") || "0"));
  }, [navigate]);

  const earnedCount = earnedBadges.length;
  const currentRole = user?.role || "myself";

  // Relative Dashboard Render
  if (currentRole === "relative" && user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-6 py-10 max-w-4xl flex-1 flex flex-col gap-8">
          <div className="flex items-center gap-6 animate-fade-in-up">
            <button onClick={() => navigate("/")} className="p-4 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-8 h-8" />
            </button>
            <div className="flex-1">
              <h1 className="font-black text-foreground text-4xl">{getT("Elder Dashboard", "बुजुर्ग डैशबोर्ड")}</h1>
              <p className="text-muted-foreground font-bold mt-2 text-xl">{getT(`Monitor ${user.elderName}'s progress`, `${user.elderName} की प्रगति देखें`)}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{getT("Edit Rakhi Message", "राखी संदेश संपादित करें")}</h2>
            <div className="flex flex-col gap-4">
              <textarea 
                className="w-full border border-gray-300 rounded-xl p-4 text-lg outline-none focus:border-orange-500"
                defaultValue={user.rakhiMessage || ""}
                id="editRakhiMsg"
                rows={3}
              />
              <button 
                className="self-end bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition"
                onClick={() => {
                  const ms = (document.getElementById("editRakhiMsg") as HTMLTextAreaElement).value;
                  const users = JSON.parse(localStorage.getItem("digirakshak_users") || "[]");
                  const updatedIdx = users.findIndex((u: any) => u.number === user.number && u.role === "relative");
                  if(updatedIdx > -1) {
                    users[updatedIdx].rakhiMessage = ms;
                    localStorage.setItem("digirakshak_users", JSON.stringify(users));
                    user.rakhiMessage = ms;
                    localStorage.setItem("digirakshak_current_user", JSON.stringify(user));
                    alert(getT("Message updated successfully!", "संदेश सफलतापूर्वक अपडेट किया गया!"));
                  }
                }}
              >
                {getT("Update Message", "संदेश अपडेट करें")}
              </button>

              <h2 className="text-xl font-bold mb-2 mt-4 text-gray-800">{getT("Edit Media Links", "मीडिया लिंक संपादित करें")}</h2>
              {[0,1,2,3].map(idx => (
                <input
                  key={idx}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-orange-500 mb-2"
                  defaultValue={user.mediaLinks?.[idx] || ""}
                  placeholder={getT(`Media Link ${idx + 1}`, `मीडिया लिंक ${idx + 1}`)}
                  id={`editMediaLink${idx}`}
                />
              ))}
              <button 
                className="self-end bg-blue-500 text-white font-bold py-2 px-6 rounded-xl hover:bg-blue-600 transition"
                onClick={() => {
                  const newLinks = [0,1,2,3].map(i => (document.getElementById(`editMediaLink${i}`) as HTMLInputElement).value);
                  const users = JSON.parse(localStorage.getItem("digirakshak_users") || "[]");
                  const updatedIdx = users.findIndex((u: any) => u.number === user.number && u.role === "relative");
                  if(updatedIdx > -1) {
                    users[updatedIdx].mediaLinks = newLinks;
                    localStorage.setItem("digirakshak_users", JSON.stringify(users));
                    user.mediaLinks = newLinks;
                    localStorage.setItem("digirakshak_current_user", JSON.stringify(user));
                    alert(getT("Links updated successfully!", "लिंक सफलतापूर्वक अपडेट किए गए!"));
                  }
                }}
              >
                {getT("Update Links", "लिंक अपडेट करें")}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Learning Progress</h2>
            <div className="space-y-4">
              {myselfBadges.map(badge => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <div key={badge.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{badge.emoji}</span>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">
                          {badge.id === "scam_spotter" ? getT("Scam Spotter", "स्कैम स्पॉटर") :
                           badge.id === "upi_pro" ? getT("UPI Pro", "UPI प्रो") :
                           badge.id === "scam_resister" ? getT("Scam Resister", "स्कैम रेजिस्टेर") :
                           getT("Digital Guardian", "डिजिटल रक्षक")}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {badge.id === "scam_spotter" ? getT("Passed Safe or Scam quiz", "सेफ़ या स्कैम क्विज़ पास किया") :
                           badge.id === "upi_pro" ? getT("Completed UPI Safety Training", "UPI सुरक्षा प्रशिक्षण पूरा किया") :
                           badge.id === "scam_resister" ? getT("Tricked Scamy", "Scamy को छकाया") :
                           getT("Mastered all modules", "सभी मॉड्यूल में महारत हासिल की")}
                        </p>
                      </div>
                    </div>
                    {earned ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl text-sm">{getT("Completed ✅", "पूरा हुआ ✅")}</span>
                    ) : (
                      <span className="bg-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-sm">{getT("Pending ⏳", "बाकी है ⏳")}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User (Myself) Render
  if (currentRole === "myself") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-6 py-10 max-w-7xl flex-1 flex flex-col gap-8">
          <div className="flex items-center gap-6 animate-fade-in-up">
            <button onClick={() => navigate("/")} className="p-4 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-8 h-8" />
            </button>
            <div>
              <h1 className="font-black text-foreground text-4xl">{getT("Your Badges", "आपके बैज")}</h1>
              <p className="text-muted-foreground font-bold mt-2 text-xl">{earnedCount}/{myselfBadges.length} {getT("earned", "प्राप्त किए")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myselfBadges.map((badge, i) => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <div key={badge.id} className={`rounded-[2.5rem] border-4 p-8 transition-all animate-fade-in-up flex flex-col justify-between ${earned ? `${badge.color} border-transparent shadow-card hover:scale-[1.02]` : "bg-muted border-border opacity-60 grayscale hover:grayscale-0"}`} style={{ animationDelay: `${0.15 + i * 0.1}s`, minHeight: '260px' }}>
                  <div>
                    <div className="text-6xl mb-4 filter drop-shadow-md">{badge.emoji}</div>
                    <p className={`font-black mb-2 ${earned ? "text-white" : "text-muted-foreground"} text-2xl`}>
                      {badge.id === "scam_spotter" ? getT("Scam Spotter", "स्कैम स्पॉटर") :
                       badge.id === "upi_pro" ? getT("UPI Pro", "UPI प्रो") :
                       badge.id === "scam_resister" ? getT("Scam Resister", "स्कैम रेजिस्टेर") :
                       getT("Digital Guardian", "डिजिटल रक्षक")}
                    </p>
                    <p className={`font-semibold leading-relaxed ${earned ? "text-white/90" : "text-muted-foreground"} text-lg`}>
                      {badge.id === "scam_spotter" ? getT("Passed Safe or Scam quiz", "सेफ़ या स्कैम क्विज़ पास किया") :
                       badge.id === "upi_pro" ? getT("Completed UPI Safety Training", "UPI सुरक्षा प्रशिक्षण पूरा किया") :
                       badge.id === "scam_resister" ? getT("Tricked Scamy", "Scamy को छकाया") :
                       getT("Mastered all modules", "सभी मॉड्यूल में महारत हासिल की")}
                    </p>
                  </div>
                  {!earned && <p className="text-muted-foreground font-black mt-4 text-lg">🔒 {getT("Locked", "लॉक है")}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Elder Render (Rakhi + Custom Media Badges)
  const elderBadges = [
    {
      id: "scam_spotter",
      emoji: "👦🏽",
      title: getT(`Video from ${user?.name || "Family"}`, `परिवार से वीडियो`),
      desc: getT("Unlocked by passing Safe or Scam", "सेफ़ या स्कैम पास करने पर अनलॉक"),
      color: "bg-emerald-500 text-white",
      link: user?.mediaLinks?.[0]
    },
    {
      id: "upi_pro",
      emoji: "👧🏽",
      title: getT("Family Memory", "पारिवारिक याद"),
      desc: getT("Unlocked by learning UPI Safety", "UPI सुरक्षा सीखने पर अनलॉक"),
      color: "bg-rose-500 text-white",
      link: user?.mediaLinks?.[1]
    },
    {
      id: "scam_resister",
      emoji: "👨‍👩‍👦",
      title: getT("Voice Message", "वॉयस संदेश"),
      desc: getT("Unlocked by catching Scamy", "Scamy को पहचानने पर अनलॉक"),
      color: "bg-purple-500 text-white",
      link: user?.mediaLinks?.[2]
    },
    {
      id: "digital_guardian",
      emoji: "💌",
      title: getT("Surprise Audio Memory", "सरप्राइज ऑडियो"),
      desc: getT("Unlock everything to see this!", "यह देखने के लिए सब कुछ अनलॉक करें!"),
      color: "bg-amber-500 text-white",
        link: user?.mediaLinks?.[3]
    },
  ];

  if(!user) return null; // Safety for elder role that requires user

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-6 py-10 max-w-7xl flex-1 flex flex-col gap-8">
        <div className="flex items-center gap-6 animate-fade-in-up">
          <button onClick={() => navigate("/")} className="p-4 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-8 h-8" />
          </button>
          <div>
            <h1 className={`font-black text-foreground ${elderlyMode ? "text-5xl" : "text-4xl"}`}>
              👨‍👩‍👧‍👦 {language === "hi" ? "डिजिटल राखी और पारिवारिक यादें" : "Digital Rakhi & Memories"}
            </h1>
            <p className={`text-muted-foreground font-bold mt-2 ${elderlyMode ? "text-2xl" : "text-xl"}`}>
              {earnedCount}/{elderBadges.length} unlocked
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="gradient-primary rounded-[3rem] p-8 lg:p-10 text-white shadow-card animate-fade-in-up hover:shadow-card-hover transition-all border-4 border-amber-300">
              <div className="mb-6">
                <p className={`font-black ${elderlyMode ? "text-5xl" : "text-4xl"} mb-2`}>🛡️ {getT("Digital Rakhi", "डिजिटल राखी")}</p>
                <p className={`text-amber-100 font-bold ${elderlyMode ? "text-2xl" : "text-xl"}`}>
                  {getT("Tied by:", "बाँधी है:")} {user.relativeName || user.name} {user.relation ? `(${user.relation})` : ""}
                </p>
              </div>

              {user.rakhiMessage && (
                <div className="bg-black/10 rounded-2xl p-5 mb-6 shadow-inner italic border-l-4 border-amber-400">
                  <p className={`text-white/95 font-bold leading-relaxed ${elderlyMode ? "text-2xl" : "text-lg"}`}>
                    "{user.rakhiMessage}"
                  </p>
                </div>
              )}

              <div className="bg-white text-blue-700 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors shadow-lg active:scale-95">
                 <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-black text-2xl">📞</div>
                 <div>
                   <p className={`font-black uppercase tracking-wider ${elderlyMode ? "text-xl" : "text-base"}`}>{getT(`Call ${user.relativeName || user.name} Now`, `अभी ${user.relativeName || user.name} को कॉल करें`)}</p>
                   <p className="text-sm font-bold opacity-80">{user.relativeNumber || user.number}</p>
                 </div>
              </div>
            </div>

            <div className="bg-card rounded-[2.5rem] border-2 border-border p-8 shadow-sm">
              <h3 className={`font-black text-foreground mb-4 ${elderlyMode ? "text-3xl" : "text-2xl"}`}>
                💌 {getT("How to Unlock Messages?", "संदेश कैसे अनलॉक करें?")}
              </h3>
              <p className={`font-bold text-muted-foreground leading-snug ${elderlyMode ? "text-xl" : "text-lg"} mb-6`}>
                {getT("Complete safety modules to unlock your family's surprise media!", "सरप्राइज मीडिया देखने के लिए सुरक्षा मॉड्यूल पूरा करें!")}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-muted/60 rounded-2xl px-5 py-4"><span className={elderlyMode?"text-4xl":"text-3xl"}>🎮</span><p className="font-bold text-lg">{getT("Complete Safe or Scam", "सेफ़ या स्कैम पूरा करें")}</p></div>
                <div className="flex items-center gap-4 bg-muted/60 rounded-2xl px-5 py-4"><span className={elderlyMode?"text-4xl":"text-3xl"}>📱</span><p className="font-bold text-lg">{getT("Finish UPI Training", "UPI ट्रेनिंग पूरी करें")}</p></div>
                <div className="flex items-center gap-4 bg-muted/60 rounded-2xl px-5 py-4"><span className={elderlyMode?"text-4xl":"text-3xl"}>🤖</span><p className="font-bold text-lg">{getT("Talk to Scamy", "Scamy से बात करें")}</p></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className={`font-black text-foreground mb-6 pl-2 ${elderlyMode ? "text-4xl" : "text-3xl"}`}>💝 {getT("Your Family Album", "आपका पारिवारिक एल्बम")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {elderBadges.map((badge, i) => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <div key={badge.id} className={`rounded-[2.5rem] border-4 p-8 transition-all flex flex-col justify-between ${earned ? `${badge.color} border-transparent shadow-card hover:scale-[1.02]` : "bg-muted border-border opacity-60 grayscale"}`} style={{ minHeight: '260px' }}>
                    <div>
                        <div className="text-6xl mb-4 filter drop-shadow-md">{badge.emoji}</div>
                        <p className={`font-black mb-2 ${earned ? "text-white" : "text-muted-foreground"} ${elderlyMode ? "text-3xl" : "text-2xl"}`}>{badge.title}</p>
                        <p className={`font-semibold ${earned ? "text-white/90" : "text-muted-foreground"} ${elderlyMode ? "text-xl" : "text-lg"}`}>{badge.desc}</p>
                    </div>

                    <div className="mt-4 border-t border-white/20 pt-4">
                        {earned ? (
                          badge.link ? (
                            <a href={badge.link} target="_blank" rel="noreferrer" className={`w-full bg-white text-gray-900 rounded-xl px-4 py-3 font-black shadow-md mt-4 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                                ▶️ {getT("Play Message", "संदेश चलाएं")}
                            </a>
                          ) : (
                            <button className={`w-full bg-white/50 text-white rounded-xl px-4 py-3 font-black mt-4 flex items-center justify-center gap-3 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                                🖼️ {getT("No Link Added", "कोई लिंक नहीं")}
                            </button>
                          )
                        ) : (
                        <p className={`text-muted-foreground font-black flex items-center gap-2 mt-4 ${elderlyMode ? "text-xl" : "text-lg"}`}>🔒 Locked</p>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
