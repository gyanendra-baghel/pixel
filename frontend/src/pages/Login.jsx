// src/components/LoginPage.jsx
import React, { useState } from 'react';
import axiosInstance from '../utils/api'; // Import axios instance
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send login request
      const response = await axiosInstance.post('/api/auth/login/', {
        email,
        password,
      });

      const { token } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('token', token);

      // Redirect to another page or update UI
      // For example, redirect to the dashboard
      navigate("/");
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
