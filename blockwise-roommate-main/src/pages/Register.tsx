import { useState } from "react";
import axios from "axios";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";

const Register = () => {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
  const res = await axios.post("/api/auth/register", { name, email, password, role });
  setSuccess(res.data.message || "Registration successful!");
  // Save role in localStorage
  localStorage.setItem("role", role);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <div className="flex justify-center mb-6 gap-4">
          <Button variant={role === "student" ? "default" : "outline"} onClick={() => setRole("student")}>Student</Button>
          <Button variant={role === "teacher" ? "default" : "outline"} onClick={() => setRole("teacher")}>Teacher</Button>
        </div>
        <form className="bg-background rounded-lg shadow p-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
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
              placeholder="Create a password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}
          <Button type="submit" className="w-full">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</Button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-primary hover:underline">Already have an account? Login</a>
        </div>
      </main>
    </div>
  );
};

export default Register;
