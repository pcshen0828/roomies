import React from "react";
import styled from "styled-components";
import Header from "../components/layout/Header";
import { Wrapper, Title } from "../components/common/Components";
import api from "../utils/api";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";

const NewWrapper = styled(Wrapper)`
  align-items: flex-start;
`;

const NewTitle = styled(Title)`
  margin: 20px 0 30px;
`;

function Community() {
  const { currentUser } = useAuth();
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [users, setUsers] = React.useState();

  function Render() {
    if (loading) {
      return <>loading...</>;
    }
    if (user) {
      return (
        <NewWrapper>
          <NewTitle>在這裡，找到適合共居的夥伴</NewTitle>
        </NewWrapper>
      );
    }
    if (error) {
      return <>error</>;
    }
    return <Navigate replace to="/" />;
  }

  React.useEffect(() => {
    let mounted = true;
    api.getDataWithSingleQuery("users", "status", "==", 1).then((res) => {
      console.log(res);
      if (!mounted) return;
      setUsers(res);
    });
    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Header />
      {Render()}
    </>
  );
}

export default Community;
