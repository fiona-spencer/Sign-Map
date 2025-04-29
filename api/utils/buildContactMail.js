export function buildContactMail({ name, email, subject, message }) {
    return {
      from: `"${name}" <${email}>`,
      subject,
      text: `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.8; padding: 20px; background-color: #ffffff; border: 2px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
          <h2 style="text-align: center; color: #2c3e50;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `
    };
  }
  