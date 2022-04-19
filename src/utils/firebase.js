import * as firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "../appkeys";

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
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

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
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  db: getFirestore(app),
  storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
};

export { Firebase };
