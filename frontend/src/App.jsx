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
import LoginPage from "./pages/Login"; // Your login page component
import ImageUpload from './pages/ImageUpload';
import Signup from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ManageUsers } from './pages/ManageUsers';
import { ReviewImages } from "./pages/ReviewImages"
import GalleryPage from './pages/Gallery';
import MyUploads from './pages/MyUploads';
import Settings from './components/Settings';

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
          <Route path="/" element={<Dashboard />} />
          <Route path="/gallery/:galleryId" element={<GalleryPage />} />
          <Route path='/gallery/:galleryId/upload' element={<ImageUpload />} />
          <Route path="/gallery/:galleryId/manage-users" element={<ManageUsers />} />
          <Route path="/gallery/:galleryId/review-images" element={<ReviewImages />} />
          <Route path="/my-uploads" element={<MyUploads />} />
          {/* Add more protected routes here */}
          {/* Example: */}
          <Route path="/gallery/:galleryId/fullimage" element={<FullImage />} />
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
