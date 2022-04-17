import React from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Tenant from "../components/profile/Tenant";
import Landlord from "../components/profile/Landlord";
import { useAuth } from "../context/AuthContext";
import { Wrapper } from "../components/common/Components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Firebase } from "../utils/firebase";

function Profile() {
  const auth = Firebase.getAuth();
  const { currentUser } = useAuth();
  const [user, loading, error] = useAuthState(auth);

  function Render() {
    if (loading) {
      return <>loading...</>;
    }
    if (user) {
      return (currentUser ? currentUser.role : "") === 1 ? (
        <Tenant />
      ) : (currentUser ? currentUser.role : "") === 2 ? (
        <Landlord />
      ) : (
        ""
      );
    }
    if (error) {
      return <Navigate replace to="/" />;
    }
  }
  React.useEffect(() => {
    Render();
  }, [currentUser]);

  return (
    <>
      <Header />
      <Wrapper>{Render()}</Wrapper>
    </>
  );
}

export default Profile;
