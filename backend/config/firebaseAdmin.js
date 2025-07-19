// backend/firebase/firebaseAdmin.js

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: Not needed for Firestore
});

const db = admin.firestore();

module.exports = { admin, db };
