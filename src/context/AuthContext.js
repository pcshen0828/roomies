import React from "react";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";
import { useAuthState } from "react-firebase-hooks/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState();
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

  React.useEffect(() => {
    const unsubscribe = Firebase.onAuthStateChanged(auth, async (user) => {
      if (user) {
        const id = user.uid;
        const query = api.createQuery("users", "uid", "==", id);
        Firebase.onSnapshot(query, (snapshot) => {
          console.log("user info updated!");
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
