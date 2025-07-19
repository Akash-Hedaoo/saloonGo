const { db } = require('./config/firebaseAdmin');
const config = require('./config/config');

async function setupDatabase() {
  console.log('🔧 Setting up Firebase Database...\n');

  try {
    // Test database connection
    console.log('1. Testing Firebase connection...');
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Firebase connection successful\n');

    // Create initial collections if they don't exist
    console.log('2. Initializing collections...');
    
    // Create customers collection with a sample document
    const customersRef = db.collection('customers');
    const customerDoc = await customersRef.doc('sample').get();
    if (!customerDoc.exists) {
      await customersRef.doc('sample').set({
        name: 'Sample Customer',
        email: 'sample@example.com',
        phone: '+91-9876543210',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Customers collection initialized');
    } else {
      console.log('✅ Customers collection already exists');
    }

    // Create salonOwners collection with a sample document
    const salonOwnersRef = db.collection('salonOwners');
    const salonDoc = await salonOwnersRef.doc('sample').get();
    if (!salonDoc.exists) {
      await salonOwnersRef.doc('sample').set({
        name: 'Sample Salon',
        email: 'salon@example.com',
        phone: '+91-9876543211',
        role: 'salonOwner',
        salonName: 'Sample Salon',
        address: 'Sample Address',
        isLive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Salon Owners collection initialized');
    } else {
      console.log('✅ Salon Owners collection already exists');
    }

    // Create refreshTokens collection
    const refreshTokensRef = db.collection('refreshTokens');
    const tokenDoc = await refreshTokensRef.doc('sample').get();
    if (!tokenDoc.exists) {
      await refreshTokensRef.doc('sample').set({
        userId: 'sample-user-id',
        token: 'sample-refresh-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date()
      });
      console.log('✅ Refresh Tokens collection initialized');
    } else {
      console.log('✅ Refresh Tokens collection already exists');
    }

    // Clean up sample documents
    console.log('\n3. Cleaning up sample documents...');
    await customersRef.doc('sample').delete();
    await salonOwnersRef.doc('sample').delete();
    await refreshTokensRef.doc('sample').delete();
    console.log('✅ Sample documents cleaned up');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('📊 Firebase Project: ' + config.firebaseProjectId);
    console.log('🔐 Collections ready: customers, salonOwners, refreshTokens');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if Firebase service account is properly configured');
    console.log('2. Verify Firebase project ID is correct');
    console.log('3. Ensure Firebase Admin SDK has proper permissions');
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 