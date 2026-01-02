const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function verifyEmailConfig() {
    console.log(`Checking email config for: ${process.env.EMAIL_USERNAME}`);
    try {
        await transporter.verify();
        console.log('✅ Server is ready to take our messages');

        // Try sending a real email execution
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: process.env.EMAIL_USERNAME, // Send to self
            subject: "Test Verification Email",
            text: "Backend email is working!"
        });
        console.log("✅ Message sent: %s", info.messageId);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

verifyEmailConfig();
