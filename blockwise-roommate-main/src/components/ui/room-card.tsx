import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    block: string;
    capacity: number;
    status: 'vacant' | 'occupied';
    nextAvailable?: string;
    floor: number;
    hasWifi: boolean;
    hasProjector: boolean;
  };
  onRequest?: (roomId: string) => void;
  isLoggedIn: boolean;
  showTeacherActions?: boolean;
}

export const RoomCard = ({ room, onRequest, isLoggedIn, showTeacherActions }: RoomCardProps) => {
  const isVacant = room.status === 'vacant';
  return (
    <Card className={cn(
      "room-card cursor-pointer",
      isVacant ? "vacant" : "occupied"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{room.name}</CardTitle>
          <Badge 
            variant={isVacant ? "default" : "destructive"}
            className={cn(
              "font-medium",
              isVacant ? "bg-success text-success-foreground" : "bg-occupied text-occupied-foreground"
            )}
          >
            {isVacant ? 'Vacant' : 'Occupied'}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          Block {room.block} • Floor {room.floor}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{room.capacity} seats</span>
          </div>
          <div className="flex items-center space-x-2">
            {room.hasWifi && <Wifi className="h-4 w-4 text-primary" />}
            {room.hasProjector && <div className="w-4 h-4 bg-primary rounded-full" />}
          </div>
        </div>
        
        {!isVacant && room.nextAvailable && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            Available at {room.nextAvailable}
          </div>
        )}
        {/* Student: Request Room */}
        {!showTeacherActions && (
          <Button 
            className="w-full" 
            variant={isVacant ? "default" : "secondary"}
            disabled={!isVacant || !isLoggedIn || !onRequest}
            onClick={() => onRequest && onRequest(room.id)}
          >
            {isVacant ? (isLoggedIn ? 'Request Room' : 'Login to Request') : 'Not Available'}
          </Button>
        )}
        {/* Teacher: Accept/Reject Room Request (UI only, needs backend integration) */}
        {showTeacherActions && (
          <div className="flex gap-2">
            <Button className="w-1/2" variant="default" onClick={() => alert('Accepted!')}>Accept</Button>
            <Button className="w-1/2" variant="destructive" onClick={() => alert('Rejected!')}>Reject</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};