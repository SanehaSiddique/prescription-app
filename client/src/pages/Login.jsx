import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice/auth/authSlice"; // Import the login action
import { fetchDoctorByEmail } from "../redux/slice/doctorSlice"; // import thunk
import { fetchPatientByEmail } from "../redux/slice/patientSlice"; // import thunk
import API from "../../axiosInstance"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State for forgot password view
    const [isResettingPassword, setIsResettingPassword] = useState(false); // State for reset password view
    const [newPassword, setNewPassword] = useState(""); // State for new password
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Get the dispatch function from Redux

    const notify = () => toast.success("Login Successful!", { position: "bottom-left", autoClose: 3000 });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in both fields.");
            return;
        }
        setError("");

        try {
            const response = await API.post("/login", {
                email,
                password,
            });

            const { token, user } = response.data; // Assuming the response contains token and user data

            // Store token securely
            localStorage.setItem("token", token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userType", user.userType); // Save role (doctor/patient)

            // Dispatch the login action with user data
            // login wale component se actions dispatch hon gy redux store tk takay wahan ja k state update ho sky
            // { email, token, user } ye aik object ha iski jagah hm pora ka pora response bhi send kr skte thy 
            dispatch(login({ email, token, user }));
            // Also dispatch fetchDoctorByEmail
            // login se email le k doctor data fetch kren gy jiske liye hmy login se dispatch call krna pra
            if (user.userType === "doctor") {
                dispatch(fetchDoctorByEmail(email))
                    .unwrap()
                    .then((data) => {
                        console.log("Doctor data fetched:", data);
                    })
                    .catch((error) => {
                        console.error("Failed to fetch doctor data:", error);
                    });
            }
            else {
                dispatch(fetchPatientByEmail(email))
                    .unwrap()
                    .then((data) => {
                        console.log("Patient data fetched:", data);
                    })
                    .catch((error) => {
                        console.error("Failed to fetch patient data:", error);
                    });
            }
            if (response.status === 200) {
                notify(); // Show toast notification

                // Delay navigation slightly to allow toast to appear
                setTimeout(() => {
                    if (user.userType === "doctor") {
                        navigate("/doctor-dashboard");
                    } else {
                        navigate("/patient-dashboard"); // Redirect patients elsewhere
                    }
                }, 2500);
            }
            console.log(localStorage.getItem("token"));
        } catch (error) {
            setError(error.response?.data?.message || "Login failed.");
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email!", { position: "bottom-left" });
            return;
        }

        try {
            const response = await API.post("/verify-email", { email });

            if (response.status === 200) {
                toast.success("Email verified! Please reset your password.", { position: "bottom-left" });
                setIsResettingPassword(true); // Switch to reset password UI
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to verify email.");
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword) {
            toast.error("Please enter a new password!", { position: "bottom-left" });
            return;
        }

        try {
            const response = await API.post("/reset-password", {
                email,
                newPassword,
            });

            if (response.status === 200) {
                toast.success("Password reset successfully!", { position: "bottom-left" });
                setIsResettingPassword(false); // Switch back to login form
                setIsForgotPassword(false); // Switch back to login form
                setNewPassword(""); // Clear the new password field
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="flex w-full min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg mt-20">

                    {/* Right Section (Login Form) */}
                    <div className="w-full lg:w-1/2 p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 mb-6">
                            {isForgotPassword ? (isResettingPassword ? "Reset Password" : "Forgot Password") : "Log In"}
                        </h2>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        {/* Show Forgot Password Button */}
                        {!isForgotPassword ? (
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="relative mb-6">
                                    <input
                                        type="email"
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

                                <div className="relative mb-6">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="peer block w-full p-3 text-gray-800 border-2 border-blue-400 rounded-lg bg-transparent focus:outline-none focus:border-blue-600 dark:text-gray-100 pt-4 dark:focus:border-blue-300 focus:border-2 transition-all"
                                        required
                                    />
                                    <label
                                        className={`absolute left-3 transition-all duration-300 ease-in-out text-blue-400 bg-transparent px-1 ${password || "peer-focus:text-blue-600 peer-focus:top-1 peer-focus:text-xs dark:peer-focus:text-blue-300"
                                            } ${password ? "top-1 text-xs" : "top-3 text-[16px]"}`}
                                    >
                                        Password
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-700 transition dark:from-blue-700 dark:to-blue-900"
                                >
                                    Log In
                                </button>
                            </form>
                        ) : isResettingPassword ? (
                            <div className="w-full">
                                <p className="text-gray-800 dark:text-gray-50 mb-4">Please enter your new password.</p>
                                <div className="relative mb-6">
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="peer block w-full p-3 text-gray-800 border-2 border-blue-400 rounded-lg bg-transparent focus:outline-none focus:border-blue-600 dark:text-gray-100 pt-4 dark:focus:border-blue-300 focus:border-2 transition-all"
                                        required
                                    />
                                    <label
                                        className={`absolute left-3 transition-all duration-300 ease-in-out text-blue-400 bg-transparent px-1 ${newPassword || "peer-focus:text-blue-600 peer-focus:top-1 peer-focus:text-xs dark:peer-focus:text-blue-300"
                                            } ${newPassword ? "top-1 text-xs" : "top-3 text-[16px]"}`}
                                    >
                                        New Password
                                    </label>
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-700 transition dark:from-blue-700 dark:to-blue-900"
                                >
                                    Reset Password
                                </button>
                            </div>
                        ) : (
                            <div className="w-full">
                                <p className="text-gray-800 dark:text-gray-50 mb-4">Please enter your email address to reset your password.</p>
                                <div className="relative mb-6">
                                    <input
                                        type="email"
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

                                <button
                                    onClick={handleForgotPassword}
                                    className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-700 transition dark:from-blue-700 dark:to-blue-900"
                                >
                                    Verify Email
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setIsForgotPassword(!isForgotPassword);
                                setIsResettingPassword(false); // Reset the reset password state
                            }}
                            className="text-sm text-blue-500 hover:underline mt-4"
                        >
                            {isForgotPassword ? "Back to Login" : "Forgot Password?"}
                        </button>
                    </div>

                    {/* Left Section */}
                    <div
                        data-aos="fade-left"
                        className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 text-white dark:from-blue-700 dark:to-blue-900 p-6 sm:p-8"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Welcome Back!</h2>
                        <p className="mb-6">Not registered yet?</p>
                        <button
                            onClick={() => navigate("/signup")}
                            className="px-6 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
                {/* Toast Notification Container */}
                <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
            </div >
        </>
    );
};

export default Login;