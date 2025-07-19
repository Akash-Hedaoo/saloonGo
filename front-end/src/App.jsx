import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchDashboard from './pages/SearchDashboard';
import UserProfile from './pages/UserProfile';
import ShopkeeperProfile from './pages/ShopkeeperProfile';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import SaloonBooking from './pages/SaloonBooking';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/shopkeeper-profile" element={<ShopkeeperProfile />} />
        <Route path="/shopkeeper-dashboard" element={<ShopkeeperDashboard />} />
        <Route path="/saloon-booking" element={<SaloonBooking />} />
      </Routes>
    </Router>
  );
};

export default App;
