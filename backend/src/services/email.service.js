const logger = require('../utils/logger');

class EmailService {
  async sendEmail({ to, subject, html }) {
    logger.info(`Simulating email notification to: ${to}`, { subject });
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        // Dynamic import to avoid crash if nodemailer isn't present
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"RISALATECH" <${process.env.SMTP_USER}>`,
          to,
          subject,
          html,
        });
        logger.info(`SMTP email sent successfully to: ${to}`);
        return true;
      } catch (err) {
        logger.error('SMTP email dispatch failed', { message: err.message });
        return false;
      }
    }
    return true;
  }
}

module.exports = new EmailService();
