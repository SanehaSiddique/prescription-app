import React, { useState, useEffect } from "react";
import PatientSidebar from "../components/PatientSidebar";
import { useNavigate } from "react-router-dom";
import API from "../../axiosInstance";
import Swal from "sweetalert2";
import { Helmet } from 'react-helmet';

const PatientPrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userType = localStorage.getItem("userType");
  const patientEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

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
      fetchPrescriptions();
    }
  }, [userType, navigate]);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(
        `/patient-prescription?patientEmail=${patientEmail}`
      );
      setPrescriptions(response.data);
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

  return (
    <>
      <Helmet>
        <title>Patient Prescription</title>
      </Helmet>
      <div className="flex min-h-screen mt-22 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <PatientSidebar />
        <div className="p-6 w-full ml-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Prescription Records
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Digital prescriptions from your doctor
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Loading prescriptions...
              </p>
            </div>
          )}

          {/* Prescription Container */}
          <div className="mt-8 flex flex-col gap-6 items-center">
            {prescriptions.length === 0 && !isLoading ? (
              <p className="text-center text-gray-600 dark:text-gray-400">
                No prescriptions found.
              </p>
            ) : (
              prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="w-full max-w-3xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between border-b pb-4 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-blue-500">Patient:</span>{" "}
                        {prescription.patientEmail}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Date:{" "}
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-2 md:mt-0">
                      <span className="text-blue-500">Doctor:</span>{" "}
                      {prescription.doctorEmail}
                    </h2>
                  </div>

                  {/* Medicines & Schedule */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Prescribed Medicines:
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 border-l-4 border-blue-500 pl-4">
                      {prescription.medicines}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Dosage Schedule:
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 border-l-4 border-green-500 pl-4">
                      {prescription.schedule}
                    </p>
                  </div>

                  {/* Signature Area */}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Doctor's Signature:
                    </p>
                    <div className="border-t-2 border-gray-600 dark:border-gray-400 w-32 text-center text-sm text-gray-700 dark:text-gray-300">
                      {prescription.doctorEmail.split("@")[0]}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientPrescription;
