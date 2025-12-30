const dotenv = require('dotenv');
dotenv.config();
const sendEmail = require('./utils/sendEmail');

const test = async () => {
    try {
        console.log('Check 1: Reading Env...');
        if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
            throw new Error('EMAIL_USERNAME or EMAIL_PASSWORD missing in .env');
        }
        console.log('Using Email:', process.env.EMAIL_USERNAME);

        console.log('Check 2: Sending Email...');
        await sendEmail({
            email: process.env.EMAIL_USERNAME, // Send to self for testing
            subject: 'Test Email KRC Coffee System',
            message: '<h1>Success!</h1><p>Your email notification system is working correctly.</p>'
        });
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        if (error.code === 'EAUTH') {
            console.log('👉 Tip: Check if you enabled "App Passwords" in Google Account settings.');
        }
    }
};

test();
