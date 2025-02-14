import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import API from "../../../axiosInstance";
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
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
      fetchPrescriptions();
    }
  }, [userType, navigate]);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`/prescriptions?doctorEmail=${doctorEmail}`);
      setPrescriptions(response.data);
      setFilteredPrescriptions(response.data); // Initialize filtered prescriptions with all data
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch prescriptions. Please try again later.",
        confirmButtonColor: "#38A169",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = prescriptions.filter((prescription) =>
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  };

  return (
    <>
      <Helmet>
        <title>Prescriptions</title>
      </Helmet>
      <div className="flex mt-22 min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
        <Sidebar />

        <div className="p-8 w-full ml-4">
          <div className="p-6 lg:p-8 w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 text-center dark:text-white">
              Prescription Records
            </h1>
            <p className="text-gray-600 text-center dark:text-gray-300 mt-2">
              Here you can find digital prescriptions for patients
            </p>
          </div>

          {/* Search Bar with Button */}
          <div className="mt-8 flex justify-center gap-4">
            <input
              type="text"
              placeholder="Search by patient name"
              className="border p-3 rounded-lg w-96 focus:ring-2 focus:ring-blue-400 transition duration-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Search
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading prescriptions...</p>
            </div>
          )}

          {/* Prescription List */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrescriptions.length === 0 && !isLoading ? (
              <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
                No prescriptions found.
              </p>
            ) : (
              filteredPrescriptions.map((prescription, index) => (
                <div
                  key={prescription._id}
                  className="bg-white p-6 rounded-xl shadow-lg border-l-4 dark:bg-gray-800 border-blue-400 hover:shadow-xl transition-all duration-300"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    <span className="text-blue-500">Patient:</span> {prescription.patientEmail}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    <span className="font-medium">Medicines:</span> {prescription.medicines}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    <span className="font-medium">Schedule:</span> {prescription.schedule}
                  </p>
                  <p className="text-gray-500 text-sm mt-4 dark:text-gray-400">
                    <span className="font-medium">Created on:</span>{" "}
                    {new Date(prescription.createdAt).toLocaleDateString()}
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

export default Prescriptions;