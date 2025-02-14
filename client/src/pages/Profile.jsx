import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import API from "../../../axiosInstance";
import Swal from 'sweetalert2';
import { FaEdit, FaSave, FaPlusCircle } from "react-icons/fa";
import { Helmet } from 'react-helmet';

const Profile = () => {
    const [doctor, setDoctor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        hospital: "",
        contactNumber: "",
        bio: "",
    });
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
            fetchDoctorInfo();
        }
    }, [userType, navigate]);

    const fetchDoctorInfo = async () => {
        setIsLoading(true);
        try {
            const response = await API.get(`/profile?email=${doctorEmail}`);
            if (response.data) {
                setDoctor(response.data);
                setFormData(response.data); // Initialize form data with fetched data
            } else {
                setIsCreating(true); // No profile exists, show create profile form
            }
        } catch (error) {
            console.error("Error fetching doctor information:", error);

            // Check if the error is due to the doctor not being found
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
                        setIsCreating(true); // Show the form to create a new profile
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch doctor information. Please try again later.",
                    confirmButtonColor: "#38A169",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProfile = async () => {
        try {
            const response = await API.post('/profile', { ...formData, email: doctorEmail });
            setDoctor(response.data);
            setIsCreating(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Profile created successfully!",
                confirmButtonColor: "#38A169",
            });
        } catch (error) {
            console.error("Error creating doctor profile:", error);
            if (error.response) {
                console.error("Error response:", error.response.data);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response.data.message || "Failed to create profile. Please try again later.",
                    confirmButtonColor: "#38A169",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred. Please try again later.",
                    confirmButtonColor: "#38A169",
                });
            }
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await API.put(`/profile?email=${doctorEmail}`, formData);
            setDoctor(response.data);
            setIsEditing(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Profile updated successfully!",
                confirmButtonColor: "#38A169",
            });
        } catch (error) {
            console.error("Error updating doctor information:", error);
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
            <Sidebar />

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
                    <div className="bg-white dark:bg-gray-800 mt-8 p-8 rounded-xl shadow-lg max-w-2xl mx-auto" data-aos="fade-up"
                    data-aos-delay="100">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Create Your Profile
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Please fill in the details below to create your profile.
                        </p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Hospital</label>
                                <input
                                    type="text"
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
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

                {/* Doctor's Information */}
                {doctor && !isEditing && !isCreating && (
                    <div className="bg-white dark:bg-gray-800 mt-8 p-8 rounded-xl shadow-lg max-w-2xl mx-auto relative" data-aos="fade-up"
                    data-aos-delay="100">
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
                                <p className="text-gray-600 dark:text-gray-300 font-semibold">Name</p>
                                <p className="text-gray-800 dark:text-white">{doctor.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 font-semibold">Specialization</p>
                                <p className="text-gray-800 dark:text-white">{doctor.specialization}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 font-semibold">Hospital</p>
                                <p className="text-gray-800 dark:text-white">{doctor.hospital}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 font-semibold">Contact Number</p>
                                <p className="text-gray-800 dark:text-white">{doctor.contactNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 font-semibold">Bio</p>
                                <p className="text-gray-800 dark:text-white">{doctor.bio}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Profile Form */}
                {isEditing && (
                    <div className="bg-white dark:bg-gray-800 mt-8 p-8 rounded-xl shadow-lg max-w-2xl mx-auto" data-aos="fade-up"
                    data-aos-delay="100">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            Edit Your Profile
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Hospital</label>
                                <input
                                    type="text"
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    rows="4"
                                />
                            </div>
                            <button
                                onClick={handleSave}
                                className="w-full bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
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

export default Profile;