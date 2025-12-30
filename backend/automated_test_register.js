const axios = require('axios');

async function testRegister() {
    const testUser = {
        name: 'Test User 2',
        email: `test${Date.now()}@example.com`, // Unique email every time
        password: 'password123',
        phone: '1234567890'
    };

    console.log('Attempting to register with:', testUser);

    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
        console.log('✅ Registration Successful!');
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('❌ Registration Failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testRegister();
