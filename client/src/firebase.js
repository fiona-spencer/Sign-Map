// firebase.js (or firebase-config.js)
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnIBJvd1QrR3Xqzt-7bmit4G8nyG-BD18",
  authDomain: "sign-map-f443e.firebaseapp.com",
  projectId: "sign-map-f443e",
  storageBucket: "sign-map-f443e.firebasestorage.app",
  messagingSenderId: "715186628947",
  appId: "1:715186628947:web:965bbe0ac99235d9b019a6",
  measurementId: "G-2WS2HJWEP8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

