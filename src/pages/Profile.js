import React from "react";
import styled from "styled-components";
import { Navigate } from "react-router-dom";
import Tenant from "../components/profile/Tenant";
import Landlord from "../components/profile/Landlord";
import { useAuth } from "../context/AuthContext";
import { FlexColumn, Wrapper } from "../components/common/Components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Firebase } from "../utils/firebase";
import Loader from "../components/common/Loader";
import Footer from "../components/layout/Footer";

const NewWrapper = styled(Wrapper)`
  min-height: calc(100vh - 471px);
`;

const LoaderWrapper = styled(FlexColumn)`
  width: 100%;
  min-height: calc(100vh - 471px);
  justify-content: center;
`;

function Profile() {
  const auth = Firebase.getAuth();
  const { currentUser } = useAuth();
  const [user, loading, error] = useAuthState(auth);

  function Render() {
    if (loading) {
      return (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      );
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
      return <>error</>;
    }
    return <Navigate replace to="/" />;
  }

  return (
    <>
      <NewWrapper>{Render()}</NewWrapper>
      <Footer />
    </>
  );
}

export default Profile;
