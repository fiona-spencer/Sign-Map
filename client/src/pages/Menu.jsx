import React, { useState } from 'react';
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { Button, Carousel } from 'flowbite-react';
import cityImage from '../assets/city_image.svg';
import slide_1_image from '../assets/toronto_map.jpg';

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
      // Assuming you're using a backend or email service like EmailJS to handle this.
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
    backgroundSize: '200%', // Increased zoom level
    backgroundPosition: '60% center', // still positioned slightly right
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#949292b8',
  }}
>

      {/* Hero Section with Carousel */}
      <div className="relative bg-[#483929] dark:bg-gray-800 shadow-lg ">
        <div className="max-w-7xl mx-auto px-4 py-8 ">
          <h1 className="text-5xl font-bold text-center text-[#c7b098] dark:text-green-300 mb-4 ">
            City of Toronto Pin Map
          </h1>
          <p className="text-lg text-center text-[#ddd6d0] dark:text-green-400 mb-6">
            Pin, explore, and stay informed about public reports in your neighborhood.
          </p>
        </div>
        <div className="max-w-6xl mx-auto ">
          <Carousel slide={true} pauseOnHover className="rounded-lg shadow-md overflow-hidden">
          </Carousel>
        </div>
      </div>

      {/* Section Container */}
      <div className=' bg-[#d3d3d3d9] dark:bg-[#121212c1]'>
      <div className="max-w-5xl mx-auto px-10 py-10 space-y-10">
  {/* Timeline Section (New Section at the top) */}
  <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-4 text-center">Recent Updates</h2>
    <div className="space-y-4">
      {/* Timeline Item 1 */}
      <div className="flex items-start space-x-4">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        <div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">Pin Submission Feature Updated</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">March 15, 2025 - The pin submission feature now allows users to add images.</p>
        </div>
      </div>
      {/* Timeline Item 2 */}
      <div className="flex items-start space-x-4">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        <div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">New Admin Panel Released</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">March 20, 2025 - Admin panel now offers more robust control over the map and pin management.</p>
        </div>
      </div>
      {/* Timeline Item 3 */}
      <div className="flex items-start space-x-4">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        <div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">Search & Filter Improvements</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">April 5, 2025 - Enhanced search filters for a smoother user experience.</p>
        </div>
      </div>
    </div>
  </section>

  {/* Login & Authentication */}
  <section className="bg-white z-20 dark:bg-gray-800 rounded-lg p-6 hover:shadow-xl transition">
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
        <Button color="blue" className="text-lg py-3 px-6">Sign In or Create Account</Button>
      </Link>
    </div>
  </section>

  {/* How to Pin */}
  <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
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
  <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
    <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 text-center mb-4">Search & Filter Pins</h2>
    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
      <li>Search by title, location, or department</li>
      <li>Filter by status: <em>pending</em>, <em>accepted</em>, <em>in-progress</em>, <em>resolved</em>, <em>deleted</em></li>
      <li>Click on map pins for detailed information</li>
    </ul>
  </section>

  {/* Datasheet Section */}
  <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
    <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-2">View All Pins in a Table</h2>
    <p className="text-gray-700 dark:text-gray-300 mb-4">
      Use the datasheet to explore all pins in a sortable format.
    </p>
    <Link to="/datasheet">
      <Button color="yellow" className="text-lg py-3 px-6">View Datasheet</Button>
    </Link>
  </section>

  {/* Submit Button */}
  <div className="text-center">
    <Link to="/report">
      <Button color="blue" pill className="text-lg py-3 px-6">
        Submit a Pin <HiOutlineArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </Link>
  </div>

  {/* Contact Form */}
  <div className="max-w-5xl mx-auto p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-4 text-center">Contact Us</h2>
    <p className="text-center text-gray-700 dark:text-gray-300 mb-6">Have a question or need assistance? Feel free to contact us below.</p>

    {/* Contact Form */}
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          placeholder="Your Name"
          className="p-3 border rounded-lg w-full"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
          placeholder="Your Email"
          className="p-3 border rounded-lg w-full"
          required
        />
      </div>

      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleFormChange}
        placeholder="Subject"
        className="p-3 border rounded-lg w-full"
        required
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={handleFormChange}
        placeholder="Your Message"
        className="p-3 border rounded-lg w-full"
        rows="5"
        required
      />

      <div className="text-center">
        <Button type="submit" color="green" className="text-lg py-3 px-6">Send Message</Button>
      </div>
    </form>

    {formStatus && (
      <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{formStatus}</p>
    )}
  </div>
</div>



      {/* Additional Carousel Component */}
      <div className="max-w-5xl mx-auto my-12 p-10">
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 rounded-lg overflow-hidden shadow-md border border-green-200 dark:border-green-600">
      <Carousel>
        <div className="flex h-full items-center justify-center bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200 text-xl font-medium">
          <img src={slide_1_image ? slide_1_image : "https://source.unsplash.com/featured/?toronto"} alt="Toronto City" className="h-96 w-full object-cover" />

        </div>
        <div className="flex h-full items-center justify-center bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 text-xl font-medium">
          Slide 2
        </div>
        <div className="flex h-full items-center justify-center bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100 text-xl font-medium">
          Slide 3
        </div>
      </Carousel>
    </div>
      </div>
      </div>
      </div>
    

  );
}
