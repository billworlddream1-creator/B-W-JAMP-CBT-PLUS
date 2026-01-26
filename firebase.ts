
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

/**
 * Official Firebase configuration for the JAM-CBT-PLUS project.
 * These credentials link the frontend to the Google Cloud backend services.
 */
const firebaseConfig = {
  apiKey: "AIzaSyATmQTNNqIgT92YhtlFdbP7evF4CJvGDWg",
  authDomain: "jam-cbt-plus.firebaseapp.com",
  projectId: "jam-cbt-plus",
  storageBucket: "jam-cbt-plus.firebasestorage.app",
  messagingSenderId: "212777835271",
  appId: "1:212777835271:web:1d04775f974e6e100fc3a2",
  measurementId: "G-VTD7B33MVG"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
