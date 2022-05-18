import React, { createContext, useContext, useEffect, useState } from "react";
import { Firebase } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import api from "../utils/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);

  async function signOut() {
    return Firebase.signOut(auth)
      .then((res) => {
        setCurrentUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const unsubscribe = Firebase.onAuthStateChanged(auth, async (user) => {
      if (user) {
        const id = user.uid;
        const query = api.createQuery("users", "uid", "==", id);
        Firebase.onSnapshot(query, (snapshot) => {
          setCurrentUser(snapshot.docs.map((doc) => doc.data())[0]);
        });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signOut,
    user,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
