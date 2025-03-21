import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ClipboardList, FilePlus, Users, Calendar, Settings, LogOut, Menu, PanelLeftClose, Scan, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/auth/authSlice"; // Import the logout action
import Swal from 'sweetalert2';

const Sidebar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Check if screen is mobile initially

    const dispatch = useDispatch(); // Get the dispatch function from Redux
    const navigate = useNavigate(); // Get the navigate function from react-router-dom
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Fetch isLoggedIn state from authSlice

    // Function to toggle the sidebar menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Update isMobile state on window resize
    useEffect(() => {
        const handleResize = () => {
            const isMobileSize = window.innerWidth < 768;
            setIsMobile(isMobileSize);

            // Close sidebar on resize if screen is larger than mobile
            if (!isMobileSize) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Logout function
    const handleLogout = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Logout",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#E53E3E",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire({
                    title: "Logged out!",
                    text: "You have been logged out.",
                    icon: "success",
                    confirmButtonColor: "#38A169",
                });
                dispatch(logout()); // Dispatch the logout action
                localStorage.removeItem("token"); // Clear token from localStorage
                localStorage.removeItem("isLoggedIn"); // Clear login status from localStorage
                localStorage.removeItem("userEmail"); // Clear user email from localStorage
                navigate("/login"); // Redirect to the login page
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    icon: "error",
                    confirmButtonColor: "#38A169",
                });
            }
        });

    };


    return (
        <div className="relative min-h-screen flex">
            {/* Sidebar Toggle Button for Mobile */}
            {isMobile && (
                <button
                    onClick={toggleMenu}
                    className="fixed left-2 top-32 transform -translate-y-1/2 p-3 w-12 h-12 flex items-center justify-center text-gray-600 rounded-full bg-white shadow-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all"
                    aria-expanded={isMenuOpen}
                >
                    <PanelLeftClose className="w-6 h-6" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`absolute top-0 left-0 z-40 w-64 h-full drop-shadow-lg dark:drop-shadow-2xl bg-gray-50 dark:bg-gray-900 transform transition-transform duration-300 ease-in-out 
                ${isMenuOpen || !isMobile ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0`}
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to="/patient-dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                                <Home size={20} />
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/scan-prescription" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                                <Scan size={20} />
                                <span className="ms-3">Scan Prescription</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/patient-prescription" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                                <ClipboardList size={20} />
                                <span className="ms-3">View Prescriptions</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/reminders" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                                <Bell size={20} />
                                <span className="ms-3">Reminders</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/patient-profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                                <Calendar size={20} />
                                <span className="ms-3">My Profile</span>
                            </Link>
                        </li>
                    </ul>

                    {/* Logout Button */}
                    <div className="absolute left-0 w-full px-3">
                        <button className="flex w-full items-center p-2 text-red-600 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-950" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span className="ms-3">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for Mobile */}
            {isMenuOpen && isMobile && (
                <div className="fixed inset-0 z-30 bg-white bg-opacity-50 dark:bg-black sm:hidden" onClick={toggleMenu}></div>
            )}
        </div>
    );
};

export default Sidebar;