import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/ui/hero-section";
import { RoomGrid } from "@/components/ui/room-grid";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <div id="room-grid-section">
        <RoomGrid />
      </div>
    </div>
  );
};

export default Index;
