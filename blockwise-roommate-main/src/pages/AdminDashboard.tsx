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
            <div className="mb-4">
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
            <div className="space-y-4">
              {approvedUsers
                .filter((user) =>
                  user.name.toLowerCase().includes(approvedUserSearch.toLowerCase()) ||
                  user.email.toLowerCase().includes(approvedUserSearch.toLowerCase())
                )
                .map((user) => (
                <Card key={user._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge className="capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={() => openEditDialog(user)}
                      className="w-full"
                    >
                      Edit User
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="w-full"
                    >
                      Delete User
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {approvedUsers.filter((user) =>
                user.name.toLowerCase().includes(approvedUserSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(approvedUserSearch.toLowerCase())
              ).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No users found matching your search
                </div>
              )}
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
      </main>
    </div>
  );
};

export default AdminDashboard;
