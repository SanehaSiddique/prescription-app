import React, { useState } from 'react';
import { Helmet } from "react-helmet";

const Help = () => {
  const [isMedicareOpen, setIsMedicareOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Help</title>
      </Helmet>
      <div className="bg-gray-100 min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center px-4 py-12 overflow-x-hidden">
        <div data-aos="fade-left" className="text-center w-full max-w-4xl">
          <h1 className="text-4xl md:text-5xl mt-10 md:mt-20 font-bold text-green-600 dark:text-green-300">
            Help Center
          </h1>
          <p className="text-lg text-gray-700 mt-8 md:mt-14 mb-8 dark:text-gray-300">
            Find answers to your questions or contact us for further assistance.
          </p>
        </div>

        <div className="space-y-8 w-full max-w-4xl px-4">
          {/* How to Use the App Dropdown */}
          <div data-aos="fade-right" className="bg-green-100 p-6 rounded-lg shadow-lg dark:bg-gray-800">
            <button
              onClick={() => setIsMedicareOpen(!isMedicareOpen)}
              className="w-full text-left focus:outline-none flex justify-between items-center"
            >
              <h2 className="text-2xl font-semibold text-green-600 dark:text-green-300">
                How to Use the App
              </h2>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ease-in-out ${isMedicareOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-700 ease ${isMedicareOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-gray-600 mt-4 dark:text-gray-300">
                1. Sign up and create an account.
                <br />
                2. Log in to access your dashboard.
                <br />
                3. Explore features and navigate through different sections.
                <br />
                4. For doctor and patient different features are available.
                <br />
                5. Contact support for any queries.
              </p>
            </div>
          </div>

          {/* FAQs Dropdown */}
          <div data-aos="fade-left" className="bg-green-100 p-6 rounded-lg shadow-lg dark:bg-gray-800">
            <button
              onClick={() => setIsFaqOpen(!isFaqOpen)}
              className="w-full text-left focus:outline-none flex justify-between items-center"
            >
              <h2 className="text-2xl font-semibold text-green-600 dark:text-green-300">FAQs</h2>
              <svg
                className={`w-6 h-6 transform transition-transform duration-700 ease-in-out ${isFaqOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-700 ease ${isFaqOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-gray-600 mt-4 dark:text-gray-300">
                <strong>Q: How do I reset my password?</strong>
                <br />
                A: Click on 'Forgot Password' on the login page and follow the instructions.
                <br /><br />
                <strong>Q: How can I contact support?</strong>
                <br />
                A: You can reach us via the contact form on the Help Center page.
                <br /><br />
                <strong>Q: Is my data secure?</strong>
                <br />
                A: Yes, we use encryption and security measures to protect user data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;