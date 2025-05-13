// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-dpcn2unkTkMKNKMOTycQLybY3EbmXk4",
  authDomain: "aplicatie-recrutari.firebaseapp.com",
  projectId: "aplicatie-recrutari",
  storageBucket: "aplicatie-recrutari.appspot.com",
  messagingSenderId: "372555810820",
  appId: "1:372555810820:web:100325a2b6b500a5564d51",
  measurementId: "G-T0KPMB4T3S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
