import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../axiosInstance"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [userType, setUserType] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    
    const notify = () => toast.success("Signup Successful!", { position: "bottom-left", autoClose: 3000 });


    // Extract userType from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get("userType");
        if (type === "doctor" || type === "patient") {
            setUserType(type);
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword || !username) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            console.log("Sending request to backend...");

            const response = await API.post(`/signup?userType=${userType}`, {
                username,
                email,
                password,
                userType
            }, {
                headers: { "Content-Type": "application/json" }
            });

            const { token } = response.data;
            localStorage.setItem("token", token);

            console.log("Response received:", response);

            if (response.status === 201) {
                notify(); // Show toast notification

                // Delay navigation slightly to allow toast to appear
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
            }
        } catch (err) {
            console.error("Error during signup:", err);
            setError(err.response?.data?.message || "Signup failed. Try again.");
        }
    };

    return (
        <>
        <Helmet>
            <title>Signup</title>
        </Helmet>
        <div className="flex w-full min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg mt-20">
                {/* Left Section */}
                <div
                    data-aos="fade-right"
                    className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 text-white dark:from-blue-700 dark:to-blue-900 p-6 sm:p-8"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Welcome!</h2>
                    <p className="mb-6">Already registered?</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
                    >
                        Login
                    </button>
                </div>

                {/* Right Section (Signup Form) */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 mb-6">Sign Up</h2>
                    {/* Show User Type */}
                    {userType && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Signing up as: <span className="font-bold capitalize">{userType}</span>
                        </p>
                    )}
                    {/* User Type Selection */}
                    {!userType && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Select User Type:</p>
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    value="doctor"
                                    checked={userType === "doctor"}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="mr-1"
                                />
                                Doctor
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="patient"
                                    checked={userType === "patient"}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="mr-1"
                                />
                                Patient
                            </label>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="w-full">
                        {/* Username Input */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="peer block w-full p-3 text-black border-2 dark:focus:border-blue-300 border-blue-400 rounded-lg bg-transparent focus:outline-none focus:border-blue-600 focus:border-2 pt-4 dark:text-gray-100 transition-all duration-300 ease-in-out"
                                required
                            />
                            <label
                                className={`absolute left-3 transition-all duration-300 ease-in-out text-blue-400 bg-transparent px-1 ${username || "peer-focus:text-blue-600 peer-focus:top-1 peer-focus:text-xs dark:peer-focus:text-blue-300"
                                    } ${username ? "top-1 text-xs" : "top-3 text-[16px]"}`}
                            >
                                Username
                            </label>
                        </div>

                        {/* Email Input */}
                        <div className="relative mb-6">
                            <input
                                type="email"
                                name="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer block w-full p-3 text-black border-2 dark:focus:border-blue-300 border-blue-400 rounded-lg bg-transparent focus:outline-none focus:border-blue-600 focus:border-2 pt-4 dark:text-gray-100 transition-all duration-300 ease-in-out"
                                required
                            />
                            <label
                                className={`absolute left-3 transition-all duration-300 ease-in-out text-blue-400 bg-transparent px-1 ${email || "peer-focus:text-blue-600 peer-focus:top-1 peer-focus:text-xs dark:peer-focus:text-blue-300"
                                    } ${email ? "top-1 text-xs" : "top-3 text-[16px]"}`}
                            >
                                Email
                            </label>
                        </div>

                        {/* Password Input */}
                        <div className="relative mb-6">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer block w-full p-3 text-gray-800 border-2 border-blue-400 rounded-lg bg-transparent focus:outline-none focus:border-blue-600 dark:focus:border-blue-300 pt-4 dark:text-gray-100 focus:border-2 transition-all"
                                required
                            />
                            <label
                                className={`absolute left-3 transition-all duration-300 ease-in-out text-blue-400 bg-transparent px-1 ${password || "peer-focus:text-blue-600 peer-focus:top-1 peer-focus:text-xs dark:peer-focus:text-blue-300"
                                    } ${password ? "top-1 text-xs" : "top-3 text-[16px]"}`}
                            >
                                Password
                            </label>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative mb-6">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="peer block w-full p-3 text-gray-800 border-2 border-blue-400 rounded-lg bg-transparent focus:outline-none focus:border-blue-600 dark:text-gray-100 pt-4 dark:focus:border-blue-300 focus:border-2 transition-all"
                                required
                            />
                            <label
                                className={`absolute left-3 transition-all duration-300 ease-in-out text-blue-400 bg-transparent px-1 ${confirmPassword || "peer-focus:text-blue-600 peer-focus:top-1 peer-focus:text-xs dark:peer-focus:text-blue-300"
                                    } ${confirmPassword ? "top-1 text-xs" : "top-3 text-[16px]"}`}
                            >
                                Confirm Password
                            </label>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-700 transition dark:from-blue-700 dark:to-blue-900"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
            {/* Toast Notification Container */}
            <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
        </div>
        </>
    );
};

export default Signup;
