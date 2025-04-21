import React, { useState, useEffect } from 'react';
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { Button, Carousel } from 'flowbite-react';

export default function Menu() {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await fetch('/api/pin/getPin');
        const data = await res.json();
        setPins(data.pins); // Assuming the response contains an array of pins in "pins"
      } catch (error) {
        console.error('Failed to fetch pins:', error);
      }
    };

    fetchPins();
  }, []);

  return (
    <div className="bg-[#949292b8] dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors">
      {/* Hero Section with Carousel */}
      <div className="relative bg-[#483929] dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold text-center text-[#c7b098] dark:text-green-300 mb-4">
            City of Toronto Pin Map
          </h1>
          <p className="text-lg text-center text-[#ddd6d0] dark:text-green-400 mb-6">
            Pin, explore, and stay informed about public reports in your neighborhood.
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <Carousel slide={true} pauseOnHover className="rounded-lg shadow-md overflow-hidden">
            <img src="https://source.unsplash.com/featured/?toronto,cityscape" alt="Toronto City" className="h-96 w-full object-cover" />
            <img src="https://source.unsplash.com/featured/?toronto,street" alt="Toronto Street" className="h-96 w-full object-cover" />
            <img src="https://source.unsplash.com/featured/?toronto,park" alt="Toronto Park" className="h-96 w-full object-cover" />
          </Carousel>
        </div>
      </div>

      {/* Section Container */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Login & Authentication */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-600 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-2">Login & Authentication</h2>
          <p className="mb-2">
            Log in using your <strong>name, email, password</strong>, or sign in with <strong>Google</strong>.
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 dark:text-gray-300">
            <li><strong>Public</strong>: Browse pins</li>
            <li><strong>User</strong>: Submit & track personal pins</li>
            <li><strong>Admin</strong>: Full pin/map control</li>
          </ul>
          <div className="mt-4">
            <Link to="/signin">
              <Button color="green">Sign In or Create Account</Button>
            </Link>
          </div>
        </section>

        {/* How to Pin */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-600 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 text-center mb-4">How to Submit a Pin</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Click on the map to place a pin and begin submission</li>
            <li>
              Or use the <Link to="/report" className="text-green-600 dark:text-green-400 font-medium hover:underline">Pin Page</Link>
            </li>
            <li>Fill in title, category, severity, description, and optionally upload an image</li>
            <li>Map pins auto-fill coordinates and address</li>
            <li>You must be logged in to submit a pin</li>
          </ul>
        </section>

        {/* Search & Filters */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-600 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 text-center mb-4">Search & Filter Pins</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Search by title, location, or department</li>
            <li>Filter by status: <em>pending</em>, <em>accepted</em>, <em>in-progress</em>, <em>resolved</em>, <em>deleted</em></li>
            <li>Click on map pins for detailed information</li>
          </ul>
        </section>

        {/* Datasheet Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-600 text-center hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-2">View All Pins in a Table</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Use the datasheet to explore all pins in a sortable format.
          </p>
          <Link to="/datasheet">
            <Button color="green">View Datasheet</Button>
          </Link>
        </section>

        {/* Submit Button */}
        <div className="text-center">
          <Link to="/report">
            <Button color="green" pill>
              Submit a Pin <HiOutlineArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Additional Carousel Component */}
      <div className="max-w-5xl mx-auto my-12 p-10">
        <Component />
      </div>
    </div>
  );
}

// Extra Carousel Component (Mini)
export function Component() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 rounded-lg overflow-hidden shadow-md border border-green-200 dark:border-green-600">
      <Carousel onSlideChange={(index) => console.log("onSlideChange()", index)}>
        <div className="flex h-full items-center justify-center bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200 text-xl font-medium">
          Slide 1
        </div>
        <div className="flex h-full items-center justify-center bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 text-xl font-medium">
          Slide 2
        </div>
        <div className="flex h-full items-center justify-center bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100 text-xl font-medium">
          Slide 3
        </div>
      </Carousel>
    </div>
  );
}
