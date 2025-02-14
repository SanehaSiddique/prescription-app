import React from 'react';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <div className="bg-gray-100 min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center px-6 py-12">
        <div data-aos="fade-up" className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl mt-20 font-bold text-[#3B82F6] dark:text-blue-400">About Us</h1>
          <p className="mt-14 mb-10 text-lg text-gray-600 dark:text-gray-300">Welcome to our Medicare service. We provide comprehensive healthcare solutions for doctors and patients.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div data-aos="zoom-in-up" className="bg-blue-100 p-6 rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 ">Our Mission</h2>
            <p className="text-gray-600 mt-4 dark:text-gray-300">Our mission is to ensure that Medicare services are accessible to everyone with transparency and quality care.</p>
          </div>

          <div data-aos="zoom-in-up" className="bg-blue-100 p-6 rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">Our Vision</h2>
            <p className="text-gray-600 mt-4 dark:text-gray-300">We aim to be the leading provider of affordable and reliable Medicare services, promoting healthier lives.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
