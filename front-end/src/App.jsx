import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchDashboard from './pages/SearchDashboard';
import UserProfile from './pages/UserProfile';
import Auth from './pages/Auth';
import LandingPage from './pages/LandingPage';
import Contact from './pages/Contact';
import ShopRegistration from './pages/ShopRegistration';
import AdminPanel from './pages/AdminPanel';
import AppointmentBooking from './pages/AppointmentBooking';
import SalonDetails from './components/SalonDetails';

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
        <Route path="/shop-registration" element={<ShopRegistration />} />
        <Route path="/search" element={<SearchDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/appointment-booking" element={<AppointmentBooking />} />
        <Route path="/salon-details" element={<SalonDetails />} />
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
