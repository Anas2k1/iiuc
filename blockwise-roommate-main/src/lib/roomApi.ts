import axios from "axios";

export async function fetchRooms() {
  const res = await axios.get("/api/rooms");
  return res.data;
}
