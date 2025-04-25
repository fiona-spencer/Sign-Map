import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { Button, Carousel } from 'flowbite-react';
import cityImage from '../assets/city_image_small.png';
import CNTowerImage from '../assets/CNTower.jpg';
import nightImage from '../assets/night.jpg';
import trinityImage from '../assets/trinity.jpg';
import islandImage from '../assets/toronto_island.jpg';
import paiImage from '../assets/pai.jpg';
import ContactForm from '../components/contactForm'
import MapCards from '../components/MapCards';
import FileCards from '../components/FileCards';


export default function Menu() {
  const [pins, setPins] = useState([]);
  const [hovered, setHovered] = useState(false);
  const { currentUser } = useSelector((state) => state.user);


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
  <div className="max-w-7xl mx-auto px-10 py-10 space-y-10">

    {/* Submit Button */}
    <div className="flex justify-center items-center text-center">
      <Link to="/report">
        <Button
          color="dark"
          pill
          className="text-lg py-3 px-6 flex items-center group transition-all duration-300"
        >
          Create Your Custom Map
          <HiOutlineArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-100 group-hover:translate-x-5" />
        </Button>
      </Link>
    </div>



{/* Login and Authentication */}
<section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
      <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-2">View All Pins in a Table</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Use the datasheet to explore all pins in a sortable format.
      </p>
      <Link to="/datasheet">
        <Button color="dark" className="text-lg py-3 px-6">View Datasheet</Button>
      </Link>
    </section>

    {/* Info cards */}

    <div>
      <a href="/report" className="group flex justify-center items-center pt-4  p-3">
        <p className="text-5xl font-bold group-hover:bg-[#acdfcbad] group-hover:text-[#1d865cad]  rounded-lg px-8 py-3">File Upload</p>
        <HiOutlineArrowRight className="ml-2 h-10 w-10 transform transition-transform duration-300 group-hover:translate-x-3 group-hover:text-green-500" />
      </a>
      <FileCards />

      <a href="/report" className="group flex justify-center items-center pt-4  p-3">
        <p className="text-5xl font-bold group-hover:bg-[#acdfcbad] group-hover:text-[#1d865cad]  rounded-lg px-8 py-3">Explore the Map</p>
        <HiOutlineArrowRight className="ml-2 h-10 w-10 transform transition-transform duration-300 group-hover:translate-x-3 group-hover:text-green-500" />
      </a>
      <MapCards />
    </div>
    

    {/* Start Here */}
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
      <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-2">View All Pins in a Table</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Use the datasheet to explore all pins in a sortable format.
      </p>
      <Link to="/moreInfo">
        <Button color="dark" className="text-lg py-3 px-6">View Datasheet</Button>
      </Link>
    </section>

  </div>
</div>



<div className='items-center justify-center flex'>
{/* Contact Form */}
<ContactForm/>
</div>





    </div>
  );
}
