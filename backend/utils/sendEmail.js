const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // 1) Create a transporter
    // Using Brevo on Alternate Port 2525 (Bypasses Render's Port 587 block)
    // Reduced timeout to 10s so failsafe triggers quickly if blocked
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 2525,
        secure: false, // true for 465, false for other ports
        connectionTimeout: 10000, // 10 seconds (Fail fast!)
        greetingTimeout: 5000,
        logger: true, // Log SMTP info for debugging
        debug: true,  // Include debug info
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
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
