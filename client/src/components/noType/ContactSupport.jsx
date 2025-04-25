import React, { useState } from 'react';
import { Accordion, Button } from 'flowbite-react';
import Settings from '../../pages/Settings';
import { HiOutlineArrowRight } from 'react-icons/hi';

export default function ContactSupport() {
  const [formData, setFormData] = useState({ message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ message: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Your message has been sent successfully!');
      setFormData({ message: '' });
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen overflow-auto text-sm md:text-base p-4 md:p-6 lg:p-4 bg-[#695f567a] dark:bg-[#6a6e81e4] dark:text-white">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-4 lg:mb-2 pt-16 md:pt-4 dark:text-white">Contact Support</h1>
      <p className="text-base md:text-lg mb-6 lg:mb-4 text-center text-gray-700 dark:text-gray-300">
        We are here to help. Please use the form below to send us your message.
      </p>

      {/* Additional Support Section */}
      <div className="max-w-5xl sm:space-x-8 sm:flex">
        {/* Phone Support Card */}
        <div className="w-full max-w-5xl bg-white dark:bg-[#00000085] p-6 rounded-2xl shadow-xl mb-6 lg:mb-4 dark:text-white dark:border-white dark:border-2">
          <h2 className="text-lg font-semibold mb-2">Phone Support</h2>
          <p className="text-sm text-gray-700 mb-1 dark:text-gray-300">
            Speak directly with one of our agents to resolve your concern.
            Choose the number specific to the product or service you need support with.
          </p>
          <p className="text-sm text-gray-700 mb-2 dark:text-gray-300">Available: Mon–Sat, 9am – 7pm ET</p>
          <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500">
            Call us now
          </button>
        </div>

        {/* Mail Support Card */}
        <div className="w-full max-w-5xl bg-white dark:bg-[#00000085] p-6 rounded-2xl shadow-xl mb-6 lg:mb-4 dark:text-white dark:border-white dark:border-2">
          <h2 className="text-lg font-semibold mb-2">Mail Support</h2>
          <p className="text-sm text-gray-700 mb-1 dark:text-gray-300">
            Prefer to send a letter? You can mail your concern to the address below.
            Be sure to include as much detail as possible to help us assist you better.
          </p>
          <address className="text-sm text-gray-700 dark:text-gray-300">
            Rogers Communications<br />
            Share a concern<br />
            333 Bloor St. E<br />
            Toronto, ON M4W 1G9
          </address>
        </div>
      </div>

      {/* Accordion for FAQ */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#00000096] p-0 rounded-2xl shadow-xl mb-8 lg:mb-4 dark:text-white dark:border-white dark:border-2">
        <Accordion className='rounded-2xl shadow-xl'>
          <Accordion.Panel defaultOpen={false}>
            <Accordion.Title>
              <h3 className="text-base font-semibold dark:text-white">How do I get support?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You can contact us by filling out the contact form above. We aim to respond to all queries within 24 hours.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel defaultOpen={false}>
            <Accordion.Title>
              <h3 className="text-base font-semibold dark:text-white">What should I include in my message?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Please provide as much detail as possible about your issue. If it's related to an account or service, include relevant information like your username, order number, etc.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel defaultOpen={false}>
            <Accordion.Title>
              <h3 className="text-base font-semibold dark:text-white">How long will it take to receive a response?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                We strive to respond to all inquiries within 24-48 hours. For urgent issues, feel free to mention that in the message.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel defaultOpen={false}>
            <Accordion.Title>
              <h3 className="text-base font-semibold dark:text-white">What other support options are available?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                In addition to email support, we offer live chat on our website. If you're logged in, you can access this option on the bottom-right corner of the page.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>

      {/* Contact Form */}
      <form
        className="w-full max-w-2xl bg-white dark:bg-[#00000085] dark:border-white dark:border-2 p-6 rounded-2xl shadow-xl mb-8 lg:mb-6 dark:text-white"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#00000085] dark:border-gray-600 dark:text-white"
          />
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-md dark:bg-green-900 dark:text-green-300">
            {successMessage}
          </div>
        )}

        <div className="flex justify-center">
          <Button
                color="green"
                outline
                pill
                type='submit'
                className="text-lg py-1 px-6 flex items-center group transition-all duration-300"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <HiOutlineArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-5" />
              </Button>
        </div>
      </form>

      {/* Settings Component */}
      <Settings />
    </div>
  );
}
