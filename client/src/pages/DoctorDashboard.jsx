import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctorByEmail } from "../redux/slice/doctorSlice";
import { BarChart, PlusCircle, UserCheck, Clock } from "lucide-react";
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // we access the state using useSelector
    // auth will hold the state from the authslice of redux store
    const auth = useSelector((state) => state.auth);
    // doctor, loading, error these variables are destructured from the state of the doctor slice
    const { data: doctor, loading, error } = useSelector((state) => state.doctor);

    const userType = localStorage.getItem('userType');

    useEffect(() => {
        // If the user is logged in but not a doctor, show the popup and redirect
        if (userType !== "doctor") {
            // Show the warning popup if user is not a doctor
            Swal.fire({
                icon: "warning",
                title: "Not Authorized",
                text: "You are not a doctor!",
                confirmButtonColor: "#38A169",
            }).then(() => {
                // After closing the alert, navigate to home
                navigate("/");
            });
        } else {
            // Fetch doctor data if the user is a doctor, this fetches the data from the doctorslice for a logged in user
            if (auth.user && !doctor) {
                dispatch(fetchDoctorByEmail(auth.user.email));
            }
        }
    }, [userType, auth.user, doctor, dispatch, navigate]);  // Adding navigate to the dependency array


    if (loading) return <p>Loading doctor data...</p>;
    if (error) return <p>Error: {error}</p>;


    const stats = [
        { title: "Today's Appointments", value: "5", icon: <Clock size={24} />, color: "bg-blue-100" },
        { title: "New Patients", value: "2", icon: <UserCheck size={24} />, color: "bg-green-100" },
        { title: "Prescriptions This Month", value: "23", icon: <PlusCircle size={24} />, color: "bg-blue-100" },
        { title: "Adherence Rate", value: "89%", icon: <BarChart size={24} />, color: "bg-green-100" },
    ];

    return (
        <>
            <Helmet>
                <title>Doctor Dashboard</title>
            </Helmet>
            <div className="flex min-h-screen bg-blue-50 dark:bg-gray-900 mt-22 overflow-x-hidden">
                <Sidebar />

                <main className="flex-1 p-6 transition-all duration-300 ml-10">
                    <div data-aos="fade-up" className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                Welcome Back, {doctor ? `Dr. ${doctor.username}` : "Doctor"}</h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Here's your daily overview and quick actions
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                    className={`${stat.color} dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className="text-blue-600 dark:text-blue-400 p-3 rounded-full bg-white dark:bg-gray-700">
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div
                                data-aos="fade-right"
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md"
                            >
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                    Quick Actions
                                </h2>
                                <div className="space-y-4">
                                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600" onClick={() => navigate('/create-prescription')}>
                                        <PlusCircle size={20} />
                                        <span>New Prescription</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-gray-600" onClick={() => navigate('/profile')}>
                                        <UserCheck size={20} />
                                        <span>My Profile</span>
                                    </button>
                                </div>
                            </div>

                            <div
                                data-aos="fade-left"
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md"
                            >
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                    Instructions
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Use Create Prescription for creating digital prescriptions and their QRcode</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>You can view all the prescriptions and also search them by patient's name</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>You can check all the patients you have dealt</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default DoctorDashboard;
