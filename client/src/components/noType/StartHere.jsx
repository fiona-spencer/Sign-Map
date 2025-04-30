import React, { useState, useEffect } from 'react';
import FeatureGrid from '../FeatureGrid';
import {
  Button,
  Card
} from "flowbite-react";
import { HiOutlineArrowRight} from 'react-icons/hi';

export default function StartHere() {
  const [hovered, setHovered] = useState(false);

  // Dark Mode Handler
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage or system preference for dark mode on page load
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  return (
    <div className="grid items-center justify-center p-6 mt-10">
      <h1 className="text-3xl font-semibold text-center mb-4">Welcome! Please Sign In or Create an Account</h1>
      <div className="flex justify-center mb-10">
          <Button
            color="green"
            pill
            type="submit"
            className=" py-2 px-24 flex items-center group transition-all duration-300"
          >
            Go Back to Home
            <HiOutlineArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Button>
        </div> 

      {/* Account Card Wrapper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center lg:px-40 px-10">
        {/* User Plan */}
        <div className="w-full">
          <Card className="max-w-sm h-full flex flex-col justify-between shadow-lg z-20 dark:bg-gray-800 rounded-lg p-6 hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">User Plan</h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">$</span>
              <span className="text-5xl font-extrabold tracking-tight">19</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <h2 className="italic text-sm">*free trial period</h2>
            <ul className="my-7 space-y-5">
            <CheckItem label="Edit and save profile" />
            <CheckItem label="Search entire dataset" />
              <CheckItem label="Preview and upload datasets" />
              <CheckItem label="Send data to map" />
              <CheckItem label="Convert address to geolocation" />
              <CheckItem label="Create reports on map" />
              <CheckItem label="Dynamically search and filter map results" />
              <CheckItem label="Download filtered data" />
              <CheckItem label="Analyze clustered pins" />
              <CheckItem label="Download PDF of clustered map" />
              <CheckItem label="Manage user and pin database (edit, delete, or send emails)" strike />
              <CheckItem label="Inbox acceptance to change the status of pins" strike />
            </ul>
            <Button href="/signup" color="dark" pill className="inline-flex w-full justify-center text-white">
              Choose User Plan
            </Button>
          </Card>
        </div>

        {/* Admin Plan */}
        <div className="w-full">
          <Card className="max-w-sm h-full flex flex-col justify-between shadow-lg z-20 dark:bg-gray-800 rounded-lg p-6 hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Admin Plan</h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">$</span>
              <span className="text-5xl font-extrabold tracking-tight">0</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <h2 className="italic text-sm">*Administrator credentials required</h2>
            <ul className="my-7 space-y-5">
              <CheckItem label="Edit and save profile" />
              <CheckItem label="Search entire dataset" />
              <CheckItem label="Preview and upload datasets" />
              <CheckItem label="Send data to map" />
              <CheckItem label="Convert address to geolocation" />
              <CheckItem label="Create reports on map" />
              <CheckItem label="Dynamically search and filter map results" />
              <CheckItem label="Download filtered data" />
              <CheckItem label="Analyze clustered pins" />
              <CheckItem label="Download PDF of clustered map" />
              <CheckItem label="Manage user and pin database (edit, delete, or send emails)" />
              <CheckItem label="Inbox acceptance to change the status of pins" />
            </ul>
            <Button color="dark" pill className="inline-flex w-full justify-center text-white">
              Choose Admin Plan
            </Button>
          </Card>
        </div>
      </div>

      <FeatureGrid />
    </div>
  );
}

// ✅ Reusable Components
function CheckIcon({ className = "text-cyan-600 dark:text-cyan-500" }) {
  return (
    <svg className={`h-5 w-5 shrink-0 ${className}`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
    </svg>
  );
}

function CheckItem({ label, strike = false }) {
  return (
    <li className={`flex space-x-3 ${strike ? "line-through decoration-gray-500" : ""}`}>
      <CheckIcon className={strike ? "text-gray-400 dark:text-gray-500" : "text-cyan-600 dark:text-cyan-500"} />
      <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">{label}</span>
    </li>
  );
}
