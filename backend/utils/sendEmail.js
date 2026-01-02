const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // Using standard service configuration with POOLING enabled
    // This helps maintain connections and handles rate limiting better on free tiers
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        pool: true, // Use pooled connections
        maxConnections: 1, // Limit to 1 connection to avoid getting blocked
        rateDelta: 2000, // Limit message rate
        rateLimit: 5, // 5 messages per 2 seconds
        connectionTimeout: 10000, // Wait 10 seconds before timeout
        greetingTimeout: 5000, // Wait 5 seconds for greeting
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
