import React, { useState } from 'react';
import { Accordion, Button } from 'flowbite-react';
import Settings from '../../pages/Settings';
import { HiOutlineArrowRight, HiOutlineMail, HiOutlineMailOpen, HiPhoneOutgoing } from 'react-icons/hi';
import { useSelector } from 'react-redux';


export default function ContactSupport() {
  const [formData, setFormData] = useState({ message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ message: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
  
    const { message } = formData;
  
    const name = currentUser?.username || 'Anonymous';
    const email = currentUser?.email || 'no-reply@example.com';
  
    const mailPayload = {
      from: `"${name}" <${email}>`,
      subject: 'Support Request via Contact Form',
      text: `From: ${name} (${email})\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.8; padding: 20px; background-color: #ffffff; border: 2px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
          <div style="text-align: center; margin: 20px;">
            <h1 style="color: #2c3e50; font-size: 28px; margin: 0;">Sign Map Support</h1>
            <p style="color: #777; margin-top: 5px;">New support request received</p>
          </div>
          <p><strong>From:</strong> ${name} (${email})</p>
          <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #3498db; background-color: #ffffff;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:5173" style="display: inline-block; background-color: #3498db; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
              Visit Sign Map
            </a>
          </p>
        </div>
      `
    };
  
    try {
      const res = await fetch('/api/email/sendContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mailPayload),
      });
  
      if (!res.ok) throw new Error('Failed to send message');
  
      setSuccessMessage('Your message has been sent successfully!');
      setFormData({ message: '' });
    } catch (err) {
      setSuccessMessage('Error sending message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-start min-h-screen overflow-auto text-sm md:text-base p-4 md:p-6 lg:px-16 bg-[#8d88844f] dark:bg-[#1f2937] dark:text-white">
      
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 pt-20 md:pt-10 dark:text-white">Contact Support</h1>
      <p className="text-base md:text-lg mb-8 text-center text-gray-800 dark:text-gray-300 max-w-2xl">
        We are here to help. Please use the form below to send us your message.
      </p>

      {/* Contact Form */}
      <form
        className="w-full max-w-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-600 p-6 rounded-2xl shadow-lg mb-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe your issue here..."
            className="w-full mt-2 p-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 p-4 mb-4 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            color="green"
            outline
            pill
            type="submit"
            className="text-lg py-2 px-6 flex items-center group transition-all duration-300"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <HiOutlineArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Button>
        </div>
      </form>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-10">
        {/* Phone Support */}
        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-2 flex items-center">Phone Support <HiPhoneOutgoing className='ml-2'/></h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            Speak directly with one of our agents. Choose the number specific to the product or service you need.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Available: Mon–Sat, 9am – 7pm ET</p>
          <Button color="green" className="px-4 py-2">
            Call us now
          </Button>
        </div>

        {/* Mail Support */}
        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-2 flex items-center">Mail Support <HiOutlineMailOpen className='ml-2'/></h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Prefer to send a letter? You can mail your concern to the address below.
          </p>
          <address className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
  Spencer Communications<br />
  Toronto, ON M4Y 2Y5
</address>

        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="w-full max-w-5xl mb-20">
        <Accordion className="rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg">
          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-base font-semibold dark:text-white">How do I get support?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Fill out the contact form above. We aim to respond to all queries within 24 hours.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-base font-semibold dark:text-white">What should I include in my message?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Include details like your username, order number, and any relevant context so we can help faster.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-base font-semibold dark:text-white">How long will it take to receive a response?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Most inquiries receive a response within 24–48 hours. For urgent issues, flag them clearly in your message.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-base font-semibold dark:text-white">What other support options are available?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You can also use our live chat or call support for faster help. Live chat is available when logged in at the bottom-right corner.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>

      {/* Settings Page (if needed) */}
      <Settings />
    </div>
  );
}
