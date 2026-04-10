import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle, ScanEye, RotateCcw, Volume2, VolumeX, Play, SquarePlay } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import Navbar from "@/components/Navbar";

type MediaType = "image" | "audio";

interface Scenario {
  id: number;
  type: MediaType;
  title: string;
  description: string;
  assetA?: string;
  assetB?: string;
  fakeIs: "A" | "B";
  explanation: string;
  tips: string[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    type: "image",
    title: "Spot the AI-Generated Portrait",
    description: "One of these images is an AI deepfake. Look closely at skin texture, hair blending, and background details.",
    assetA: "/deepfake/real.png",
    assetB: "/deepfake/fake.png",
    fakeIs: "B",
    explanation: "Image B is the deepfake. The AI generator often fails to render realistic minor details like distinct hair strands separating from the background, and gives the skin an unnatural, overly smooth 'plastic' glow.",
    tips: [
      "Check for unnatural skin smoothness or 'plastic' glow",
      "Look for mismatched or asymmetrical earrings/glasses",
      "Analyze the background for distorted or melting objects"
    ]
  },
  {
    id: 2,
    type: "audio",
    title: "Detect the Voice Clone",
    description: "Listen to the two voice notes. One is a real person, and the other is an AI-generated voice clone used by scammers.",
    fakeIs: "A",
    explanation: "Audio A is the AI voice clone. Despite sounding very real, voice clones often have a slightly metallic/robotic undertone, awkward unnatural pauses in the middle of sentences, and lack natural breathing sounds.",
    tips: [
      "Listen for weird metallic or robotic frequencies",
      "Check for a lack of natural breathing or inhaling",
      "Pay attention to emotional delivery: AI often sounds perfectly monotonous",
      "Notice awkward cutoffs at the end of words"
    ]
  },
  {
    id: 3,
    type: "image",
    title: "Spot the Video Call Deepfake",
    description: "Scammers use realtime deepfakes on video calls to pretend to be your boss or loved one. Which video call is fake?",
    assetA: "/deepfake/video_fake.png",
    assetB: "/deepfake/video_real.png",
    fakeIs: "A",
    explanation: "Image A is the deepfake. Real-time video deepfakes struggle with profile angles and hand movements. The edges of the face often flicker, and lighting on the 'face mask' doesn't match the background.",
    tips: [
      "Ask the caller to turn their head sideways — deepfakes glitch in profile",
      "Notice if the glasses or accessories warp",
      "Look for blurry edges around the chin and hairline",
      "Check if face lighting matches the room lighting"
    ]
  }
];

const AudioPlayerMock = ({ label, isFake, onPlay }: { label: string, isFake: boolean, onPlay: () => void }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the card just by playing the audio
    if (playing) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
      setProgress(0);
      return;
    }
    
    setPlaying(true);
    onPlay();

    const text = isFake 
      ? "Hello sir... this is... your relative. I am in an emergency... please send me ten thousand... rupees... immediately..."
      : "Hello sir! This is your relative. I am in an emergency, please send me ten thousand rupees immediately.";

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-IN";
    
    if (isFake) {
       // Robotic/unnatural settings for the deepfake
       utt.pitch = 0.2; 
       utt.rate = 0.65; 
    } else {
       utt.pitch = 1.0;
       utt.rate = 1.0;
    }

    // Estimate duration for progress bar
    const durationEst = text.length * (isFake ? 90 : 70); 
    let p = 0;
    const interval = setInterval(() => {
      p += (300 / durationEst) * 100;
      setProgress(Math.min(p, 100));
    }, 300);

    utt.onend = () => {
        clearInterval(interval);
        setPlaying(false);
        setProgress(0);
    };
    
    utt.onerror = () => {
        clearInterval(interval);
        setPlaying(false);
        setProgress(0);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="bg-card border-2 border-border p-6 rounded-3xl flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={handlePlay}
        className="w-16 h-16 shrink-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95"
      >
        {playing ? <SquarePlay className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
      </button>
      <div className="flex-1">
        <p className="font-bold text-foreground text-lg mb-3">Voice Note {label}</p>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <Volume2 className="w-8 h-8 text-muted-foreground shrink-0" />
    </div>
  );
};


