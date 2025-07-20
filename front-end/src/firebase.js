import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6QdGV4-YBiS3CuP_ziS6X5xIiRdD7Zps",
  authDomain: "salonproject-500af.firebaseapp.com",
  projectId: "salonproject-500af",
  storageBucket: "salonproject-500af.firebasestorage.app",
  messagingSenderId: "992167394189",
  appId: "1:992167394189:web:41f9c274856bc8941adbc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db }; 