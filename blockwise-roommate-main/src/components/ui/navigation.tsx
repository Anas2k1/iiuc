import { Button } from "@/components/ui/button";
import { Building2, Calendar, LogIn, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">IIUC Room Booking</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/rooms" className="text-foreground hover:text-primary transition-colors">
              Rooms
            </Link>
            <Link to="/bookings" className="text-foreground hover:text-primary transition-colors">
              My Bookings
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/schedule">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};