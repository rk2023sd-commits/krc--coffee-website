const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // Using port 465 (SSL) instead of 587 (STARTTLS) to avoid connection timeouts on Render
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
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
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
