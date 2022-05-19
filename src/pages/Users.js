import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import api from "../utils/api";
import defaultScroll from "../utils/defaultScroll";

import styled from "styled-components";
import { Wrapper } from "../components/common/Components";
import UserInfo from "../components/users/UserInfo";
import Loader from "../components/common/Loader";
import Footer from "../components/layout/Footer";
import Skeleton from "react-loading-skeleton";

const NewWrapper = styled(Wrapper)`
  min-height: calc(100vh - 271px);
  @media screen and (max-width: 1279.98px) {
  }
`;

function User() {
  const { id } = useParams();
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [targetUser, setTargetUser] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    defaultScroll();

    api.getDataWithSingleQuery("users", "uid", "==", id).then((res) => {
      if (!res.length) return;
      if (!mounted) return;
      setTargetUser(res[0]);
      setLoaded(true);
    });

    return function cleanup() {
      mounted = false;
    };
  }, [id]);

  function generateSkeleton() {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "calc(100vh - 441px)",
          margin: "50px 0",
        }}
      >
        <Skeleton width={300} style={{ marginBottom: "20px" }} />
        <div style={{ width: "100%" }}>
          <Skeleton
            inline={true}
            width="60%"
            height={320}
            style={{ marginRight: "30px" }}
          />
          <Skeleton
            inline={true}
            width="30%"
            height={500}
            style={{ marginBottom: "20px" }}
          />
        </div>
      </div>
    );
  }

  function Render() {
    if (loading) {
      return <Loader />;
    }
    if (user) {
      return loaded ? (
        targetUser && targetUser.status === 1 ? (
          targetUser.role === 1 ? (
            <UserInfo user={targetUser} role={1} />
          ) : targetUser.role === 2 ? (
            <UserInfo user={targetUser} role={2} />
          ) : (
            ""
          )
        ) : (
          "查無用戶"
        )
      ) : (
        generateSkeleton()
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

export default User;
