import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import api from "../utils/api";
import scrollToTop from "../utils/scroll";

import styled from "styled-components";
import { SkeletonWrapper, Wrapper } from "../components/common/Components";
import UserInfo from "../components/users/UserInfo";
import Loader from "../components/common/Loader";
import Footer from "../components/layout/Footer";
import Skeleton from "react-loading-skeleton";

const NewWrapper = styled(Wrapper)`
  min-height: calc(100vh - 271px);
  @media screen and (max-width: 1279.98px) {
  }
`;

const NewSkeletonWrapper = styled(SkeletonWrapper)`
  min-height: calc(100vh - 441px);
  margin: 50px 0;
`;

function User() {
  const { id } = useParams();
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [targetUser, setTargetUser] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    scrollToTop();

    api
      .getDataWithSingleQuery("users", "uid", "==", id)
      .then((queriedUsers) => {
        if (!queriedUsers.length) return;
        if (!mounted) return;
        setTargetUser(queriedUsers[0]);
        setLoaded(true);
      });

    return function cleanup() {
      mounted = false;
    };
  }, [id]);

  function generateSkeleton() {
    return (
      <NewSkeletonWrapper>
        <Skeleton width={300} style={{ marginBottom: "20px" }} />
        <SkeletonWrapper>
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
        </SkeletonWrapper>
      </NewSkeletonWrapper>
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
          "????????????"
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
