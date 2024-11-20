// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database"; // Import Realtime Database methods

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTqUuVFLikR5nXGtWcBIaB7Tov0iTZuGM",
  authDomain: "baby-tracker-c9d75.firebaseapp.com",
  databaseURL: "https://baby-tracker-c9d75-default-rtdb.firebaseio.com", // Add your Realtime Database URL here
  projectId: "baby-tracker-c9d75",
  storageBucket: "baby-tracker-c9d75.appspot.com",
  messagingSenderId: "582498097273",
  appId: "1:582498097273:web:9e44b8d5ad528296135ca8",
  measurementId: "G-Q7MWZSVK7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Realtime Database
const database = getDatabase(app); // Get a reference to the Realtime Database

// Export the services
export { auth, database, ref, set, get, child }; // Export Realtime Database methods
