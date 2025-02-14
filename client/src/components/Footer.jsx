import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 dark:bg-gray-800">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    
                    {/* Logo & Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-blue-400">MediCare</h2>
                        <p className="mt-2 text-gray-400">
                            Your trusted healthcare platform for seamless doctor-patient connections.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold text-blue-300">Quick Links</h3>
                        <ul className="mt-3 space-y-2">
                            <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                            <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
                            <li><Link to="/help" className="hover:text-blue-400">Help</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <h3 className="text-xl font-semibold text-blue-300">Follow Us</h3>
                        <div className="mt-3 flex justify-center md:justify-start space-x-4">
                            <a href="#" className="hover:text-blue-400"><FiFacebook size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FiTwitter size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FiInstagram size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FiLinkedin size={24} /></a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} MediCare. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
