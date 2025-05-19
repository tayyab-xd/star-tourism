const nodemailer = require('nodemailer');
require('dotenv').config();

export const sendEmail = async ({ subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Star Tourism Club" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // You receive the email
      subject,
      html,
    });

  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

