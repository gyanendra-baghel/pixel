import React, { useState } from "react";
import { User2 } from "lucide-react";
import axiosInstance from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Replace with your actual API endpoint
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      console.log(response.data);
      if (response.data) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
      }

      setSuccessMessage("Login successful!");
      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto md:w-1/2">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <User2 size={40} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              placeholder="••••••••"
            />
            <div className="flex justify-end mt-1">
              <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
              ) : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button type="button" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </button>
            </p>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Admin: admin@example.com / admin123</p>
            <p>Uploader: uploader@example.com / upload123</p>
            <p>Viewer: viewer@example.com / view123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
