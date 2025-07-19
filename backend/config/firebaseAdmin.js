const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  // Try to load from environment variable first (for production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Fallback to service account file (for development)
    const serviceAccountPath = path.join(__dirname, 'firebaseServiceAccount.json');
    serviceAccount = require(serviceAccountPath);
  }
} catch (error) {
  console.error('Error loading Firebase service account:', error);
  console.log('Please ensure you have set up Firebase service account credentials.');
  console.log('Make sure firebaseServiceAccount.json exists in the config folder.');
  process.exit(1);
}

// Initialize the app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    storageBucket: `${serviceAccount.project_id}.appspot.com`
  });
}

const db = admin.firestore();

module.exports = { admin, db };
