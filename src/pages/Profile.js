import React from "react";
import styled from "styled-components";
import { Navigate } from "react-router-dom";
import Tenant from "../components/profile/Tenant";
import Landlord from "../components/profile/Landlord";
import { useAuth } from "../context/AuthContext";
import { Wrapper } from "../components/common/Components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Firebase } from "../utils/firebase";

const NewWrapper = styled(Wrapper)`
  min-height: calc(100vh - 471px);
`;

function Profile() {
  const auth = Firebase.getAuth();
  const { currentUser } = useAuth();
  const [user, loading, error] = useAuthState(auth);

  function Render() {
    if (loading) {
      return <NewWrapper>資料處理中</NewWrapper>;
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

  return <NewWrapper>{Render()}</NewWrapper>;
}

export default Profile;
