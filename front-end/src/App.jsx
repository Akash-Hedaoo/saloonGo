import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchDashboard from './pages/SearchDashboard';
import UserProfile from './pages/UserProfile';
import Auth from './pages/Auth';
import LandingPage from './pages/LandingPage';
import Contact from './pages/Contact';

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth initialMode='login' standalone />} />
        <Route path="/register" element={<Auth initialMode='register' standalone />} />
        <Route path="/search" element={<SearchDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
