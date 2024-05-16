//Then, initialize Firebase and begin using the SDKs for the products you'd like to use.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mercatus-immobilis-novatorum.firebaseapp.com",
  projectId: "mercatus-immobilis-novatorum",
  storageBucket: "mercatus-immobilis-novatorum.appspot.com",
  messagingSenderId: "62781852404",
  appId: "1:62781852404:web:e64f07be3a18d413e6aca1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
