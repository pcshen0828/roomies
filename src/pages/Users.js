import React from "react";
import Header from "../components/layout/Header";
import { Wrapper } from "../components/common/Components";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import UserInfo from "../components/users/UserInfo";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";

function User() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [targetUser, setTargetUser] = React.useState();

  React.useEffect(() => {
    let mounted = true;
    api.getDataWithSingleQuery("users", "uid", "==", id).then((res) => {
      console.log(res);
      if (!res.length) return;
      if (res[0].status === 0) {
        <Navigate replace to="/" />;
      }
      if (!mounted) return;
      setTargetUser(res[0]);
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function Render() {
    if (loading) {
      return <>loading...</>;
    }
    if (user) {
      return targetUser ? (
        targetUser.role === 1 ? (
          <UserInfo user={targetUser} role={1} />
        ) : targetUser.role === 2 ? (
          <UserInfo user={targetUser} role={2} />
        ) : (
          ""
        )
      ) : (
        "查無用戶"
      );
    }
    if (error) {
      return <>error</>;
    }
    return <Navigate replace to="/" />;
  }

  return (
    <>
      <Header />
      <Wrapper>{Render()}</Wrapper>
    </>
  );
}

export default User;
