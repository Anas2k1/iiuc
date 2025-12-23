import { useState, useEffect, useCallback } from "react";
import { RoomCard } from "./room-card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { fetchRooms } from "@/lib/roomApi";

export const RoomGrid = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  // Check login state on mount and listen for custom auth change events
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role);

    // Listen for auth change events from Login page
    const handleAuthChange = () => {
      const newToken = localStorage.getItem('token');
      const newRole = localStorage.getItem('role');
      setIsLoggedIn(!!newToken);
      setUserRole(newRole);
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const loadRooms = useCallback(() => {
    setLoading(true);
    fetchRooms()
      .then(data => setRooms(data))
      .catch(() => toast({ title: 'Failed to load rooms', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.block?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === "all" || room.block === selectedBlock;
    const matchesStatus = selectedStatus === "all" || room.status === selectedStatus;
    return matchesSearch && matchesBlock && matchesStatus;
  });

  const handleRoomRequest = (roomId: string) => {
    toast({
      title: "Room Request Sent",
      description: "Your request has been submitted to the administration.",
    });
  };

  const vacantCount = filteredRooms.filter(r => r.status === 'vacant').length;
  const occupiedCount = filteredRooms.filter(r => r.status === 'occupied').length;

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Room Availability
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find and book available rooms across all blocks in real-time
          </p>
            {!isLoggedIn && (
              <div className="mt-4">
                <Button variant="outline" onClick={() => window.location.href = '/login'} className="hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  Login to request a room
                </Button>
              </div>
            )}
        </div>

        {/* Filters & Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search rooms or blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Block" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blocks</SelectItem>
                  <SelectItem value="A">Block A</SelectItem>
                  <SelectItem value="B">Block B</SelectItem>
                  <SelectItem value="C">Block C</SelectItem>
                  <SelectItem value="D">Block D</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Summary */}
          <div className="flex gap-4 justify-center">
            <Badge variant="default" className="bg-success text-success-foreground">
              {vacantCount} Vacant
            </Badge>
            <Badge variant="destructive" className="bg-occupied text-occupied-foreground">
              {occupiedCount} Occupied
            </Badge>
          </div>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="text-center py-10">Loading rooms...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id || room.id}
                isLoggedIn={isLoggedIn}
                showTeacherActions={isLoggedIn && userRole === "teacher"}
                room={{
                  id: room._id || room.id,
                  name: room.name,
                  block: room.block || '',
                  capacity: room.capacity,
                  status: room.status || 'vacant',
                  nextAvailable: room.nextAvailable,
                  floor: room.floor || 1,
                  hasWifi: room.hasWifi || false,
                  hasProjector: room.hasProjector || false,
                }}
                onBooked={loadRooms}
              />
            ))}
          </div>
        )}

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No rooms found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedBlock("all");
                setSelectedStatus("all");
              }}
              className="mt-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <Filter className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};