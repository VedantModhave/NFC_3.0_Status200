// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object (replace with your actual config)
const firebaseConfig = {
  apiKey: "Enter your own credentials",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export the instances
export { auth, googleProvider, db };














// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import Firebase Auth and Google Auth Provider

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBBc2lOoqmGmYc2Hms8y2pMX1pRtw7_Ghw",
//   authDomain: "nfcngo-41f2b.firebaseapp.com",
//   projectId: "nfcngo-41f2b",
//   storageBucket: "nfcngo-41f2b.appspot.com",
//   messagingSenderId: "644183700319",
//   appId: "1:644183700319:web:624a4ef661ecb08c7cbcea"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Auth and Google Auth Provider
// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();

// // Export the auth and googleProvider for use in other parts of your app
// export { auth, googleProvider };
