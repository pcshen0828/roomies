import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from "../context/AuthContext";
import { Firebase } from "../utils/firebase";
import scrollToTop from "../utils/scroll";

import styled from "styled-components";
import { FlexColumn, Title, Wrapper } from "../components/common/Components";
import ProfileListContent from "../components/profile/ProfileListContent";
import Loader from "../components/common/Loader";
import Footer from "../components/layout/Footer";
import { FooterHeight, HeaderHeight } from "../styles/GlobalStyle";

const NewWrapper = styled(Wrapper)`
  min-height: calc(100vh - ${HeaderHeight + FooterHeight}px);
`;

const LoaderWrapper = styled(FlexColumn)`
  width: 100%;
  min-height: calc(100vh - ${HeaderHeight + FooterHeight}px);
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
      return (
        <ProfileListContent
          role={currentUser?.role === 1 ? "tenant" : "landlord"}
        />
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
