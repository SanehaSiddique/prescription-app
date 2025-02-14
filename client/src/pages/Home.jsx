import React from "react";
import { FiClock, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-gray-100 min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center px-6 py-12">

            {/* Hero Section */}
            <div className="text-center max-w-3xl">
                <h1 data-aos="fade-up" className="text-5xl mt-20 font-bold text-[#3B82F6] dark:text-blue-400">
                    Welcome to MediCare
                </h1>
                <p data-aos="fade-up" data-aos-delay="300" className="mt-14 mb-8 text-lg text-gray-600 dark:text-gray-300">
                    A seamless platform connecting <span className="font-bold">doctors</span> and <span className="font-bold">patients</span> for easy appointment scheduling, medical records management, and better healthcare services.
                </p>
            </div>

            {/* Features Section */}
            <div data-aos="fade-up" data-aos-delay="500" className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-center w-full max-w-4xl">
                
                {/* Doctors Section */}
                <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-4 border-blue-500">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 dark:bg-blue-700 rounded-full">
                            <FiClock className="w-10 h-10 text-blue-600 dark:text-white" />
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-blue-600 dark:text-blue-400">
                            For Doctors
                        </h2>
                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                            Manage appointments, track patient history, and provide better care with our digital tools.
                        </p>

                        {/* Get Started Button */}
                        
                            <button className="mt-5 px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800" onClick={() => navigate("/signup?userType=doctor")}>
                                Get Started as Doctor
                            </button>
                        
                    </div>
                </div>

                {/* Patients Section */}
                <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-4 border-green-500">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-green-100 dark:bg-green-700 rounded-full">
                            <FiUser className="w-10 h-10 text-green-600 dark:text-white" />
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-green-600 dark:text-green-400">
                            For Patients
                        </h2>
                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                            Book appointments, access medical records, and connect with doctors effortlessly.
                        </p>

                        {/* Get Started Button */}
                        
                            <button className="mt-5 px-6 py-3 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800" onClick={() => navigate("/signup?userType=patient")}>
                                Get Started as Patient
                            </button>
                        
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;
