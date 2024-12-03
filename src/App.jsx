import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
// import Dashboard from './components/dashboard'; 
import Dashboard from './components/dashboard2'; 
import Booking from './components/booking'; 
import Profile from './components/profile'; 
import Navbar from './components/navbar';
// import Admin from './components/admin';
import Admin from './components/admin2';

function App() {
  return (
    <Router>
      <div className="max-w-screen-sm mx-auto">
        <Navbar/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
