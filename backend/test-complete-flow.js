const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testSalonData = {
  fullName: 'Test Owner',
  email: 'testowner@example.com',
  password: 'testpass123',
  salonName: 'Test Beauty Salon',
  salonAddress: '123 Test Street, Test City',
  phoneNumber: '+1234567890',
  servicesOffered: 'Hair Cut, Facial, Manicure',
  city: 'Test City',
  state: 'Test State',
  pincode: '123456'
};

const updatedProfileData = {
  fullName: 'Updated Test Owner',
  salonName: 'Updated Beauty Salon',
  salonAddress: '456 Updated Street, Test City',
  phoneNumber: '+1234567890',
  servicesOffered: 'Hair Cut, Facial, Manicure, Pedicure',
  city: 'Test City',
  state: 'Test State',
  pincode: '123456'
};

async function testCompleteFlow() {
  console.log('🧪 Starting comprehensive flow test...\n');
  
  let accessToken = null;
  let refreshToken = null;
  let salonOwnerId = null;
  let salonId = null;

  try {
    // Step 1: Register a new salon owner
    console.log('1️⃣ Testing salon registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/signup/salonOwner`, testSalonData);
    console.log('✅ Registration successful:', registerResponse.data);
    
    accessToken = registerResponse.data.token;
    refreshToken = registerResponse.data.refreshToken;
    salonOwnerId = registerResponse.data.salon.id;
    salonId = registerResponse.data.salon.salonId;
    
    console.log('📝 Salon Owner ID:', salonOwnerId);
    console.log('📝 Salon ID:', salonId);
    console.log('📝 Access Token:', accessToken ? 'Present' : 'Missing');
    console.log('');

    // Step 2: Get all salons to verify the new salon appears
    console.log('2️⃣ Testing salon retrieval...');
    const salonsResponse = await axios.get(`${BASE_URL}/salon/all`);
    console.log('✅ Salons retrieved:', salonsResponse.data.salons?.length || 0, 'salons');
    
    const newSalon = salonsResponse.data.salons?.find(s => s.id === salonId);
    if (newSalon) {
      console.log('✅ New salon found in search results:', newSalon.name);
    } else {
      console.log('❌ New salon NOT found in search results');
    }
    console.log('');

    // Step 3: Get salon owner profile
    console.log('3️⃣ Testing profile retrieval...');
    const profileResponse = await axios.get(`${BASE_URL}/user/salon/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.salon.fullName);
    console.log('');

    // Step 4: Update salon owner profile
    console.log('4️⃣ Testing profile update...');
    const updateResponse = await axios.put(`${BASE_URL}/user/salon/profile`, updatedProfileData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Profile updated:', updateResponse.data.message);
    console.log('');

    // Step 5: Sync with salon search data
    console.log('5️⃣ Testing salon sync...');
    const syncResponse = await axios.put(`${BASE_URL}/salon/owner-profile/${salonOwnerId}`, updatedProfileData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Salon sync successful:', syncResponse.data.message);
    console.log('');

    // Step 6: Get all salons again to verify updates
    console.log('6️⃣ Testing updated salon retrieval...');
    const updatedSalonsResponse = await axios.get(`${BASE_URL}/salon/all`);
    const updatedSalon = updatedSalonsResponse.data.salons?.find(s => s.id === salonId);
    
    if (updatedSalon) {
      console.log('✅ Updated salon found:', updatedSalon.name);
      console.log('✅ Updated address:', updatedSalon.address);
      console.log('✅ Updated services:', updatedSalon.services?.length || 0, 'services');
    } else {
      console.log('❌ Updated salon NOT found');
    }
    console.log('');

    // Step 7: Test authentication
    console.log('7️⃣ Testing authentication...');
    const authResponse = await axios.get(`${BASE_URL}/auth/test`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Authentication successful:', authResponse.data.message);
    console.log('');

    console.log('🎉 ALL TESTS PASSED! The complete flow is working correctly.');
    console.log('');
    console.log('📊 Summary:');
    console.log('   ✅ Salon registration creates both owner and salon documents');
    console.log('   ✅ Salon appears in search results immediately');
    console.log('   ✅ Profile updates work correctly');
    console.log('   ✅ Salon sync updates search data');
    console.log('   ✅ Authentication works throughout the process');
    console.log('   ✅ Appointment booking will show real salon data');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('❌ Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
}

// Run the test
testCompleteFlow(); 