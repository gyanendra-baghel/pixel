import React, { useState } from 'react';
import axiosInstance from '../utils/api';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' // Default role
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/register', formData);
      setMessage('Signup successful!');
      setMessageType('success');
      console.log('Signup Response:', res.data);
    } catch (error) {
      console.error('Signup Error:', error.response?.data || error.message);
      setMessage('Signup failed. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg md:w-1/2">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

        {message && (
          <div className={`mb-4 p-3 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Create a password"
              minLength="8"
            />
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="USER">Regular User</option>
              <option value="UPLOADER">Content Uploader</option>
              <option value="ADMIN">Administrator</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {formData.role === 'admin' && 'Full system access and management'}
              {formData.role === 'uploader' && 'Can upload and manage content'}
              {formData.role === 'user' && 'Standard account privileges'}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 ${isLoading ? 'bg-gray-400' : 'bg-gray-800 hover:bg-gray-700'
              } text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-gray-800 hover:underline font-medium">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
