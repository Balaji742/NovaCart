import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCam3U_w7nMuJuj1_-YfpDFAhWfW1z10w8",
  authDomain: "novacart-b94b1.firebaseapp.com",
  projectId: "novacart-b94b1",
  storageBucket: "novacart-b94b1.firebasestorage.app",
  messagingSenderId: "268260841044",
  appId: "1:268260841044:web:f2bcee32548dd1c160ffc1",
  measurementId: "G-EGLK90EJGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const  storage = getStorage(app)