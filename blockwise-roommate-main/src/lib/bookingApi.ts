import axios from "axios";

export async function createBooking({ room, date, timeSlot }: { room: string; date: string; timeSlot: string }) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "/api/bookings",
    { room, date, timeSlot },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}
