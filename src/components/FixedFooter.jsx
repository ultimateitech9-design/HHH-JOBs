import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 px-6 md:px-16 py-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <img
              src="/hhh-job-logo.png"
              alt="HHH Job Logo"
              className="w-12 h-12 object-contain"
            />

            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-blue bg-clip-text">
              HHH Job
            </h2>
          </div>

          <p className="mt-6 font-semibold text-gray-700">Connect with us</p>

          <div className="flex gap-4 mt-4 text-gray-600 text-lg">
            <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            <FaInstagram className="cursor-pointer hover:text-pink-500" />
            <FaXTwitter className="cursor-pointer hover:text-black" />
            <FaLinkedinIn className="cursor-pointer hover:text-blue-700" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-12 space-y-6 md:space-y-0">
          <div>
            <ul className="flex flex-col space-y-3">
              <li><Link to="/about" className="hover:text-blue-600">About us</Link></li>
              <li><Link to="/careers" className="hover:text-blue-600">Careers</Link></li>
              <li><Link to="/employer" className="hover:text-blue-600">Employer home</Link></li>
              <li><Link to="/sitemap" className="hover:text-blue-600">Sitemap</Link></li>
              <li><Link to="/credits" className="hover:text-blue-600">Credits</Link></li>
            </ul>
          </div>

          <div>
            <ul className="flex flex-col space-y-3">
              <li><Link to="/help" className="hover:text-blue-600">Help center</Link></li>
              <li><Link to="/summons" className="hover:text-blue-600">Summons/Notices</Link></li>
              <li><Link to="/grievances" className="hover:text-blue-600">Grievances</Link></li>
              <li><Link to="/report-issue" className="hover:text-blue-600">Report issue</Link></li>
            </ul>
          </div>

          <div>
            <ul className="flex flex-col space-y-3">
              <li><Link to="/privacy" className="hover:text-blue-600">Privacy policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600">Terms & conditions</Link></li>
              <li><Link to="/fraud" className="hover:text-blue-600">Fraud alert</Link></li>
              <li><Link to="/trust" className="hover:text-blue-600">Trust & safety</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Apply on the go</h3>
          <p className="text-sm text-gray-500 mt-2">Get real-time job updates on our App</p>

          <div className="flex gap-3 mt-5">
            <a
              href="https://play.google.com/store/apps?hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
              Google Play
            </a>

            <a
              href="https://www.apple.com/in/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
            >
              App Store
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
