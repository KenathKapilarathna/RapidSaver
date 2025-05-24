// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCksC5iZdZaAd3ZbGYIIvIDlBLo6C8agGo",
  authDomain: "advanced-vehicle-care-system.firebaseapp.com",
  databaseURL:
    "https://advanced-vehicle-care-system-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "advanced-vehicle-care-system",
  storageBucket: "advanced-vehicle-care-system.firebasestorage.app",
  messagingSenderId: "1097716509153",
  appId: "1:1097716509153:web:62ed95762ac04ce7630aa0",
  measurementId: "G-M5C0ZCCQVY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Analytics (only works in production with HTTPS)
// const analytics = getAnalytics(app);

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
