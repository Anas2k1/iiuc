import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      setSuccess("Login successful!");
      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user && res.data.user.role) {
        localStorage.setItem("role", res.data.user.role);
      }
      // Redirect to homepage after short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <div className="flex justify-center mb-6 gap-4">
          <Button variant={role === "student" ? "default" : "outline"} onClick={() => setRole("student")}>Student</Button>
          <Button variant={role === "teacher" ? "default" : "outline"} onClick={() => setRole("teacher")}>Teacher</Button>
        </div>
        <form className="bg-background rounded-lg shadow p-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}
          <Button type="submit" className="w-full">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</Button>
        </form>
        <div className="text-center mt-4">
          <a href="/register" className="text-primary hover:underline">Don't have an account? Register</a>
        </div>
      </main>
    </div>
  );
};

export default Login;
