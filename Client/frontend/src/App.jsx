import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../src/components/Home";
import Login from "../src/components/Login";

import Navbar from "../src/components/Navbar";
import AdminDashboard from "../src/components/AdminDashboard"; // Import Admin Dashboard
import PassengerDashboard from "../src/components/PassengerDashboard"; // Import Passenger Dashboard
import Signup from "./components/SignUp";
import DriverDashboard from "./components/DriverDashboard";
import Booking from "./components/Booking";
// import ForgotPassword from "./components/ForgotPassword";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Route to Admin Dashboard */}
        <Route path="/passenger-dashboard" element={<PassengerDashboard/>} />
        <Route path="/driver-dashboard" element={<DriverDashboard/>} />
        <Route path="/booking" element={<Booking/>} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Routes>
    </>
  );
}

export default App;