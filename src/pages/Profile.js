import React from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Tenant from "../components/profile/Tenant";
import Landlord from "../components/profile/Landlord";
import { useAuth } from "../context/AuthContext";
import { Wrapper } from "../components/common/Components";

function Profile() {
  const { currentUser } = useAuth();
  return (
    <>
      <Header />
      <Wrapper>
        {(currentUser ? currentUser.role : "") === 1 ? (
          <Tenant />
        ) : (currentUser ? currentUser.role : "") === 2 ? (
          <Landlord />
        ) : (
          <Navigate replace to="/" />
        )}
      </Wrapper>
    </>
  );
}

export default Profile;
