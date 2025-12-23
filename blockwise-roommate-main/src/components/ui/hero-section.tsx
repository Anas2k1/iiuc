import { Button } from "@/components/ui/button";
import { Calendar, Search, Users } from "lucide-react";
import heroImage from "@/assets/iiuc-hero.jpg";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const handleBrowseRooms = () => {
    const el = document.getElementById("room-grid-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="IIUC Campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary-glow/60" />
        <div className="absolute inset-0 islamic-pattern opacity-20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="fade-in">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              International Islamic
              <br />
              <span className="hero-text">University Chittagong</span>
            </h1>
            <div className="w-32 h-1 bg-accent mx-auto mt-6 rounded-full" />
          </div>
          
          {/* Subtitle */}
          <div className="slide-in-left" style={{ animationDelay: '0.3s' }}>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Smart Room Booking System
            </p>
            <p className="text-lg text-white/80 mt-2">
              Book vacant rooms instantly • Request cancelled slots • Manage your schedule
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="slide-in-right flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group" onClick={handleBrowseRooms}>
              <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Browse Rooms
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-black hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group" asChild>
              <Link to="/schedule">
                <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                View Schedule
              </Link>
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="fade-in grid grid-cols-3 gap-8 max-w-md mx-auto pt-8" style={{ animationDelay: '0.9s' }}>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">150+</div>
              <div className="text-sm text-white/80">Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">12</div>
              <div className="text-sm text-white/80">Blocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">24/7</div>
              <div className="text-sm text-white/80">Access</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};