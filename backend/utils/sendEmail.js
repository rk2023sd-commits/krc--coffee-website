const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // 1) Create a transporter
    // Explicit Brevo Config with extended timeouts
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // keep false for 587
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000, // 30 seconds
        auth: {
            user: process.env.EMAIL_USERNAME, // Ensure this matches Brevo login
            pass: process.env.EMAIL_PASSWORD // Ensure this is the long SMTP Key
        },
        tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3' // Try legacy cipher support just in case
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: `KRC! Coffee <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    // 3) Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error('Email send failed:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
