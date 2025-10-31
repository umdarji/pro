const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email and message are required.' });
  }
  // Log incoming request for debugging
  console.log('Contact request received:', { name, email, message: message && message.substring(0, 200) });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP configuration early to provide clearer errors
    try {
      await transporter.verify();
      console.log('SMTP connection verified');
    } catch (verifyErr) {
      console.error('SMTP verify failed', verifyErr);
      return res.status(500).json({ error: 'SMTP verification failed: ' + (verifyErr && verifyErr.message ? verifyErr.message : 'unknown error') });
    }

    const to = process.env.TO_EMAIL || process.env.SMTP_USER;

    const mailOptions = {
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to,
      subject: `New contact from ${name} <${email}>`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${(message || '').replace(/\n/g, '<br>')}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info && info.messageId ? info.messageId : info);

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to send email', err && err.stack ? err.stack : err);
    // Return the underlying error message to help debugging (safe for local/dev use)
    const messageText = err && err.message ? err.message : 'Failed to send email';
    res.status(500).json({ error: messageText });
  }
});

app.listen(PORT, () => {
  console.log(`Contact backend listening on port ${PORT}`);
});
