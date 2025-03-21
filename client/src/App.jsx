import { useEffect } from "react";
import Header from './components/Header'
import Home from './pages/Home'
import Footer from './components/Footer'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Help from './pages/Help';
import ContactUs from './pages/ContactUs';
import Signup from './pages/Signup'
import Login from './pages/Login'
import DoctorDashboard from "./pages/DoctorDashboard";
import PrivateRoute from "./components/PrivateRoute";
import CreatePrescription from "./pages/CreatePrescription";
import Prescriptions from "./pages/Prescriptions";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";
import PatientProfile from "./pages/PatientProfile";
import PatientDashboard from "./pages/PatientDashboard";
import ScanPrescription from "./pages/ScanPrescription";
import PatientPrescription from "./pages/PatientPrescription";
import Reminders from './pages/Reminders';
import GuestModePage from './pages/GuestModePage';
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/guest-mode" element={<GuestModePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/doctor-dashboard"
          element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-prescription"
          element={
            <PrivateRoute>
              <CreatePrescription />
            </PrivateRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <PrivateRoute>
              <Prescriptions />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <Patients />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/scan-prescription"
          element={
            <PrivateRoute>
              <ScanPrescription />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-prescription"
          element={
            <PrivateRoute>
              <PatientPrescription />
            </PrivateRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <PrivateRoute>
              <Reminders />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-profile"
          element={
            <PrivateRoute>
              <PatientProfile />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App
