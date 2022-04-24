import React from "react";
import styled from "styled-components";
import { FlexWrapper, Button1 } from "../common/Components";
import SignInModal from "../modals/SignIn";
import SignUpModal from "../modals/SignUp";

const Signup = styled(Button1)`
  margin-left: 20px;
`;

const SignIn = styled(Button1)`
  background: #fff;
  color: #424b5a;
  width: 90px;
  border: 1px solid #c1b18a;

  &:hover {
    color: #fff;
  }
`;

function NotLoggedIn() {
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const [openSignUp, setOpenSignUp] = React.useState(false);

  return (
    <>
      {openSignIn && <SignInModal setOpenSignIn={setOpenSignIn} />}
      {openSignUp && <SignUpModal setOpenSignUp={setOpenSignUp} />}
      <FlexWrapper>
        <SignIn onClick={() => setOpenSignIn(true)}>登入</SignIn>
        <Signup onClick={() => setOpenSignUp(true)}>註冊</Signup>
      </FlexWrapper>
    </>
  );
}

export default NotLoggedIn;
