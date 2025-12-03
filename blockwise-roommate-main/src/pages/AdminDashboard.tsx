import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [approvedUserSearch, setApprovedUserSearch] = useState("");
  const [showRoutineDialog, setShowRoutineDialog] = useState(false);
  const [routine, setRoutine] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [currentRoutineEntry, setCurrentRoutineEntry] = useState({
    day: 'Sunday',
    time: '',
    course: '',
    teacher: '',
    roomId: ''
  });
  const [routineLoading, setRoutineLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch pending and approved users
  useEffect(() => {
    fetchUsers();
    fetchRooms();
    fetchRoutine();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        "http://localhost:5000/api/auth/all-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = response.data;
      setPendingUsers(users.filter((u: any) => u.status === "pending"));
      setApprovedUsers(users.filter((u: any) => u.status === "approved"));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  };

  const fetchRoutine = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/schedules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoutine(response.data);
    } catch (err) {
      console.error("Failed to fetch routine", err);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/auth/approve/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "User approved successfully",
      });

      fetchUsers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const reason = rejectionReason[userId] || "";
      
      await axios.put(
        `http://localhost:5000/api/auth/reject/${userId}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "User rejected",
      });

      setRejectionReason((prev) => {
        const newReasons = { ...prev };
        delete newReasons[userId];
        return newReasons;
      });

      fetchUsers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to reject user",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(
        `http://localhost:5000/api/auth/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      fetchUsers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword("");
  };

  const handleEditUser = async () => {
    if (!editName || !editEmail) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setEditLoading(true);
      const token = localStorage.getItem("token");
      
      const updateData: any = {
        name: editName,
        email: editEmail,
      };

      if (editPassword) {
        updateData.password = editPassword;
      }

      await axios.put(
        `http://localhost:5000/api/auth/update/${editingUser._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setEditingUser(null);
      setEditName("");
      setEditEmail("");
      setEditPassword("");
      fetchUsers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddRoutineEntry = () => {
    if (!currentRoutineEntry.time || !currentRoutineEntry.course || !currentRoutineEntry.teacher || !currentRoutineEntry.roomId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setRoutine([...routine, { ...currentRoutineEntry }]);
    setCurrentRoutineEntry({
      day: 'Sunday',
      time: '',
      course: '',
      teacher: '',
      roomId: ''
    });
  };

  const handleRemoveRoutineEntry = (index: number) => {
    setRoutine(routine.filter((_, i) => i !== index));
  };

  const handleSaveRoutine = async () => {
    if (routine.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one routine entry",
        variant: "destructive",
      });
      return;
    }

    try {
      setRoutineLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/schedules/update-routine",
        { routineData: routine },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Routine updated successfully and rooms auto-booked",
      });

      setShowRoutineDialog(false);
      setRoutine([]);
      fetchRoutine();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update routine",
        variant: "destructive",
      });
    } finally {
      setRoutineLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto py-16">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Pending Users Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Pending Registrations ({pendingUsers.length})</h2>
          {pendingUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No pending registrations
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <Card key={user._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-sm">Rejection Reason (optional)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded text-sm"
                        placeholder="If rejecting, provide a reason"
                        value={rejectionReason[user._id] || ""}
                        onChange={(e) =>
                          setRejectionReason((prev) => ({
                            ...prev,
                            [user._id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(user._id)}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(user._id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Approved Users Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Approved Users ({approvedUsers.length})</h2>
          
          {/* Search Input */}
          {approvedUsers.length > 0 && (
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search by username or email..."
                value={approvedUserSearch}
                onChange={(e) => setApprovedUserSearch(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {approvedUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No approved users yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedUsers
                .filter((user) =>
                  user.name.toLowerCase().includes(approvedUserSearch.toLowerCase()) ||
                  user.email.toLowerCase().includes(approvedUserSearch.toLowerCase())
                )
                .map((user) => (
                <Card key={user._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                        </div>
                        <Badge className="capitalize flex-shrink-0">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="text-sm text-muted-foreground">
                      <p><span className="font-semibold">Status:</span> Approved</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openEditDialog(user)}
                        className="flex-1 text-sm"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="flex-1 text-sm"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {approvedUsers.filter((user) =>
                user.name.toLowerCase().includes(approvedUserSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(approvedUserSearch.toLowerCase())
              ).length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  <p className="text-lg">No users found matching your search</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Routine Management Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Class Routine Management</h2>
            <Button onClick={() => setShowRoutineDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              Edit Routine
            </Button>
          </div>

          {routine.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No routine entries yet. Click "Edit Routine" to add one.</p>
            </div>
          ) : (
            <div className="bg-background rounded-lg shadow p-8">
              <div className="overflow-x-auto">
                <table className="min-w-full border text-left">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Day</th>
                      <th className="border px-4 py-2">Time</th>
                      <th className="border px-4 py-2">Course</th>
                      <th className="border px-4 py-2">Teacher</th>
                      <th className="border px-4 py-2">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routine.map((item, idx) => {
                      const room = rooms.find(r => r._id === item.room?._id || r._id === item.roomId);
                      return (
                        <tr key={idx}>
                          <td className="border px-4 py-2">{item.day}</td>
                          <td className="border px-4 py-2">{item.time}</td>
                          <td className="border px-4 py-2">{item.course}</td>
                          <td className="border px-4 py-2">{item.teacher}</td>
                          <td className="border px-4 py-2">{room?.name || 'Unknown'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-sm">Username (Name)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="Enter username"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="Enter email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm">Password (leave empty to keep current)</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="Enter new password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser} disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Routine Management Dialog */}
        <Dialog open={showRoutineDialog} onOpenChange={setShowRoutineDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Class Routine</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Add new entry */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">Add Routine Entry</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-medium text-sm">Day</label>
                    <select
                      value={currentRoutineEntry.day}
                      onChange={(e) => setCurrentRoutineEntry({ ...currentRoutineEntry, day: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm"
                    >
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-sm">Time (e.g., 09:00 - 10:30)</label>
                    <input
                      type="text"
                      placeholder="HH:MM - HH:MM"
                      value={currentRoutineEntry.time}
                      onChange={(e) => setCurrentRoutineEntry({ ...currentRoutineEntry, time: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-sm">Course Code</label>
                    <input
                      type="text"
                      placeholder="e.g., CSE101"
                      value={currentRoutineEntry.course}
                      onChange={(e) => setCurrentRoutineEntry({ ...currentRoutineEntry, course: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-sm">Teacher Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Dr. Ahmed"
                      value={currentRoutineEntry.teacher}
                      onChange={(e) => setCurrentRoutineEntry({ ...currentRoutineEntry, teacher: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-medium text-sm">Room</label>
                    <select
                      value={currentRoutineEntry.roomId}
                      onChange={(e) => setCurrentRoutineEntry({ ...currentRoutineEntry, roomId: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm"
                    >
                      <option value="">Select a room</option>
                      {rooms.map(room => (
                        <option key={room._id} value={room._id}>{room.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button onClick={handleAddRoutineEntry} className="w-full mt-3">
                  Add Entry
                </Button>
              </div>

              {/* Current routine entries */}
              <div>
                <h3 className="font-semibold mb-3">Current Routine ({routine.length} entries)</h3>
                {routine.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No entries added yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {routine.map((entry, idx) => {
                      const room = rooms.find(r => r._id === entry.roomId);
                      return (
                        <div key={idx} className="flex justify-between items-start p-3 border rounded bg-muted/50">
                          <div className="flex-1 text-sm">
                            <p className="font-medium">{entry.day} • {entry.time}</p>
                            <p className="text-muted-foreground">{entry.course} - {entry.teacher}</p>
                            <p className="text-xs text-muted-foreground">{room?.name || 'Unknown Room'}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRoutineEntry(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowRoutineDialog(false);
                setRoutine([]);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveRoutine} disabled={routineLoading} className="bg-blue-600 hover:bg-blue-700">
                {routineLoading ? "Saving..." : "Save & Auto-Book Rooms"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDashboard;
