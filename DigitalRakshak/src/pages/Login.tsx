import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Shield } from "lucide-react";

export default function Login() {
  const [number, setNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(number, pin)) {
      navigate("/");
    } else {
      setError("Invalid number or PIN");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full glass-strong rounded-3xl p-8 shadow-2xl relative z-10 border border-orange-100/50">
        <div className="flex justify-center mb-6">
          <div className="gradient-primary p-3 rounded-2xl shadow-card">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-center mb-2 text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Login to access your DigiRakshak account</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
              placeholder="Enter your 10-digit number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-lg tracking-widest"
              placeholder="••••"
              maxLength={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-primary text-white font-bold py-4 rounded-xl shadow-card hover:shadow-card-hover transition-all active:scale-95 text-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-gray-500 font-medium">Don't have an account? </span>
          <Link to="/signup" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
