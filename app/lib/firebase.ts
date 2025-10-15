// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCY_Z8XuHXjbQbc92oWgn-3BUMlhYKXHg8",
  authDomain: "blog-renewed.firebaseapp.com",
  projectId: "blog-renewed",
  storageBucket: "blog-renewed.firebasestorage.app",
  messagingSenderId: "334371157185",
  appId: "1:334371157185:web:c7f2fee0492265d7a91040",
  measurementId: "G-FNQX4GXPGG",
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
