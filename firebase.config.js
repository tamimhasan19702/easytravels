/** @format */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnadQxE0tEbTKwi2IZyYKiZsxGSYncC5I",
  authDomain: "easytravelsdashboard.firebaseapp.com",
  projectId: "easytravelsdashboard",
  storageBucket: "easytravelsdashboard.firebasestorage.app",
  messagingSenderId: "730378551917",
  appId: "1:730378551917:web:dc81c3a4a80755f8677564",
  measurementId: "G-3SLZE0VYD6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
