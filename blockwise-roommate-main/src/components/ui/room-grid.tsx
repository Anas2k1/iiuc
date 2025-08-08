import { useState } from "react";
import { RoomCard } from "./room-card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for rooms
const mockRooms = [
  { id: '1', name: 'Room 101', block: 'A', capacity: 30, status: 'vacant' as const, floor: 1, hasWifi: true, hasProjector: true },
  { id: '2', name: 'Room 102', block: 'A', capacity: 45, status: 'occupied' as const, nextAvailable: '2:00 PM', floor: 1, hasWifi: true, hasProjector: false },
  { id: '3', name: 'Room 201', block: 'A', capacity: 60, status: 'vacant' as const, floor: 2, hasWifi: true, hasProjector: true },
  { id: '4', name: 'Room 301', block: 'B', capacity: 25, status: 'vacant' as const, floor: 3, hasWifi: false, hasProjector: true },
  { id: '5', name: 'Room 401', block: 'B', capacity: 40, status: 'occupied' as const, nextAvailable: '4:30 PM', floor: 4, hasWifi: true, hasProjector: true },
  { id: '6', name: 'Lab 501', block: 'C', capacity: 35, status: 'vacant' as const, floor: 5, hasWifi: true, hasProjector: false },
  { id: '7', name: 'Auditorium', block: 'D', capacity: 200, status: 'occupied' as const, nextAvailable: '6:00 PM', floor: 1, hasWifi: true, hasProjector: true },
  { id: '8', name: 'Room 105', block: 'A', capacity: 50, status: 'vacant' as const, floor: 1, hasWifi: true, hasProjector: true },
];

export const RoomGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();
    // Simple login state (replace with real auth in production)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.block.toLowerCase().includes(searchTerm.toLowerCase());
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
                <Button variant="outline" onClick={() => window.location.href = '/login'}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onRequest={isLoggedIn ? handleRoomRequest : undefined}
            />
          ))}
        </div>

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
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};