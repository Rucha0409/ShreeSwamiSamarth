import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import ChaturAssistant from "@/components/ChaturAssistant";
import Index from "./pages/Index.tsx";
import SafeOrScam from "./pages/SafeOrScam.tsx";
import UpiTraining from "./pages/UpiTraining.tsx";
import ScamSimulator from "./pages/ScamSimulator.tsx";
import Progress from "./pages/Progress.tsx";
import DeepfakeLab from "./pages/DeepfakeLab.tsx";
import SimulatorHub from "./pages/SimulatorHub.tsx";
import BlockReportSimulator from "./pages/BlockReportSimulator.tsx";
import ApkSimulator from "./pages/ApkSimulator.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppSettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/game" element={<SafeOrScam />} />
              <Route path="/upi-training" element={<UpiTraining />} />
              <Route path="/simulators" element={<SimulatorHub />} />
              <Route path="/block-report" element={<BlockReportSimulator />} />
              <Route path="/apk-simulator" element={<ApkSimulator />} />
              <Route path="/scam-simulator" element={<ScamSimulator />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/deepfake-lab" element={<DeepfakeLab />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Floating Chatur assistant bubble */}
            <ChaturAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </AppSettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App; // Ensure we only export what is defined in this file