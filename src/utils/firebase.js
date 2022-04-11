import * as firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKk4sPmE9u5FWMwiXXS3xJncyDT35npZY",
  authDomain: "roomies-f03cd.firebaseapp.com",
  projectId: "roomies-f03cd",
  storageBucket: "roomies-f03cd.appspot.com",
  messagingSenderId: "749921302846",
  appId: "1:749921302846:web:1f92439e15c60c2c6b146f",
  measurementId: "G-T4VBXWYHYB",
};

const app = firebase.initializeApp(firebaseConfig);
const amnalytices = getAnalytics(app);
const storage = getStorage();

const Firebase = {
  firebase,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  db: getFirestore(app),
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
};

export { Firebase };
