import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home"; 
import Header from "./Header";
import FullImage from "./FullImage ";
import PhotoAlbums from "./PhotoAlbum";
import Sidebar from "./Sidebar";
import Layout from "../components/Layout";
import RecentlyDeleted from "./RecentlyDeleted";
import Objects from "./Objects";
import People from "./People ";
import Fev from "./Fev";
import SharedAlbum from "./SharedAlbum";
import { Settings } from "lucide-react";
const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,  
  },
  {
    path: "/library",
    element: <Home />, 
  },
  {
    path: "/fullimage",
    element: (
      <Layout>
        <FullImage />
      </Layout>
    ),
  },
  {
    path: "/albums",
    element: (
      <Layout>
        <PhotoAlbums />
      </Layout>
    ),
  },
  {
    path: "/recently-deleted",
    element: (
      <Layout>
        <RecentlyDeleted />
      </Layout>
    ),
  },
  {
    path: "/objects",
    element: (
      <Layout>
        <Objects />
      </Layout>
    ),
  },
  {
    path: "/people",
    element: (
      <Layout>
        <People />
      </Layout>
    ),
  }, 
  {
    path: "/like",
    element: (
      <Layout>
        <Fev />
      </Layout>
    ),
  },
  {
    path: "/shared",
    element: (
      <Layout>
        <SharedAlbum />
      </Layout>
    ),
  },
  {
    path: "/settings",
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
  },
]);

export default Routes;