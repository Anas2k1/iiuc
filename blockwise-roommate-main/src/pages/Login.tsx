import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // ===== FORGOT PASSWORD =====
  const handleForgotPassword = () => {
    toast({
      title: "Password Recovery",
      description: "📞 Contact Admin: 01629381024",
    });
  };

  // ===== STUDENT/TEACHER LOGIN =====
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userRole", response.data.user.role);
      localStorage.setItem("role", response.data.user.role);
      
      // Dispatch event to notify other components about login
      window.dispatchEvent(new Event('auth-changed'));
      
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err: any) {
      if (err.response?.data?.status === "pending") {
        setError("Your account is pending admin approval. Please wait.");
      } else if (err.response?.data?.status === "rejected") {
        setError("Your account has been rejected. Contact admin for details.");
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== STUDENT/TEACHER REGISTER =====
  const handleUserRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email: registrationEmail,
          password,
          role,
        }
      );

      setSuccess(response.data.message);
      setName("");
      setRegistrationEmail("");
      setPassword("");
      setRole("student");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== ADMIN LOGIN =====
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/admin-login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("role", "admin");
      
      // Dispatch event to notify other components about login
      window.dispatchEvent(new Event('auth-changed'));
      
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Room Booking System</h1>

        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Student/Teacher</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          {/* STUDENT/TEACHER LOGIN TAB */}
          <TabsContent value="login" className="space-y-4">
            <form
              className="bg-background rounded-lg shadow p-8 space-y-6"
              onSubmit={handleUserLogin}
            >
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
              {success && <div className="text-green-500 text-center text-sm">{success}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-sm"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Button>
            </form>
          </TabsContent>

          {/* STUDENT/TEACHER REGISTER TAB */}
          <TabsContent value="register" className="space-y-4">
            <form
              className="bg-background rounded-lg shadow p-8 space-y-6"
              onSubmit={handleUserRegister}
            >
              <div>
                <label className="block mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter your email"
                  required
                  value={registrationEmail}
                  onChange={(e) => setRegistrationEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Role</label>
                <select
                  className="w-full px-4 py-2 border rounded"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
              {success && (
                <div className="text-green-500 text-center text-sm">
                  {success}
                  <p className="mt-2 text-xs">Please wait for admin approval before logging in.</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </TabsContent>

          {/* ADMIN LOGIN TAB */}
          <TabsContent value="admin" className="space-y-4">
            <form
              className="bg-background rounded-lg shadow p-8 space-y-6"
              onSubmit={handleAdminLogin}
            >
              <div>
                <label className="block mb-2 font-medium">Admin Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter admin email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Admin Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter admin password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
              {success && <div className="text-green-500 text-center text-sm">{success}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Admin Login"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-sm"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Login;
