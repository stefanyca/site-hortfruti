// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkTsg-IGi3v3l0wiywGcuxeVxmqt9jM6M",
  authDomain: "produtos-e5894.firebaseapp.com",
  projectId: "produtos-e5894",
  storageBucket: "produtos-e5894.appspot.com",
  messagingSenderId: "484059726766",
  appId: "1:484059726766:web:dfb2026622794ceeeffe3f"
};

const app = initializeApp(firebaseConfig);

// ✅ Exporte só depois de inicializar
export const db = getFirestore(app);
export const auth = getAuth(app);
