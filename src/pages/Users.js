import React from "react";
import styled from "styled-components";
import Header from "../components/layout/Header";
import { Wrapper } from "../components/common/Components";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import UserInfo from "../components/users/UserInfo";

function User() {
  const { id } = useParams();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    api.getDataWithSingleQuery("users", "uid", "==", id).then((res) => {
      console.log(res);
      setUser(res[0]);
    });
  }, []);

  return (
    <>
      <Header />
      <Wrapper>
        {user ? (
          user.role === 1 ? (
            <UserInfo user={user} role={1} />
          ) : user.role === 2 ? (
            <UserInfo user={user} role={2} />
          ) : (
            ""
          )
        ) : (
          "查無用戶"
        )}
      </Wrapper>
    </>
  );
}

export default User;
