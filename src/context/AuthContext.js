import React from "react";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";

const AuthContext = React.createContext();

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState();
  const auth = Firebase.getAuth();

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
        api.getDataWithSingleQuery("users", "uid", "==", id).then((res) => {
          setCurrentUser(res[0]);
        });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
