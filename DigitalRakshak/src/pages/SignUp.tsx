import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, Role, User } from "@/context/AuthContext";
import { Shield, User as UserIcon, Heart } from "lucide-react";

export default function SignUp() {
  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<"myself" | "for_elder">("myself");
  
  // Form State
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [pin, setPin] = useState("");
  const [relation, setRelation] = useState("");
  const [elderName, setElderName] = useState("");
  const [elderNumber, setElderNumber] = useState("");
  const [elderPin, setElderPin] = useState("");
  const [rakhiMessage, setRakhiMessage] = useState("");
  const [mediaLinks, setMediaLinks] = useState(["", "", "", ""]);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleMediaChange = (index: number, value: string) => {
    const newLinks = [...mediaLinks];
    newLinks[index] = value;
    setMediaLinks(newLinks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let userData: User;
    if (accountType === "myself") {
      userData = {
        role: "myself" as Role,
        name,
        number,
        pin,
      };
    } else {
      userData = {
        role: "relative" as Role,
        name,
        number,
        pin,
        relation,
        elderName,
        elderNumber,
        elderPin,
        rakhiMessage,
        mediaLinks: mediaLinks.filter(l => l.trim() !== "")
      };
    }

    if (signup(userData)) {
      navigate("/");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-center text-gray-800">Who is this account for?</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => { setAccountType("myself"); setStep(2); }}
          className="flex flex-col items-center justify-center p-6 bg-white border-2 border-orange-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
        >
          <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <UserIcon size={32} />
          </div>
          <span className="font-bold text-gray-800">Myself</span>
        </button>

        <button
          type="button"
          onClick={() => { setAccountType("for_elder"); setStep(2); }}
          className="flex flex-col items-center justify-center p-6 bg-white border-2 border-orange-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Heart size={32} />
          </div>
          <span className="font-bold text-gray-800">For Elder</span>
        </button>
      </div>
    </div>
  );

  const renderStep2Myself = () => (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" placeholder="Enter your name" />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
        <input type="tel" required value={number} onChange={e => setNumber(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" placeholder="10-digit number" />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Create PIN</label>
        <input type="password" required maxLength={4} value={pin} onChange={e => setPin(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-lg tracking-widest" placeholder="••••" />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">Back</button>
        <button type="submit" className="flex-[2] gradient-primary text-white font-bold py-4 rounded-xl shadow-card hover:shadow-card-hover transition-all active:scale-95">Sign Up</button>
      </div>
    </form>
  );

  const renderStep2Elder = () => (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
        <h4 className="font-bold text-orange-800 mb-4 border-b border-orange-200 pb-2">Your Details (Relative)</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">Your Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" placeholder="Your name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1">Your Number</label>
              <input type="tel" required value={number} onChange={e => setNumber(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" placeholder="Number" />
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1">Your PIN</label>
              <input type="password" required maxLength={4} value={pin} onChange={e => setPin(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none tracking-widest" placeholder="••••" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">Relation to Elder</label>
            <input type="text" required value={relation} onChange={e => setRelation(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" placeholder="e.g., Grandson, Daughter" />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
        <h4 className="font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">Elder's Details</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">Elder's Name</label>
            <input type="text" required value={elderName} onChange={e => setElderName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none" placeholder="Their name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1">Elder's Number</label>
              <input type="tel" required value={elderNumber} onChange={e => setElderNumber(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none" placeholder="Their number" />
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1">Elder's PIN</label>
              <input type="password" required maxLength={4} value={elderPin} onChange={e => setElderPin(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none tracking-widest" placeholder="••••" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
        <h4 className="font-bold text-pink-800 mb-4 border-b border-pink-200 pb-2">Rakhi / Memories (Optional)</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">A message for them</label>
            <textarea value={rakhiMessage} onChange={e => setRakhiMessage(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-pink-500 outline-none" placeholder="Happy Rakhi Dadu!" rows={2}></textarea>
          </div>
          
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-2">Add up to 4 video/image links (Drive, YT)</label>
            {mediaLinks.map((link, idx) => (
              <input key={idx} type="url" value={link} onChange={e => handleMediaChange(idx, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-pink-500 outline-none mb-2" placeholder={`Link ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white/90 backdrop-blur-sm p-2 rounded-xl">
        <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Back</button>
        <button type="submit" className="flex-[2] gradient-primary text-white font-bold py-3 rounded-xl shadow-card hover:shadow-card-hover transition-all active:scale-95">Create Account</button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-xl w-full glass-strong rounded-3xl p-8 shadow-2xl relative z-10 border border-orange-100/50">
        <div className="flex justify-center mb-6">
          <div className="gradient-primary p-3 rounded-2xl shadow-card">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-center mb-2 text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Join DigiRakshak today</p>

        {step === 1 && renderStep1()}
        {step === 2 && accountType === "myself" && renderStep2Myself()}
        {step === 2 && accountType === "for_elder" && renderStep2Elder()}

        {step === 1 && (
          <div className="mt-8 text-center">
            <span className="text-gray-500 font-medium">Already have an account? </span>
            <Link to="/login" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
