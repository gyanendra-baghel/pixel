import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom';
import FullImage from "./components/FullImage ";
import PhotoAlbums from "./components/PhotoAlbum";
import Layout from "./components/Layout";
import RecentlyDeleted from "./components/RecentlyDeleted";
import Objects from "./components/Objects";
import People from "./components/People";
import Fev from "./components/Fev";
import SharedAlbum from "./components/SharedAlbum";
import { Settings } from "lucide-react";
import LoginPage from "./pages/Login"; // Your login page component
import ImageUpload from './pages/ImageUpload';
import Signup from './pages/Signup';
import General from './components/General';

// Helper to check if the user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  console.log("ProtectedRoute: Checking authentication");
  console.log("ProtectedRoute: Token:", localStorage.getItem("token"));
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<General />} />
          <Route path="/library" element={<General />} />
          <Route path='/upload' element={<ImageUpload />} />
          <Route path="/fullimage" element={<FullImage />} />
          <Route path="/albums" element={<PhotoAlbums />} />
          <Route path="/recently-deleted" element={<RecentlyDeleted />} />
          <Route path="/objects" element={<Objects />} />
          <Route path="/people" element={<People />} />
          <Route path="/like" element={<Fev />} />
          <Route path="/shared" element={<SharedAlbum />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
