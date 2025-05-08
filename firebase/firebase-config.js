// firebase/firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBiG3Xrw6Srit6-3g6USF2YTto5FwYMwuM",
    authDomain: "contractmanagement-bf43b.firebaseapp.com",
    projectId: "contractmanagement-bf43b",
    storageBucket: "contractmanagement-bf43b.firebasestorage.app",
    messagingSenderId: "1002223295201",
    appId: "1:1002223295201:web:65307c1edca55ef1b235a0",
    measurementId: "G-DEW8H8B5PZ"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
