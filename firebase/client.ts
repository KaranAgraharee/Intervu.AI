import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1TrXRgAPHKUt-yCHzWSxt40ubsyf6B-c",
  authDomain: "helpview-f65fe.firebaseapp.com",
  databaseURL: "https://helpview-f65fe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "helpview-f65fe",
  storageBucket: "helpview-f65fe.firebasestorage.app",
  messagingSenderId: "576297936847",
  appId: "1:576297936847:web:e1f91734118d93ad6914ba",
  measurementId: "G-P95L82P0YY"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);