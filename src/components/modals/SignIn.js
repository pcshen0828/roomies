import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "../../utils/api";
import styled from "styled-components";
import { Overlay, Modal, CloseButton, Button } from "./ModalElements";
import {
  BackgroundImage,
  Bold,
  FlexColumn,
  FlexWrapper,
  Input,
  SmallLabel,
  SmallText,
  TitleSub,
} from "../common/Components";
import signin from "../../images/work.png";

const NewModal = styled(Modal)`
  max-width: 850px;
  width: 70%;
  max-height: 90%;
  @media screen and (max-width: 575.98px) {
    width: 90%;
  }
`;

const BodyWrapper = styled(FlexWrapper)`
  align-items: flex-start;
  width: 100%;
  height: 100%;
  justify-content: space-between;
`;

const BodyLeft = styled(BackgroundImage)`
  width: calc(40% - 8px);
  align-self: stretch;
  background: linear-gradient(
    180deg,
    rgba(66, 75, 90, 0.5) 0%,
    rgba(66, 75, 90, 0.3) 0.01%,
    rgba(193, 177, 138, 0.3) 100%
  );
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 10px;
  @media screen and (max-width: 995.98px) {
    display: none;
  } ;
`;

const BodyHeader = styled(FlexWrapper)`
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const NewTitle = styled(TitleSub)`
  margin-bottom: 0;
`;

const WelcomeText = styled(Bold)`
  font-size: 60px;
  background: linear-gradient(90.19deg, #424b5a 6.41%, #c1b18a 70.82%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  opacity: 0.3;
  margin-left: -16px;
`;

const NewBody = styled(FlexColumn)`
  align-items: flex-start;
  width: calc(60% - 40px);
  padding: 20px;

  @media screen and (max-width: 995.98px) {
    width: 100%;
  } ;
`;

const NewLabel = styled(SmallLabel)`
  margin-top: 20px;
`;

const NewInput = styled(Input)`
  width: 100%;
  margin-bottom: 10px;
`;

const Hint = styled(SmallText)`
  color: #a1aeb7;
  font-size: 12px;
`;

const NewButton = styled(Button)`
  margin: 10px 0 20px;
`;

const ErrorMessage = styled.div`
  color: #ed3636;
  font-size: 14px;
  min-height: 20px;
  margin-top: 10px;
`;

function SignInModal({ toggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");

  return (
    <Overlay out={false}>
      <NewModal>
        <BodyWrapper>
          <BodyLeft src={signin}>
            <WelcomeText>
              Welcome
              <br />
              Back!
            </WelcomeText>
          </BodyLeft>
          <NewBody>
            <BodyHeader>
              <NewTitle>會員登入</NewTitle>
              <CloseButton onClick={toggle}>×</CloseButton>
            </BodyHeader>
            <form>
              <NewLabel>帳號</NewLabel>
              <NewInput
                placeholder="請輸入信箱"
                type="email"
                id="email"
                value={email}
                autoComplete="true"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
              <Hint>房客測試帳號：henry@gmail.com</Hint>
              <Hint>屋主測試帳號：amy@gmail.com</Hint>
              <NewLabel>密碼</NewLabel>
              <NewInput
                placeholder="請輸入密碼"
                type="password"
                id="password"
                value={password}
                autoComplete="true"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
              <Hint>房客測試密碼：henry123</Hint>
              <Hint>屋主測試密碼：amy123</Hint>
            </form>
            <ErrorMessage>{errMessage}</ErrorMessage>
            <NewButton
              onClick={() => {
                if (!email.trim() || !password.trim()) return;
                api.signIn(email, password).catch((error) => {
                  setErrMessage(api.handleError(error));
                });
              }}
            >
              登入
            </NewButton>
          </NewBody>
        </BodyWrapper>
      </NewModal>
    </Overlay>
  );
}

SignInModal.propTypes = {
  toggle: PropTypes.func.isRequired,
};

export default SignInModal;
