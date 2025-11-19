import { Button } from "@/components/ui/button";
import { Building2, Calendar, LogIn, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // Listen for auth changes to update user display
    const handleAuthChange = () => {
      const newStoredUser = localStorage.getItem("user");
      if (newStoredUser) {
        try {
          setUser(JSON.parse(newStoredUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    setUser(null);
    
    // Dispatch event to notify other components about logout
    window.dispatchEvent(new Event('auth-changed'));
    
    navigate("/login");
  };

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
            {user ? (
              <>
                <span className="font-medium text-primary mr-2">{user.name}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};