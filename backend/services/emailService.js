const nodemailer = require('nodemailer');
const config = require('../config/db');
const logger = require('../utils/logger');

/**
 * Create Nodemailer Transporter using Gmail SMTP
 */
const createTransporter = () => {
  if (config.email.user && config.email.pass && config.email.pass !== 'dummy-app-password') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }
  return null;
};

/**
 * Send Contact Notification Email
 */
const sendContactNotification = async ({ name, email, subject, message, timestamp, ipAddress }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Portfolio Contact System" <${config.email.user || 'noreply@portfolio.com'}>`,
    to: config.email.receiver || 'bhuvitamil3262@gmail.com',
    subject: 'New Portfolio Contact Message',
    text: `New Contact Received

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Timestamp: ${timestamp}
Sender IP: ${ipAddress}
`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2563eb; margin-top: 0;">🚀 New Portfolio Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px; margin: 15px 0;">
          <p style="margin: 0; white-space: pre-wrap;"><strong>Message:</strong><br>${message}</p>
        </div>
        <p style="font-size: 0.85rem; color: #64748b;"><strong>Timestamp:</strong> ${timestamp}</p>
        <p style="font-size: 0.85rem; color: #64748b;"><strong>Sender IP:</strong> ${ipAddress}</p>
      </div>
    `,
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email Sent: ${info.messageId}`);
      console.log('Email Sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      logger.error(`Email Failed: ${err.message}`);
      console.log('Email Failed:', err.message);
      return { success: false, error: err.message };
    }
  } else {
    const warningMsg = 'Nodemailer SMTP credentials not configured (EMAIL_PASS is default/dummy)';
    logger.warn(warningMsg);
    console.log('Email Sent (Simulated/Mock):', warningMsg);
    return { success: true, messageId: 'simulated-local-mode' };
  }
};

module.exports = {
  sendContactNotification,
};
