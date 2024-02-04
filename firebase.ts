import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhnYXSiZKOUiufw06l0naUGrU10gdT8Jk",
  authDomain: "clutch-16650.firebaseapp.com",
  projectId: "clutch-16650",
  storageBucket: "clutch-16650.appspot.com",
  messagingSenderId: "147699418091",
  appId: "1:147699418091:web:6b77019f07f955e052cfae",
  measurementId: "G-73MP2P2SBB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
