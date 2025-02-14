import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientSidebar from "../components/PatientSidebar";
import { useSelector, useDispatch } from "react-redux";
import { fetchPatientByEmail } from "../redux/slice/patientSlice";
import { Bell, FileText, Scan, Clock, Calendar, Pill } from "lucide-react";
import Swal from "sweetalert2";
import { Helmet } from 'react-helmet';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { data: patient, loading, error } = useSelector((state) => state.patient);

  const userType = localStorage.getItem("userType");

  useEffect(() => {
    // If the user is logged in but not a patient, show the popup and redirect
    if (userType !== "patient") {
      Swal.fire({
        icon: "warning",
        title: "Not Authorized",
        text: "You are not a patient!",
        confirmButtonColor: "#38A169",
      }).then(() => {
        navigate("/");
      });
    } else {
      // Fetch patient data if the user is a patient
      if (auth.user && !patient) {
        dispatch(fetchPatientByEmail(auth.user.email));
      }
    }
  }, [userType, auth.user, patient, dispatch, navigate]);

  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p>Error: {error}</p>;

  // Mock data for notifications and reminders
  const instructions = [
    { id: 1, message: "To get latest digital prescription from your doctor, use the Scan Prescription." },
    { id: 2, message: "Access the View Prescriptions section to review your past prescriptions." },
    { id: 3, message: "Use Reminders feature to keep track of your medicines." },
  ];

  const reminders = [
    { id: 1, title: "Take Medication on time", time: "as prescribed by doctor" },
    { id: 2, title: "Follow-up Appointments", time: "consult doctor on time" },
  ];

  return (
    <>
      <Helmet>
        <title>Patient Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-blue-50 dark:bg-gray-900 mt-22 overflow-x-hidden">
        <PatientSidebar />


        <main className="flex-1 p-6 transition-all duration-300 ml-10">
          <div data-aos="fade-up" className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Welcome Back, {patient ? `${patient.username}` : "Patient"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your health and stay on top of your medical needs
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <button
                onClick={() => navigate("/scan-prescription")}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center gap-4"
              >
                <Scan size={24} className="text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Scan Prescription</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Upload or scan your prescription</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/patient-prescription")}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center gap-4"
              >
                <FileText size={24} className="text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">View Prescriptions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Access your past prescriptions</p>
                </div>
              </button>

              <button
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center gap-4"
              >
                <Bell size={24} className="text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Check your latest updates</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/reminders")}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center gap-4"
              >
                <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Reminders</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Set and manage your reminders</p>
                </div>
              </button>
            </div>

            {/* Instructions Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div
                data-aos="fade-right"
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Instructions
                </h2>
                <div className="space-y-4">
                  {instructions.map((instr) => (
                    <div
                      key={instr.id}
                      className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-gray-700 rounded-lg"
                    >
                      <Bell size={16} className="text-blue-600 dark:text-blue-400" />
                      <div>
                        <p>{instr.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reminders Section */}
              <div
                data-aos="fade-left"
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Reminders</h2>
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-gray-700 rounded-lg"
                    >
                      <Clock size={16} className="text-green-600 dark:text-green-400" />
                      <div>
                        <p>{reminder.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{reminder.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PatientDashboard;