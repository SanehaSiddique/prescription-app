import React from "react";
import { useNavigate } from "react-router-dom";

const GuestModePage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col mt-22 dark:bg-gray-900 dark:text-gray-50 items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Video Section */}
            <div className="w-full max-w-3xl mb-6">
                <h1 className="text-2xl font-semibold mb-4 text-center">Watch How the App Works</h1>
                <div className="rounded-lg overflow-hidden shadow-lg" style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe
                        src="https://player.vimeo.com/video/1056870752?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        title="prescription-app"
                    ></iframe>
                </div>
            </div>

            {/* Login Section */}
            <div data-aos="fade-up" data-aos-delay="500" className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-center w-full max-w-4xl">

                {/* Doctors Section */}
                <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-4 border-blue-500">
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                            For Doctors
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Use this dummy login to experience the features
                        </p>
                        <div className="space-y-0">
                            <div className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span><strong>Email: </strong>doctor@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span><strong>Password: </strong>demo1234</span>
                            </div>
                        </div>
                        <button className="mt-5 px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800" onClick={() => navigate("/login")}>Get Started as Doctor</button>
                    </div>
                </div>

                {/* Patients Section */}
                <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-4 border-green-500">
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                            For Patients
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Use this dummy login to experience the features
                        </p>
                        <div className="space-y-0">
                            <div className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span><strong>Email: </strong>patient@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span><strong>Password: </strong>demo1234</span>
                            </div>
                        </div>
                        <button className="mt-5 px-6 py-3 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800" onClick={() => navigate("/login")}>Get Started as Patient</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestModePage;