// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyBycr1HdRbmZtUCmr9hICvcXecvq6moMmo",
  authDomain: "reserv-5c953.firebaseapp.com",
  projectId: "reserv-5c953",
  storageBucket: "reserv-5c953.appspot.com",
  messagingSenderId: "216154940381",
  appId: "1:216154940381:web:0f61e20977edd5b517cc34",
  measurementId: "G-W0JGWJN3WM"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
