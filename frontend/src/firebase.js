import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOXDuMmsDuFEEuZhSoPoFXiRJof6pd-Pw",
  authDomain: "mytube-3bf2a.firebaseapp.com",
  projectId: "mytube-3bf2a",
  storageBucket: "mytube-3bf2a.firebasestorage.app",
  messagingSenderId: "915804334140",
  appId: "1:915804334140:web:160f572339eb4820a1bb39",
  measurementId: "G-0PXDGS6G64"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };