const { initializeApp } = require("firebase/app");
const { getDatabase, ref } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyC1873SWvVV7BVtMsiOgHn2BhavQwx4D8o",
  authDomain: "mixbeats-da143.firebaseapp.com",
  databaseURL: "https://mixbeats-da143-default-rtdb.firebaseio.com",
  projectId: "mixbeats-da143",
  storageBucket: "mixbeats-da143.firebasestorage.app",
  messagingSenderId: "234984118517",
  appId: "1:234984118517:web:b5837eb622796a0be0cdbc",
  measurementId: "G-QJRWEKG97W"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db, ref };

