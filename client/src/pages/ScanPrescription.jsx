import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Loader2 } from "lucide-react";
import API from "../../../axiosInstance";
import Swal from "sweetalert2";
import PatientSidebar from "../components/PatientSidebar";
import { Helmet } from 'react-helmet';

const ScanPrescription = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch the latest prescription QR code for the patient using their email
    useEffect(() => {
        const fetchPrescriptionQRCode = async () => {
            try {
                const patientEmail = localStorage.getItem("userEmail"); // Fetch patient email from localStorage
                if (!patientEmail) {
                    throw new Error("Patient email not found. Please log in again.");
                }

                const response = await API.get("/latest-qr", {
                    params: { patientEmail }, // Pass patientEmail as a query parameter
                });

                if (response.data.qrCodeUrl) {
                    setQrCodeUrl(response.data.qrCodeUrl);
                } else {
                    setError("No prescription found for this patient.");
                }
            } catch (err) {
                setError(err.response.data.message || "Failed to fetch QR code. Please try again later.");
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.message || "Failed to fetch QR code. Please try again later.",
                    confirmButtonColor: "#38A169",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptionQRCode();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <>
        <Helmet>
            <title>Scan Prescriptions</title>
        </Helmet>
        <div className="flex min-h-screen mt-22 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
            <PatientSidebar />

            <div data-aos="fade-down" className="p-6 lg:p-8 w-full max-w-4xl mx-auto ml-10 lg:ml-40">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Scan Prescription
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Scan the QR code below to view your latest prescription.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">

                    {qrCodeUrl ? (
                        <div className="flex justify-center">
                            <img src={qrCodeUrl} alt="Prescription QR Code" className="w-64 h-64" />
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300 text-center">No prescription found.</p>
                    )}

                    <button
                        onClick={() => navigate(-1)}
                        className="mt-8 w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default ScanPrescription;