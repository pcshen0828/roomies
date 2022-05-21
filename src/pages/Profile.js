import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from "../context/AuthContext";
import { Firebase } from "../utils/firebase";
import scrollToTop from "../utils/scroll";

import styled from "styled-components";
import { FlexColumn, Title, Wrapper } from "../components/common/Components";
import Tenant from "../components/profile/Tenant";
import Landlord from "../components/profile/Landlord";
import Loader from "../components/common/Loader";
import Footer from "../components/layout/Footer";

const NewWrapper = styled(Wrapper)`
  min-height: calc(100vh - 301px);
`;

const LoaderWrapper = styled(FlexColumn)`
  width: 100%;
  min-height: calc(100vh - 80px - 121px);
  justify-content: center;
`;

function Profile() {
  const auth = Firebase.getAuth();
  const { currentUser } = useAuth();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    scrollToTop();
  }, []);

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
      <NewWrapper>
        <Title>會員專區</Title>
        {Render()}
      </NewWrapper>
      <Footer />
    </>
  );
}

export default Profile;
