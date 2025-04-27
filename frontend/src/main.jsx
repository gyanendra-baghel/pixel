import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Settings from './pages/Settings.jsx'
import MyUploads from './pages/MyUploads.jsx'
import { ReviewImages } from './pages/ReviewImages.jsx'
import { ManageUsers } from './pages/ManageUsers.jsx'
import ImageUpload from './pages/ImageUpload';
import GalleryPage from './pages/Gallery.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import MainLayout from './components/MainLayout.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  console.log("ProtectedRoute: Checking authentication");
  console.log("ProtectedRoute: Token:", localStorage.getItem("token"));
  if (!isAuthenticated()) {
    return <Navigate to="/landing" />;
  }
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<LandingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gallery/:galleryId" element={<GalleryPage />} />
          <Route path='/gallery/:galleryId/upload' element={<ImageUpload />} />
          <Route path="/gallery/:galleryId/manage-users" element={<ManageUsers />} />
          <Route path="/gallery/:galleryId/review-images" element={<ReviewImages />} />
          <Route path="/my-uploads" element={<MyUploads />} />
          <Route path="/settings" element={<Settings />} />
          <Route path='/profile' element={<ProfilePage />} />
          {/* <Route path="/albums" element={<PhotoAlbums />} />
          <Route path="/recently-deleted" element={<RecentlyDeleted />} />
          <Route path="/objects" element={<Objects />} />
          <Route path="/people" element={<People />} />
          <Route path="/like" element={<Fev />} />
          <Route path="/shared" element={<SharedAlbum />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
