// ============================================================
// FIREBASE CONFIG — replace the values below with YOUR OWN keys
// from the Firebase Console (Project Settings > General > Your apps)
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyA5zSDSQgvyI42lopfnN0ilg8fXAdyKG-A",
  authDomain: "kinesis-c52f6.firebaseapp.com",
  projectId: "kinesis-c52f6",
  storageBucket: "kinesis-c52f6.firebasestorage.app",
  messagingSenderId: "767097278169",
  appId: "1:767097278169:web:61871f4b50f74a9372f8c8",
  measurementId: "G-S6P4B00FM9"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
