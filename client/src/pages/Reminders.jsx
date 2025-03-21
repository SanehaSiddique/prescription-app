import React, { useState, useEffect } from "react";
import API from "../../axiosInstance";
import Swal from "sweetalert2";
import PatientSidebar from "../components/PatientSidebar";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Bell } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState("All");
  const userType = localStorage.getItem("userType");
  const patientEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const notify = () => toast.error("Missed medicine!", { position: "bottom-left", autoClose: 3000 });

  useEffect(() => {
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
      fetchReminders();
      const interval = setInterval(fetchReminders, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [userType, navigate]);

  const fetchReminders = async () => {
    try {
      const response = await API.get(`/reminders?patientEmail=${patientEmail}`);
      const sortedReminders = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Check for missed reminders (older than 2 days and still Pending)
      sortedReminders.forEach((reminder) => {
        const twoDaysAgo = new Date(new Date() - 48 * 60 * 60 * 1000); // 2 days in milliseconds
        if (reminder.status === "Pending" && new Date(reminder.createdAt) < twoDaysAgo) {
          markAsMissed(reminder._id);
        }
      });

      setReminders(sortedReminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const markAsTaken = async (id) => {
    try {
      await API.put(`/update-reminder?id=${id}`, { status: "Taken" });
      Swal.fire("Success", "Marked as taken!", "success");
      fetchReminders();
    } catch (error) {
      Swal.fire("Error", "Failed to update reminder.", "error");
    }
  };

  const markAsMissed = async (id) => {
    try {
      await API.put(`/update-reminder?id=${id}`, { status: "Missed" });
      notify();
      fetchReminders();
    } catch (error) {
      Swal.fire("Error", "Failed to mark reminder as missed.", "error");
    }
  };

  // Filter reminders based on the selected status
  const filteredReminders =
    filter === "All" ? reminders : reminders.filter((r) => r.status === filter);

  return (
    <>
      <Helmet>
        <title>Reminders</title>
      </Helmet>
      <div className="flex min-h-screen mt-22 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <PatientSidebar />
        <div className="p-8 w-full">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medicine Reminders</h1>
                <div className="mb-6 flex items-center justify-end">
                  <Bell className="text-blue-600 dark:text-blue-400 mr-4" size={32} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-6 py-2 border rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Taken">Taken</option>
                    <option value="Missed">Missed</option>
                  </select>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Here you get the reminders of your medicines</p>
            </div>

            <div className="space-y-6">
              {filteredReminders.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">No reminders found.</p>
              ) : (
                filteredReminders.map((reminder) => (
                  <div
                    key={reminder._id}
                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 transition-all hover:shadow-xl"
                    style={{
                      borderLeftColor:
                        reminder.status === "Missed"
                          ? "#EF4444"
                          : reminder.status === "Taken"
                            ? "#10B981"
                            : "#F59E0B",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{reminder.medicine}</h2>
                        <p className="text-gray-600 dark:text-gray-300">{reminder.dosage}</p>
                      </div>
                      <div
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${reminder.status === "Missed"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : reminder.status === "Taken"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                      >
                        {reminder.status}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Clock size={16} />
                        <span>
                          {new Date(reminder.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {reminder.status === "Pending" && (
                        <button
                          onClick={() => markAsTaken(reminder._id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                        >
                          <CheckCircle size={16} />
                          <span>Mark as Taken</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
      </div>
    </>
  );
};

export default Reminders;
