import { useState, useEffect } from "react";
import axios from "axios";
import { Navigation } from "@/components/ui/navigation";
import { dummyRoutine } from "@/lib/dummyRoutine";

const Schedule = () => {
  const [routine, setRoutine] = useState<any[]>(dummyRoutine);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
    fetchRoutine();
  }, []);

  const fetchRoutine = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch schedule from database
      const response = await axios.get(
        "http://localhost:5000/api/schedules",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setRoutine(response.data);
      } else {
        // Fallback to dummy data if no routine in database
        setRoutine(dummyRoutine);
      }
    } catch (err) {
      console.error("Failed to fetch routine", err);
      // Fallback to dummy data on error
      setRoutine(dummyRoutine);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rooms");
      if (response.data) setRooms(response.data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  };

  // Fetch routine when auth changes (user logs in/out)
  useEffect(() => {
    const handleAuthChange = () => {
      fetchRoutine();
      fetchRooms();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto py-16">
          <div className="text-center">Loading schedule...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">Schedule</h1>
        <p className="mb-8 text-lg text-muted-foreground">View your room booking schedule.</p>
        {/* Dynamic class routine table */}
        <div className="bg-background rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold mb-4">Class Routine</h2>
          {routine.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No schedule available. Please check back later.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-left">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Day</th>
                    <th className="border px-4 py-2">Time</th>
                    <th className="border px-4 py-2">Block</th>
                    <th className="border px-4 py-2">Course</th>
                    <th className="border px-4 py-2">Room</th>
                    <th className="border px-4 py-2">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {routine.map((item, idx) => {
                    // Resolve room name robustly using populated room or rooms list
                    const getRoomName = (it: any) => {
                      if (!it || !it.room) return 'Unknown Room';
                      // If populated object with name
                      if (typeof it.room === 'object') {
                        if (it.room.name) return it.room.name;
                        if (it.room._id) {
                          const found = rooms.find((r) => String(r._id) === String(it.room._id));
                          if (found) return found.name;
                        }
                      }

                      // If room is just an id string
                      const roomId = it.room._id || it.room.roomId || it.room;
                      const found = rooms.find((r) => String(r._id) === String(roomId));
                      if (found) return found.name;

                      // Fallback to whatever string we have (trimmed)
                      if (typeof roomId === 'string') return roomId;
                      return 'Unknown Room';
                    };

                    const roomName = getRoomName(item);
                    return (
                      <tr key={idx}>
                        <td className="border px-4 py-2">{item.day}</td>
                        <td className="border px-4 py-2">{item.time}</td>
                        <td className="border px-4 py-2">{item.block ? `Block ${item.block}` : 'Block A'}</td>
                        <td className="border px-4 py-2">{item.course}</td>
                        <td className="border px-4 py-2">{roomName}</td>
                        <td className="border px-4 py-2">{item.teacher}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Schedule;
