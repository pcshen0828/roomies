import React, { useState } from "react";
import styled from "styled-components";
import { FlexWrapper, Button1 } from "../common/Components";
import SignInModal from "../modals/SignIn";
import SignUpModal from "../modals/SignUp";

const Signup = styled(Button1)`
  margin-left: 20px;
  @media screen and (max-width: 767.98px) {
    width: 90px;
    height: 35px;
    font-size: 14px;
    margin-left: 10px;
  }
`;

const SignIn = styled(Button1)`
  background: #fff;
  color: #424b5a;
  width: 90px;
  border: 1px solid #c1b18a;

  &:hover {
    color: #fff;
  }
  @media screen and (max-width: 767.98px) {
    width: 70px;
    height: 35px;
    font-size: 14px;
  }
`;

function NotLoggedIn() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  return (
    <>
      {openSignIn && <SignInModal toggle={() => setOpenSignIn(false)} />}
      {openSignUp && <SignUpModal toggle={() => setOpenSignUp(false)} />}
      <FlexWrapper>
        <SignIn onClick={() => setOpenSignIn(true)}>登入</SignIn>
        <Signup onClick={() => setOpenSignUp(true)}>註冊</Signup>
      </FlexWrapper>
    </>
  );
}

export default NotLoggedIn;
