const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, email, subject, message, timestamp } = data;

    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'All fields are required.' })
      };
    }

    const emailUser = process.env.EMAIL_USER || 'bhuvitamil3262@gmail.com';
    const emailPass = process.env.EMAIL_PASS;
    const submittedAt = timestamp || new Date().toLocaleString();

    console.log('Contact message received via Netlify Function:', { name, email, subject });

    let emailSent = false;
    let messageId = 'notification-logged';

    // If EMAIL_PASS is configured, send email via Gmail SMTP
    if (emailPass && emailPass !== 'dummy-app-password') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      const formattedText = `----------------------------------------\nNew Portfolio Contact\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}\n\nSubmitted At: ${submittedAt}\n----------------------------------------`;

      const info = await transporter.sendMail({
        from: `"Portfolio Contact System" <${emailUser}>`,
        to: 'bhuvitamil3262@gmail.com',
        subject: `New Portfolio Contact: ${subject}`,
        text: formattedText
      });

      emailSent = true;
      messageId = info.messageId;
      console.log('Email sent successfully:', messageId);
    } else {
      console.log('EMAIL_PASS not configured for live SMTP. Email notification logged.');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Message Sent Successfully',
        emailSent,
        messageId
      })
    };
  } catch (error) {
    console.error('Netlify function error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
