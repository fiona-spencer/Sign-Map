import React, { useState } from 'react';
import { Accordion } from 'flowbite-react';
import Settings from '../../pages/Settings';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here you would typically make an API call or send the form data to a server
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 h-screen overflow-auto">
      <h1 className="text-3xl font-semibold text-center mb-4">Contact Support</h1>
      <p className="text-lg mb-6 text-center text-gray-700">
        We are here to help. Please fill out the form below to get in touch with us.
      </p>

      {/* Contact Form */}
      <form
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mb-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-md">
            {successMessage}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

      {/* Accordion for additional info */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <Accordion>
          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">How do I get support?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                You can contact us by filling out the contact form above. We aim to respond to all queries within 24 hours.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">What should I include in my message?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                Please provide as much detail as possible about your issue. If it's related to an account or service, include relevant information like your username, order number, etc.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">How long will it take to receive a response?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                We strive to respond to all inquiries within 24-48 hours. For urgent issues, feel free to mention that in the message.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">What other support options are available?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                In addition to email support, we offer live chat on our website. If you're logged in, you can access this option on the bottom-right corner of the page.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>

      {/* Settings Component */}
      <Settings />
    </div>
  );
}
