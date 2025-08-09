import axios from "axios";

export async function fetchMyBookings() {
  const token = localStorage.getItem("token");
  const res = await axios.get("/api/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteBooking(id: string) {
  const token = localStorage.getItem("token");
  await axios.delete(`/api/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateBooking(id: string, data: any) {
  const token = localStorage.getItem("token");
  const res = await axios.put(`/api/bookings/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
