// routes/email.route.js
import express from 'express';
import { sendMail } from '../utils/mail.js';

const router = express.Router();

router.post('/sendContact', async (req, res) => {
  try {
    const { from, subject, text, html } = req.body;
    const response = await sendMail({ from, subject, text, html });
    res.status(200).json({ success: true, message: 'Email sent', response });
  } catch (error) {
    console.error('SendMail Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
