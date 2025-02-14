import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Your message has been sent!');
  };

  return (
    <>
      <Helmet>
        <title>Contact Us</title>
      </Helmet>
      <div className=" dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-12 flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div data-aos="fade-up" className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl mt-20 font-bold text-[#3B82F6] dark:text-blue-400">Contact Us</h1>
          <p className="mt-10 mb-4 text-lg text-gray-600 dark:text-gray-300">We are here to assist you. Please send us a message, and we'll get back to you.</p>
        </div>

        <div data-aos="fade-up" className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none dark:border-gray-500 dark:bg-gray-800"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none dark:border-gray-500 dark:bg-gray-800"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none dark:border-gray-500 dark:bg-gray-800"
                rows="4"
                required
              />
            </div>

            <button type="submit" className="w-full bg-green-400 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all cursor-pointer">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
