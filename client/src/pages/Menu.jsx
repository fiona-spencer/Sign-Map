import React, { useState } from 'react';
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { Button, Carousel } from 'flowbite-react';
import cityImage from '../assets/city_image.svg';
import CNTowerImage from '../assets/CNTower.jpg';
import nightImage from '../assets/night.jpg';
import romImage from '../assets/rom.jpg';
import trinityImage from '../assets/trinity.jpg';
import streetCarImage from '../assets/street_car.jpg';
import islandImage from '../assets/center_island.jpg';
import paiImage from '../assets/pai.jpg';


export default function Menu() {
  const [pins, setPins] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormStatus('Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      setFormStatus('There was an error sending your message. Please try again.');
    }
  };

  return (
    <div
      className="dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors relative flex flex-col"
      style={{
        backgroundImage: cityImage ? `url(${cityImage})` : 'none',
        backgroundAttachment: 'fixed',
        backgroundSize: '200%',
        backgroundPosition: '60% center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#949292b8',
      }}
    >

      {/* Hero Section with Carousel */}
      <div className="relative bg-[#483929] dark:bg-gray-800 shadow-lg fixed">
        <div className="max-w-7xl mx-auto px-4 py-8 ">
          <h1 className="text-5xl font-bold text-center text-[#c7b098] dark:text-green-300 mb-4 ">
            Create Your Map and Share
          </h1>
          <p className="text-lg text-center text-[#ddd6d0] dark:text-green-400 mb-6">
            Explore, filter, and share your pins.
          </p>
      </div>
  </div>

      <div className=''>
  <div className="p-9 bg-[#463b2fe7]">
  <div className="h-56 sm:h-64 xl:h-96 2xl:h-96 rounded-lg overflow-hidden max-w-[800px] lg:max-w-[1400px] shadow-md border mx-auto">
  <Carousel>
        <div className="flex h-full items-center justify-center bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200 text-xl font-medium">
        <img src={streetCarImage} alt="Toronto City" className="h-96 w-full object-cover" />
        </div>
        <div className="flex h-full items-center justify-center bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 text-xl font-medium">
        <img src={CNTowerImage} alt="Toronto City" className="h-96 w-full object-cover" />
        </div>
        <div className="flex h-full items-center justify-center bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100 text-xl font-medium">
        <img src={paiImage} alt="Toronto City" className="h-96 w-full object-cover" />
        </div>
        <div className="flex h-full items-center justify-center bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100 text-xl font-medium">
        <img src={islandImage} alt="Toronto City" className="h-96 w-full object-cover" />
        </div>
        <div className="flex h-full items-center justify-center bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100 text-xl font-medium">
        <img src={nightImage} alt="Toronto City" className="h-96 w-full object-cover" />
        </div>
        <div className="flex h-full items-center justify-center bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100 text-xl font-medium">
        <img src={romImage} alt="Toronto City" className="h-96 w-full object-cover" />
        </div>
        <div className="flex h-full items-center justify-center bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100 text-xl font-medium">
        <img src={trinityImage} alt="Toronto City" className="h-96 w-full object-cover" />
        </div>
      </Carousel>
    </div>
      </div>
  </div>


      {/* Timeline Section */}
      <div className="justify-center p-9 pb-0">
        <section className="relative bg-gradient-to-br from-yellow-300 to-[#ffdeaaf6] dark:from-purple-500 dark:to-orange-400 rounded-2xl shadow-xl p-8 mb-12 overflow-hidden max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-yellow-50 dark:text-green-300 mb-10 text-center tracking-tight">
            Recent Updates
          </h2>

          <div className="space-y-8">
            {/* Timeline Item 1 */}
            <div className="flex items-start space-x-4 opacity-0 animate-fadeInUp animation-delay-0">
              <div className="w-2.5 h-2.5 mt-1 rounded-full bg-green-500"></div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">Pin Submission Feature Updated</p>
                <p className="text-sm text-gray-600 dark:text-gray-200">March 15, 2025 — Users can now attach images to reports.</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex items-start space-x-4 opacity-0 animate-fadeInUp animation-delay-200">
              <div className="w-2.5 h-2.5 mt-1 rounded-full bg-green-500"></div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">New Admin Panel Released</p>
                <p className="text-sm text-gray-600 dark:text-gray-200">March 20, 2025 — Robust controls for map and pin management.</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex items-start space-x-4 opacity-0 animate-fadeInUp animation-delay-400">
              <div className="w-2.5 h-2.5 mt-1 rounded-full bg-green-500"></div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">Search & Filter Improvements</p>
                <p className="text-sm text-gray-600 dark:text-gray-200">April 5, 2025 — Enhanced filters for better experience.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      

      {/* Info Section  */}
      <div className=' bg-[#ddddddec] dark:bg-[#121212c1]'>
        <div className="max-w-5xl mx-auto px-10 py-10 space-y-10">

          {/* Submit Button */}
          <div className="flex justify-center items-center text-center">
            <Link to="/report">
              <Button
                color="blue"
                pill
                className="text-lg py-3 px-6 flex items-center group transition-all duration-300"
              >
                Create Your Custom Map
                <HiOutlineArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-5" />
              </Button>
            </Link>
          </div>

          {/* Login & Authentication */}
          <section className="bg-white shadow-lg z-20 dark:bg-gray-800 rounded-lg p-6 hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
            <h2 className="text-2xl font-semibold  text-green-800 dark:text-green-300 mb-2">Login & Authentication</h2>
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
                <Button color="blue" className="text-lg py-3 px-6">Sign In or Create Account</Button>
              </Link>
            </div>
          </section>

          {/* How to Pin */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
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
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 text-center mb-4">Search & Filter Pins</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Search by title, location, or department</li>
              <li>Filter by status: <em>pending</em>, <em>accepted</em>, <em>in-progress</em>, <em>resolved</em>, <em>deleted</em></li>
              <li>Click on map pins for detailed information</li>
            </ul>
          </section>

          {/* Datasheet Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-2">View All Pins in a Table</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Use the datasheet to explore all pins in a sortable format.
            </p>
            <Link to="/datasheet">
              <Button color="dark" className="text-lg py-3 px-6">View Datasheet</Button>
            </Link>
          </section>

        </div>
      </div>
{/* Contact Form */}
<div className="max-w-5xl p-10 bg-gradient-to-tr from-[#727171fa] via-green-00 to-green-500 rounded-2xl shadow-xl m-9 sm:mx-auto">
  <h2 className="text-3xl font-bold text-green-100 mb-4 text-center">Contact Us</h2>
  <p className="text-center text-green-200 mb-6">
    Have a question or need assistance? Feel free to reach out below.
  </p>

  <form onSubmit={handleFormSubmit} className="space-y-5">
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleFormChange}
        placeholder="Your Name"
        className="p-4 bg-green-100 text-black border border-green-600 w-full rounded-lg"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleFormChange}
        placeholder="Email"
        className="p-4 bg-green-100 text-black border border-green-600 w-full rounded-lg"
        required
      />
    </div>

    <input
      type="text"
      name="subject"
      value={formData.subject}
      onChange={handleFormChange}
      placeholder="Subject"
      className="p-4 bg-green-100 text-black border border-green-600 w-full rounded-lg"
      required
    />

    <textarea
      name="message"
      value={formData.message}
      onChange={handleFormChange}
      placeholder="Your Message"
      className="p-4 bg-green-100 text-black border border-green-600 w-full rounded-lg"
      rows="6"
      required
    />

    <div className="text-center">
      <Button
        type="submit"
        color="green" 
        className="text-green-800 text-lg w-full font-semibold bg-green-500 dark:bg-green-500 "
      >
        Send Message
      </Button>
    </div>
  </form>

  {formStatus && (
    <p className="mt-4 text-center text-green-100">{formStatus}</p>
  )}
</div>



    </div>
  );
}
