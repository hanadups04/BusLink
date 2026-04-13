import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Outlet,
  useNavigate,
  Await,
} from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import BookingPage from "./Pages/BookingPage";
import TripsPage from "./Pages/TripsPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
// import AdminPage from "./Pages/AdminPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/booking/:route" element={<BookingPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/myBookings" element={<MyBookingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/admin" element={<AdminPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
