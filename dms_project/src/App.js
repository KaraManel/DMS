import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NormalUserSidebar from './components/normal_user/Sidebar'; // Normal User Sidebar
import Users from './pages/Users';
import Folders from './pages/Folders';
import FilesGrid from './pages/FilesGrid';
import NormalUser from './pages/NormalUser';
import LogoutButton from './components/LogoutButton'; // Import Logout Button
import Login from "./components/Login";
import { Box } from '@mui/material';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isNormalUserPage = location.pathname === "/NormalUser";

  return (
    <Box display="flex">
      {!isLoginPage && (
        isNormalUserPage ? <NormalUserSidebar /> : <Sidebar />
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {!isLoginPage && <LogoutButton />} {/* Show logout button on all pages except login */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/folders" element={<Folders />} />
          <Route path="/folder/:folderId" element={<FilesGrid />} />
          <Route path="/NormalUser" element={<NormalUser />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
