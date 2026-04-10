import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ActionCards from "@/components/ActionCards";

const Index = () => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <ActionCards />
    </div>
  );
};

export default Index;
