import React from "react";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";

const AuthContext = React.createContext();

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const auth = Firebase.getAuth();

  async function signOut() {
    return Firebase.signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  }

  React.useEffect(() => {
    const unsubscribe = Firebase.onAuthStateChanged(auth, async (user) => {
      if (user) {
        const id = user.uid;
        api.getDataWithSingleQuery("users", "uid", "==", id).then((res) => {
          setCurrentUser(res[0]);
          setLoading(false);
        });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
