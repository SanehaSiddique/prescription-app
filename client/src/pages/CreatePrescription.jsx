import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../axiosInstance";
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import QRCode from "qrcode";  // Only use this import

const CreatePrescription = () => {
    const [newPrescription, setNewPrescription] = useState({
        patientName: "",
        patientEmail: "",
        medicines: "",
        schedule: "",
    });
    const [qrCodeImage, setQrCodeImage] = useState(null); // State to store QR code image
    const userType = localStorage.getItem('userType');
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
        }
    }, [userType, navigate]);

    const handleInputChange = (e) => {
        setNewPrescription({ ...newPrescription, [e.target.name]: e.target.value });
    };

    const createPrescription = async () => {
        if (!newPrescription.patientEmail || !newPrescription.patientEmail || !newPrescription.medicines || !newPrescription.schedule) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill in all fields before submitting!",
                confirmButtonColor: "#38A169",
            });
            return;
        }

        try {
            const doctorEmail = localStorage.getItem("userEmail");
            const response = await API.post("/create-prescription", {
                ...newPrescription,
                doctorEmail,
            });

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Prescription Created!",
                    text: "The prescription has been successfully created.",
                    confirmButtonColor: "#38A169",
                });
                console.log(response.data.prescription._id);

                // Fetch the QR code for the prescription
                // const prescriptionId = response.data.prescription._id; // Extract the correct _id
                const qrResponse = await API.get(`/qrcode?id=${response.data.prescription._id}`);
                setQrCodeImage(qrResponse.data.qrCodeImage); // Assuming qrCodeImage is a URL or base64 string
            }

            setNewPrescription({ patientName: "", patientEmail: "", medicines: "", schedule: "" });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to create prescription.",
                confirmButtonColor: "#E53E3E",
            });
            console.error("Error creating prescription:", error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Create Prescription</title>
            </Helmet>
            <div className="flex min-h-screen mt-22 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
                <Sidebar />

                <div className="p-6 lg:p-8 w-full max-w-4xl mx-auto ml-10 lg:ml-40">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Doctor Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Here you can create digital prescriptions for patients
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-l-8 border-green-300 dark:border-green-600">
                        <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-6">
                            Create Prescription
                        </h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                name="patientName"
                                placeholder="Patient Name"
                                value={newPrescription.patientName}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border-2 border-blue-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300"
                            />

                            <input
                                type="email"
                                name="patientEmail"
                                placeholder="Patient Email"
                                value={newPrescription.patientEmail}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border-2 border-blue-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300"
                            />

                            <textarea
                                name="medicines"
                                placeholder="Medicines (comma separated)"
                                value={newPrescription.medicines}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border-2 border-blue-200 dark:border-gray-700 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300"
                                rows="4"
                            ></textarea>

                            <textarea
                                name="schedule"
                                placeholder="Schedule (e.g., Twice a day)"
                                value={newPrescription.schedule}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border-2 border-blue-200 dark:border-gray-700 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300"
                                rows="3"
                            ></textarea>
                        </div>

                        <button
                            onClick={createPrescription}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-green-300 dark:from-green-500 dark:to-blue-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                        >
                            Create Prescription
                        </button>

                        {/* Display QR Code */}
                        {qrCodeImage && (
                            <div className="mt-8 text-center">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                    Prescription QR Code
                                </h3>
                                <img src={qrCodeImage} alt="Prescription QR Code" className="mx-auto" />
                                <button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = qrCodeImage;
                                        link.download = 'prescription-qr.png';
                                        link.click();
                                    }}
                                    className="mt-4 bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Download QR Code
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatePrescription;
