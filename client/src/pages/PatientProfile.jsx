import React, { useState, useEffect } from "react";
import PatientSidebar from "../components/PatientSidebar";
import { useNavigate } from "react-router-dom";
import API from "../../../axiosInstance";
import Swal from 'sweetalert2';
import { FaEdit, FaSave, FaPlusCircle, FaUser, FaEnvelope, FaPhone, FaMoneyBillAlt, FaCreditCard } from "react-icons/fa";
import { Helmet } from 'react-helmet';

const PatientProfile = () => {
    const [patient, setPatient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        billing: {
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            billingAddress: ""
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const userType = localStorage.getItem('userType');
    const patientEmail = localStorage.getItem('userEmail');
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
            fetchPatientInfo();
        }
    }, [userType, navigate]);

    const fetchPatientInfo = async () => {
        setIsLoading(true);
        try {
            const response = await API.get(`/profile?email=${patientEmail}`);
            if (response.data) {
                setPatient(response.data);
                setFormData(response.data);
            } else {
                setIsCreating(true);
            }
        } catch (error) {
            console.error("Error fetching patient information:", error);
            if (error.response && error.response.status === 404) {
                Swal.fire({
                    icon: "info",
                    title: "Profile Not Found",
                    text: "It seems you don't have a profile. Would you like to create one?",
                    showCancelButton: true,
                    confirmButtonText: "Create Profile",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#38A169",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setIsCreating(true);
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch patient information. Please try again later.",
                    confirmButtonColor: "#38A169",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProfile = async () => {
        try {
            const response = await API.post('/profile', { ...formData, email: patientEmail });
            setPatient(response.data);
            setIsCreating(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Profile created successfully!",
                confirmButtonColor: "#38A169",
            });
        } catch (error) {
            console.error("Error creating patient profile:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to create profile. Please try again later.",
                confirmButtonColor: "#38A169",
            });
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            billing: {
                ...formData.billing,
                [name]: value
            }
        });
    };

    const handleSave = async () => {
        try {
            const response = await API.put(`/profile?email=${patientEmail}`, formData);
            setPatient(response.data);
            setIsEditing(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Profile updated successfully!",
                confirmButtonColor: "#38A169",
            });
        } catch (error) {
            console.error("Error updating patient information:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update profile. Please try again later.",
                confirmButtonColor: "#38A169",
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <div className="flex min-h-screen mt-22 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
                <PatientSidebar />

                <div data-aos="fade-down" className="p-8 w-full ml-10">
                    {/* Header */}
                    <div className="p-6 lg:p-8 w-full mx-auto text-center">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            About Me
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Manage your profile information and keep it up to date.
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                        </div>
                    )}

                    {/* Create Profile Prompt */}
                    {isCreating && (
                        <div className="bg-white dark:bg-gray-800 mt-8 p-8 rounded-xl shadow-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                Create Your Profile
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Please fill in the details below to create your profile.
                            </p>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaUser className="inline-block mr-2" /> Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaEnvelope className="inline-block mr-2" /> Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaPhone className="inline-block mr-2" /> Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaCreditCard className="inline-block mr-2" /> Card Number
                                    </label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.billing.cardNumber}
                                        onChange={handleBillingChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaCreditCard className="inline-block mr-2" /> Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={formData.billing.expiryDate}
                                        onChange={handleBillingChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaCreditCard className="inline-block mr-2" /> CVV
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={formData.billing.cvv}
                                        onChange={handleBillingChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaMoneyBillAlt className="inline-block mr-2" /> Billing Address
                                    </label>
                                    <textarea
                                        name="billingAddress"
                                        value={formData.billing.billingAddress}
                                        onChange={handleBillingChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        rows="4"
                                    />
                                </div>
                                <button
                                    onClick={handleCreateProfile}
                                    className="w-full bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                                >
                                    <FaPlusCircle size={20} className="mr-2" /> Create Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Patient's Information */}
                    {patient && !isEditing && !isCreating && (
                        <div className="bg-white dark:bg-gray-800 mt-8 p-8 rounded-xl shadow-lg max-w-2xl mx-auto relative" data-aos="fade-up" data-aos-delay="100">
                            <button
                                onClick={handleEditClick}
                                className="absolute top-6 right-6 text-blue-500 hover:text-blue-700"
                            >
                                <FaEdit size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                Your Profile
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                                        <FaUser className="inline-block mr-2" /> Name
                                    </p>
                                    <p className="text-gray-800 dark:text-white">{patient.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                                        <FaEnvelope className="inline-block mr-2" /> Email
                                    </p>
                                    <p className="text-gray-800 dark:text-white">{patient.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                                        <FaPhone className="inline-block mr-2" /> Contact Number
                                    </p>
                                    <p className="text-gray-800 dark:text-white">{patient.contactNumber}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                                        <FaCreditCard className="inline-block mr-2" /> Card Number
                                    </p>
                                    <p className="text-gray-800 dark:text-white">{patient.billing.cardNumber}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                                        <FaCreditCard className="inline-block mr-2" /> Expiry Date
                                    </p>
                                    <p className="text-gray-800 dark:text-white">{patient.billing.expiryDate}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                                        <FaCreditCard className="inline-block mr-2" /> CVV
                                    </p>
                                    <p className="text-gray-800 dark:text-white">{patient.billing.cvv}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                                        <FaMoneyBillAlt className="inline-block mr-2" /> Billing Address
                                    </p>
                                    <p className="text-gray-800 dark:text-white">{patient.billing.billingAddress}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Profile Form */}
                    {isEditing && (
                        <div className="bg-white dark:bg-gray-800 mt-8 p-8 rounded-xl shadow-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                Edit Your Profile
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaUser className="inline-block mr-2" /> Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaEnvelope className="inline-block mr-2" /> Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaPhone className="inline-block mr-2" /> Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaCreditCard className="inline-block mr-2" /> Card Number
                                    </label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.billing.cardNumber}
                                        onChange={handleBillingChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaCreditCard className="inline-block mr-2" /> Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={formData.billing.expiryDate}
                                        onChange={handleBillingChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaCreditCard className="inline-block mr-2" /> CVV
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={formData.billing.cvv}
                                        onChange={handleBillingChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
                                        <FaMoneyBillAlt className="inline-block mr-2" /> Billing Address
                                    </label>
                                    <textarea
                                        name="billingAddress"
                                        value={formData.billing.billingAddress}
                                        onChange={handleBillingChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        rows="4"
                                    />
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="w-full bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center cursor-pointer"
                                >
                                    <FaSave size={20} className="mr-2" /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PatientProfile;