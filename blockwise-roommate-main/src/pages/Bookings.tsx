import { useEffect, useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { fetchMyBookings, deleteBooking, updateBooking } from "@/lib/myBookingsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";

const Bookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTimeSlot, setEditTimeSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchMyBookings();
      // Only show bookings for the current user
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      setBookings(data.filter((b: any) => b.user && b.user._id === user.id));
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteBooking(id);
    loadBookings();
  };

  const handleEdit = (booking: any) => {
    setEditId(booking._id);
    setEditDate(booking.date ? booking.date.substring(0, 10) : "");
    setEditTimeSlot(booking.timeSlot || "");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setSubmitting(true);
    await updateBooking(editId, { date: editDate, timeSlot: editTimeSlot });
    setEditId(null);
    setSubmitting(false);
    loadBookings();
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">My Bookings</h1>
        <p className="mb-8 text-lg text-muted-foreground">View and manage your room bookings.</p>
        {loading ? (
          <div className="bg-background rounded-lg shadow p-8 text-center text-muted-foreground">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-background rounded-lg shadow p-8 text-center text-muted-foreground">No bookings found.</div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-background rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-semibold text-lg">{booking.room?.name || "Room"}</div>
                  <div className="text-muted-foreground text-sm">Date: {booking.date?.substring(0, 10)} | Time: {booking.timeSlot}</div>
                  <div className="text-muted-foreground text-sm">Booked by: {booking.user?.name || "You"}</div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={editId === booking._id} onOpenChange={open => !open && setEditId(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(booking)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                          <label className="block mb-1">Date</label>
                          <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required />
                        </div>
                        <div>
                          <label className="block mb-1">Time Slot</label>
                          <Input type="text" value={editTimeSlot} onChange={e => setEditTimeSlot(e.target.value)} required />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDelete(booking._id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookings;
