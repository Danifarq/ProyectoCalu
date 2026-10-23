
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyCWrkw_zFkurVNbs6w-tCkDUEArP39fsLI",
  authDomain: "proyectocalu.firebaseapp.com",
  projectId: "proyectocalu",
  storageBucket: "proyectocalu.firebasestorage.app",
  messagingSenderId: "742941708510",
  appId: "1:742941708510:web:ad7d1bde5fb6d7a924324f",
  measurementId: "G-8HG7XNP7V0"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);