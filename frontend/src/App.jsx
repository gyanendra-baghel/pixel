// src/Routes.jsx
import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from "./pages/Home";
import FullImage from "./components/FullImage ";
import PhotoAlbums from "./components/PhotoAlbum";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";
import RecentlyDeleted from "./components/RecentlyDeleted";
import Objects from "./components/Objects";
import People from "./components/People";
import Fev from "./components/Fev";
import SharedAlbum from "./components/SharedAlbum";
import { Settings } from "lucide-react";
import LoginPage from "./pages/Login"; // Your login page component
import ImageUpload from './pages/ImageUpload';

// Helper to check if the user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("accessToken") !== null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <LoginPage />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Home />} />

        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path='/upload' element={<ImageUpload />} />

        {/* Protected Routes */}
        <Route path="/fullimage" element={<Layout><FullImage /></Layout>} />
        <Route path="/albums" element={<ProtectedRoute><Layout><PhotoAlbums /></Layout></ProtectedRoute>} />
        <Route path="/recently-deleted" element={<ProtectedRoute><Layout><RecentlyDeleted /></Layout></ProtectedRoute>} />
        <Route path="/objects" element={<ProtectedRoute><Layout><Objects /></Layout></ProtectedRoute>} />
        <Route path="/people" element={<ProtectedRoute><Layout><People /></Layout></ProtectedRoute>} />
        <Route path="/like" element={<ProtectedRoute><Layout><Fev /></Layout></ProtectedRoute>} />
        <Route path="/shared" element={<ProtectedRoute><Layout><SharedAlbum /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
