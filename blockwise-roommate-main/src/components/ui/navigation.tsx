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
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Building2 className="h-8 w-8 text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold text-primary group-hover:text-primary/90 transition-colors duration-300">IIUC Room Booking</span>
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/rooms" className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 group border border-transparent hover:border-primary/20 overflow-hidden">
              <span className="relative z-10 flex items-center">
                <Building2 className="h-4 w-4 mr-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                Rooms
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/15 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/bookings" className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 group border border-transparent hover:border-primary/20 overflow-hidden">
              <span className="relative z-10 flex items-center">
                <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
                My Bookings
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/15 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/about" className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 group border border-transparent hover:border-primary/20 overflow-hidden">
              <span className="relative z-10 flex items-center">
                <Settings className="h-4 w-4 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                About
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/15 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10">
              <Link to="/schedule" className="flex items-center relative z-10">
                <div className="relative mr-2">
                  <Calendar className="h-4 w-4 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                </div>
                <span className="group-hover:text-primary transition-colors duration-300">Schedule</span>
              </Link>
            </Button>
            {user ? (
              <>
                <span className="font-medium text-primary mr-2 hidden sm:inline">{user.name}</span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-950 dark:hover:to-red-900 hover:border-red-300 hover:shadow-lg hover:shadow-red-100 dark:hover:shadow-red-900 transition-all duration-300">
                  <div className="relative mr-2">
                    <LogOut className="h-4 w-4 group-hover:scale-125 group-hover:rotate-12 group-hover:-translate-x-1 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-red-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                  </div>
                  <span className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">Logout</span>
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" asChild className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                <Link to="/login" className="flex items-center relative z-10">
                  <div className="relative mr-2">
                    <LogIn className="h-4 w-4 group-hover:scale-125 group-hover:rotate-12 group-hover:translate-x-1 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                  </div>
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};