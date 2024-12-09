// firebase.js (or whatever you want to name your Firebase config file)

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: "G-NCTSDPCPSZ"
};

const app = initializeApp(firebaseConfig);

export const authKey = getAuth(app);
export const database = getDatabase(app);
export const firestoreKey = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app)