const DeepfakeLab = () => {
  const { elderlyMode, language } = useAppSettings();
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedItem, setSelectedItem] = useState<"A" | "B" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const scenario = scenarios[currentScenario] || scenarios[0];
  const isCorrect = selectedItem === scenario.fakeIs;

  const speakText = (text: string) => {
    window.speechSynthesis?.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = language === "hi" ? "hi-IN" : "en-IN";
    utt.rate = elderlyMode ? 0.8 : 1.0;
    setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  // Elderly Mode Auto-Read Integration
  useEffect(() => {
    if (elderlyMode && !gameComplete) {
       speakText(scenario.title + ". " + scenario.description);
    }
  }, [currentScenario, elderlyMode, gameComplete]);

  const handleSelect = (choice: "A" | "B") => {
    if (showResult) return;
    setSelectedItem(choice);
    setShowResult(true);
    if (choice === scenario.fakeIs) {
      setScore(s => s + 1);
    }
    // Auto-read explanation in elderly mode
    if (elderlyMode) {
       setTimeout(() => speakText((choice === scenario.fakeIs ? "Correct! " : "Incorrect. ") + scenario.explanation), 500);
    }
  };

  const handleNext = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    
    if (currentScenario + 1 >= scenarios.length) {
      setGameComplete(true);
    } else {
      setSelectedItem(null);
      setShowResult(false);
      setCurrentScenario(prev => prev + 1);
    }
  };

  const restart = () => {
    setCurrentScenario(0);
    setSelectedItem(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
  };

  if (gameComplete) {
    const pct = score / scenarios.length;
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className={`glass rounded-[3rem] border border-border shadow-float text-center max-w-xl w-full animate-bounce-in p-12`}>
            <div className="bg-blue-500 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-card">
              {pct >= 0.6 ? "🕵️" : "📚"}
            </div>
            <h2 className={`font-black text-foreground mb-2 ${elderlyMode ? "text-5xl" : "text-4xl"}`}>
              Lab Complete!
            </h2>
            <p className={`text-blue-600 font-black mb-4 ${elderlyMode ? "text-8xl" : "text-7xl"}`}>
              {score}/{scenarios.length}
            </p>
            <p className={`font-bold text-muted-foreground mb-10 ${elderlyMode ? "text-2xl" : "text-xl"}`}>
              {pct >= 0.6 ? "Great job! You have a sharp eye for deepfakes." : "Keep practicing to spot those AI artifacts!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restart}
                className="bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-3 justify-center shadow-card hover:bg-blue-700 transition-colors px-8 py-5 text-xl"
              >
                <RotateCcw className="w-6 h-6" /> Play Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-muted text-foreground rounded-2xl font-bold hover:bg-muted/80 transition-colors px-8 py-5 text-xl"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-7xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`font-black text-foreground flex items-center gap-3 ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
                <ScanEye className="w-8 h-8 text-blue-500" />
                RealityCheck Lab
              </h1>
              <p className={`text-muted-foreground font-bold mt-1 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                Stage {currentScenario + 1} of {scenarios.length}
              </p>
            </div>
          </div>

          <button
            onClick={() => speaking ? window.speechSynthesis.cancel() : speakText(scenario.description)}
            className={`p-4 rounded-2xl transition-all shadow-sm flex items-center gap-3 font-bold ${speaking ? "bg-blue-500 text-white" : "bg-card border-2 hover:bg-muted"}`}
            title="Read Aloud (Elderly Friendly)"
          >
            {speaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            {elderlyMode && <span className="hidden sm:inline">Read Aloud</span>}
          </button>
        </div>

        <div className="bg-card rounded-[3rem] p-8 lg:p-12 border-2 border-border shadow-float">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className={`font-black text-foreground mb-4 ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
              {scenario.title}
            </h2>
            <p className={`text-muted-foreground font-medium ${elderlyMode ? "text-2xl leading-relaxed" : "text-lg"}`}>
              {scenario.description}
            </p>
          </div>

          {/* Interactive Content (Image or Audio) */}
          <div className={`grid gap-8 lg:gap-12 mb-12 ${scenario.type === "image" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-2xl mx-auto"}`}>
            
            {scenario.type === "image" ? (
              <>
                <div 
                  onClick={() => handleSelect("A")}
                  className={`relative bg-muted rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border-4 hover:scale-[1.02] ${
                    selectedItem === "A" && !showResult ? "border-blue-500 shadow-xl" : "border-transparent"
                  } ${showResult && scenario.fakeIs === "A" ? "border-red-500" : ""} 
                  ${showResult && scenario.fakeIs !== "A" ? "border-emerald-500" : ""} 
                  ${showResult ? "pointer-events-none" : ""}`}
                >
                  <img src={scenario.assetA} alt="Option A" className="w-full aspect-square object-cover" />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-5 py-3 rounded-2xl font-black text-2xl shadow-lg">
                    A
                  </div>
                </div>

                <div 
                  onClick={() => handleSelect("B")}
                  className={`relative bg-muted rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border-4 hover:scale-[1.02] ${
                    selectedItem === "B" && !showResult ? "border-blue-500 shadow-xl" : "border-transparent"
                  } ${showResult && scenario.fakeIs === "B" ? "border-red-500" : ""} 
                  ${showResult && scenario.fakeIs !== "B" ? "border-emerald-500" : ""} 
                  ${showResult ? "pointer-events-none" : ""}`}
                >
                  <img src={scenario.assetB} alt="Option B" className="w-full aspect-square object-cover" />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-5 py-3 rounded-2xl font-black text-2xl shadow-lg">
                    B
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-6">
                 <div
                   onClick={() => handleSelect("A")}
                   className={`p-2 rounded-[2rem] border-4 cursor-pointer transition-all ${
                    selectedItem === "A" && !showResult ? "border-blue-500 shadow-xl scale-[1.02]" : "border-transparent"
                   } ${showResult && scenario.fakeIs === "A" ? "border-red-500" : ""} 
                   ${showResult && scenario.fakeIs !== "A" ? "border-emerald-500" : ""} 
                   ${showResult ? "pointer-events-none" : ""}`}
                 >
                   <AudioPlayerMock label="A" isFake={scenario.fakeIs === "A"} onPlay={() => {}} />
                 </div>
                 
                 <div
                   onClick={() => handleSelect("B")}
                   className={`p-2 rounded-[2rem] border-4 cursor-pointer transition-all ${
                    selectedItem === "B" && !showResult ? "border-blue-500 shadow-xl scale-[1.02]" : "border-transparent"
                   } ${showResult && scenario.fakeIs === "B" ? "border-red-500" : ""} 
                   ${showResult && scenario.fakeIs !== "B" ? "border-emerald-500" : ""} 
                   ${showResult ? "pointer-events-none" : ""}`}
                 >
                   <AudioPlayerMock label="B" isFake={scenario.fakeIs === "B"} onPlay={() => {}} />
                 </div>
              </div>
            )}
          </div>

          {!showResult && (
            <div className="text-center animate-fade-in-up">
              <h3 className={`font-black text-foreground ${elderlyMode ? "text-3xl" : "text-xl"}`}>
                 Which one is the Deepfake?
              </h3>
              <p className={`text-muted-foreground mt-3 font-bold ${elderlyMode ? "text-xl" : "text-base"}`}>
                 Click on {scenario.type === "image" ? "an image" : "an audio clip"} to lock in your answer.
              </p>
            </div>
          )}

          {showResult && (
            <div className={`rounded-3xl p-8 lg:p-10 border-4 animate-slide-up ${isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h3 className={`font-black mb-4 flex items-center gap-3 ${
                    isCorrect ? "text-emerald-700" : "text-red-700"
                  } ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
                    {isCorrect ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                    {isCorrect ? "Correct! You spotted the fake." : "Oops! The other one was the fake."}
                  </h3>
                  <p className={`text-foreground/90 leading-relaxed font-bold ${elderlyMode ? "text-2xl" : "text-xl"}`}>
                    {scenario.explanation}
                  </p>
                  
                  <div className="mt-8 bg-white/60 p-6 rounded-2xl">
                    <h4 className={`font-black text-foreground mb-4 uppercase tracking-wider flex items-center gap-2 ${elderlyMode ? "text-lg" : "text-sm"}`}>
                       <ScanEye className="w-6 h-6 text-blue-600" /> How to spot deepfakes:
                    </h4>
                    <ul className="space-y-4">
                      {scenario.tips.map((tip, idx) => (
                        <li key={idx} className={`flex items-start gap-4 text-foreground font-bold ${elderlyMode ? "text-xl" : "text-base"}`}>
                          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black shrink-0 mt-0.5 shadow-sm">
                            {idx + 1}
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="w-full lg:w-1/3 flex flex-col justify-end">
                    <button 
                      onClick={handleNext}
                      className={`w-full bg-blue-600 text-white rounded-2xl font-black shadow-card hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${elderlyMode ? "py-8 text-2xl" : "py-6 text-xl"}`}
                    >
                      {currentScenario + 1 >= scenarios.length ? "See Results" : "Next Scenario"} →
                    </button>
                    {elderlyMode && (
                       <button onClick={() => speakText(scenario.explanation)} className="mt-4 w-full py-4 bg-white text-blue-700 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-blue-200">
                         <Volume2 className="w-5 h-5"/> Play Explanation Again
                       </button>
                    )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DeepfakeLab;
