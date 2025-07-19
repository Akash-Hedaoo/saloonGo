const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testCustomer = {
  name: 'Test Customer',
  email: 'testcustomer@example.com',
  password: 'Password123',
  phone: '+1234567890',
  address: '123 Test St, Test City'
};

const testSalon = {
  fullName: 'Test Salon Owner',
  email: 'testsalon@example.com',
  password: 'Password123',
  salonName: 'Test Hair Studio',
  salonAddress: '456 Test Ave, Test City',
  phoneNumber: '+1234567890',
  servicesOffered: ['Haircut', 'Styling', 'Facial'],
  openHours: '9:00 AM - 8:00 PM',
  role: 'salonOwner'
};

async function testBackend() {
  console.log('🧪 Testing SaloonGo Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Customer Registration
    console.log('2. Testing Customer Registration...');
    const customerRegResponse = await axios.post(`${BASE_URL}/api/auth/signup/customer`, testCustomer);
    console.log('✅ Customer Registration:', customerRegResponse.data.message);
    const customerToken = customerRegResponse.data.token;
    console.log('');

    // Test 3: Customer Login
    console.log('3. Testing Customer Login...');
    const customerLoginResponse = await axios.post(`${BASE_URL}/api/auth/login/customer`, {
      email: testCustomer.email,
      password: testCustomer.password
    });
    console.log('✅ Customer Login:', customerLoginResponse.data.message);
    console.log('');

    // Test 4: Get Customer Profile
    console.log('4. Testing Get Customer Profile...');
    const customerProfileResponse = await axios.get(`${BASE_URL}/api/user/customer/profile`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('✅ Customer Profile Retrieved');
    console.log('');

    // Test 5: Salon Owner Registration
    console.log('5. Testing Salon Owner Registration...');
    const salonRegResponse = await axios.post(`${BASE_URL}/api/auth/signup/salonOwner`, testSalon);
    console.log('✅ Salon Owner Registration:', salonRegResponse.data.message);
    const salonToken = salonRegResponse.data.token;
    console.log('');

    // Test 6: Salon Owner Login
    console.log('6. Testing Salon Owner Login...');
    const salonLoginResponse = await axios.post(`${BASE_URL}/api/auth/login/salonOwner`, {
      email: testSalon.email,
      password: testSalon.password
    });
    console.log('✅ Salon Owner Login:', salonLoginResponse.data.message);
    console.log('');

    // Test 7: Get Salon Profile
    console.log('7. Testing Get Salon Profile...');
    const salonProfileResponse = await axios.get(`${BASE_URL}/api/user/salon/profile`, {
      headers: { Authorization: `Bearer ${salonToken}` }
    });
    console.log('✅ Salon Profile Retrieved');
    console.log('');

    // Test 8: Toggle Salon Live Status
    console.log('8. Testing Toggle Salon Live Status...');
    const liveStatusResponse = await axios.put(`${BASE_URL}/api/user/salon/live-status`, 
      { isLive: true },
      { headers: { Authorization: `Bearer ${salonToken}` } }
    );
    console.log('✅ Salon Live Status:', liveStatusResponse.data.message);
    console.log('');

    // Test 9: Update Customer Profile
    console.log('9. Testing Update Customer Profile...');
    const updateProfileResponse = await axios.put(`${BASE_URL}/api/user/customer/profile`,
      { name: 'Updated Test Customer' },
      { headers: { Authorization: `Bearer ${customerToken}` } }
    );
    console.log('✅ Customer Profile Updated:', updateProfileResponse.data.message);
    console.log('');

    // Test 10: Get Current User
    console.log('10. Testing Get Current User...');
    const currentUserResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('✅ Current User Retrieved');
    console.log('');

    console.log('🎉 All tests passed! Backend is working correctly.');
    console.log('\n📊 Test Summary:');
    console.log('- ✅ Health Check');
    console.log('- ✅ Customer Registration & Login');
    console.log('- ✅ Salon Owner Registration & Login');
    console.log('- ✅ Profile Management');
    console.log('- ✅ Authentication Middleware');
    console.log('- ✅ JWT Token System');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n🔧 Make sure:');
    console.log('1. Backend server is running (npm run dev)');
    console.log('2. Firebase is properly configured');
    console.log('3. Environment variables are set');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testBackend();
}

module.exports = { testBackend }; 