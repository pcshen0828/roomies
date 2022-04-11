import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBKk4sPmE9u5FWMwiXXS3xJncyDT35npZY",
  authDomain: "roomies-f03cd.firebaseapp.com",
  projectId: "roomies-f03cd",
  storageBucket: "roomies-f03cd.appspot.com",
  messagingSenderId: "749921302846",
  appId: "1:749921302846:web:1f92439e15c60c2c6b146f",
  measurementId: "G-T4VBXWYHYB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);