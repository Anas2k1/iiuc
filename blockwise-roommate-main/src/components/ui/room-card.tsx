import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createBooking } from "@/lib/bookingApi";
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
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localStatus, setLocalStatus] = useState(room.status);
  const { toast } = useToast();
  const isVacant = localStatus === 'vacant';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createBooking({ room: room.id, date, timeSlot });
      setLocalStatus('occupied');
      setOpen(false);
      toast({
        title: 'Booking Successful',
        description: `Room ${room.name} booked for ${date} (${timeSlot})`,
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'Booking Failed',
        description: err?.response?.data?.message || 'Could not book the room. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full"
                variant={isVacant ? "default" : "secondary"}
                disabled={!isVacant || !isLoggedIn}
              >
                {isVacant ? (isLoggedIn ? 'Request Room' : 'Login to Request') : 'Not Available'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Book {room.name}</h3>
                <div>
                  <label className="block mb-1">Date</label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div>
                  <label className="block mb-1">Time Slot</label>
                  <Input type="text" placeholder="e.g. 09:00-10:00" value={timeSlot} onChange={e => setTimeSlot(e.target.value)} required />
                </div>
                <div className="flex gap-2 justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={submitting || !date || !timeSlot}>
                    {submitting ? 'Booking...' : 'Book Room'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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