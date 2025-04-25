import React, { useState } from 'react';
import { Button } from 'flowbite-react';

export default function ContactForm() {
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
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 10px; border-left: 3px solid #3498db;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
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
    <div className="max-w-2xl p-10 bg-gradient-to-tr from-[#727171fa] via-green-00 to-green-500 rounded-2xl shadow-xl m-9 sm:mx-auto">
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
