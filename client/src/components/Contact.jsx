import React, { useState } from 'react';
import { Button } from 'flowbite-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({ message: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: '', isError: false });

    const { name, email, subject, message } = formData;

    const mailPayload = {
      from: `"${name}" <${email}>`,
      subject,
      text: `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`,
      html: `

    <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.8; padding: 20px; background-color: #ffffff; border: 2px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
      <div style="text-align: center; margin: 20px;">
        <!-- Embedded image with CID -->
        <h1 style="color: #2c3e50; font-size: 28px; margin: 0;">Sign Map</h1>
        <p style="color: #777; margin-top: 5px;">You've received a new contact form submission</p>
      </div>

      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #3498db; background-color: #ffffff;">
        ${message.replace(/\n/g, '<br>')}
      </div>

      <p style="margin-top: 30px; text-align: center;">
        Visit us at 
      </p>
      <p style="margin-top: 30px; text-align: center;">
        <a href="http://localhost:5173" style="display: inline-block; background-color: #3498db; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          Visit Sign Map Website
        </a>
      </p>
    </div>
      `,
      attachments: [
        {
          filename: 'pin.png',
          path: '/Users/fiona_spencer/Desk/MY-PROJECTS/Sign-Map/client/src/assets/pin.png',  // Provide the full path to the image
          cid: 'unique@nodemailer.com'  // The CID must match the "cid" in the HTML img tag
        }
      ]
    };

    try {
      const res = await fetch('/api/email/sendContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mailPayload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to send message');

      setFormStatus({ message: 'Your message has been sent successfully!', isError: false });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus({ message: error.message, isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div  className="max-w-2xl p-10 bg-gradient-to-tr from-[#727171fa] via-green-00 to-green-500 rounded-2xl shadow-xl m-9 sm:mx-auto">
      <h2 className="text-3xl font-bold text-green-100 mb-4 text-center">Contact Us</h2>
      <p className="text-center text-green-200 mb-6">Have a question or need assistance? Feel free to reach out below.</p>
      <form onSubmit={handleFormSubmit} className="space-y-5">
        <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Your Name" required className="p-4 bg-green-100 text-black border border-green-600 w-full rounded-lg" />
        <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" required className="p-4 bg-green-100 text-black border border-green-600 w-full rounded-lg" />
        <input type="text" name="subject" value={formData.subject} onChange={handleFormChange} placeholder="Subject" required className="p-4 bg-green-100 text-black border border-green-600 w-full rounded-lg" />
        <textarea name="message" value={formData.message} onChange={handleFormChange} placeholder="Your Message" rows="6" required className="p-4 bg-green-100 text-black border border-green-600 w-full rounded-lg" />
        <Button type="submit" color="green" className="text-green-800 text-lg w-full font-semibold bg-green-500 hover:bg-green-600" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
      {formStatus.message && (
        <p className={`mt-4 text-center ${formStatus.isError ? 'text-red-300' : 'text-green-100'}`}>{formStatus.message}</p>
      )}
    </div>
  );
}
