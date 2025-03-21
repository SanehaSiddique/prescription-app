import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import API from "../../axiosInstance";
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';

const Patients = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userType = localStorage.getItem('userType');
  const doctorEmail = localStorage.getItem('userEmail'); // Assuming you store the doctor's email in local storage
  const navigate = useNavigate();

  useEffect(() => {
    if (userType !== "doctor") {
      Swal.fire({
        icon: "warning",
        title: "Not Authorized",
        text: "You are not a doctor!",
        confirmButtonColor: "#38A169",
      }).then(() => {
        navigate("/");
      });
    } else {
      fetchPatients();
    }
  }, [userType, navigate]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`/patients?doctorEmail=${doctorEmail}`);
      setTotalPatients(response.data.totalPatients);
      setPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch patients. Please try again later.",
        confirmButtonColor: "#38A169",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Patients</title>
      </Helmet>
      <div className="flex min-h-screen mt-22 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
        <Sidebar />

        <div className="p-8 w-full ml-4">
          <div className="p-6 lg:p-8 w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 text-center dark:text-white">
              Patients
            </h1>
            <p className="text-gray-600 text-center dark:text-gray-300 mt-2">
              Here you can view all the patients you have dealt with.
            </p>
          </div>

          {/* Total Patients Card */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Total Patients: <span className="text-blue-500">{totalPatients}</span>
            </h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading patients...</p>
            </div>
          )}

          {/* Patients List */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.length === 0 && !isLoading ? (
              <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
                No patients found.
              </p>
            ) : (
              patients.map((patient, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg border-l-4 dark:bg-gray-800 border-green-400 hover:shadow-xl transition-all duration-300"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    <span className="text-blue-500">Patient Name:</span> {patient.name}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    <span className="font-semibold">Email:</span> {patient.email}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    <span className="font-semibold">Last Dealt:</span> {new Date(patient.lastDealtDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Patients;
