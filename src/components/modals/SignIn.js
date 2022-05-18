import React from "react";
import api from "../../utils/api";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Title,
  Body,
  Button,
} from "./ModalElements";
import { Input, SmallLabel } from "../common/Components";

const NewModal = styled(Modal)`
  max-width: 700px;
`;

const NewBody = styled(Body)`
  border: none;
  height: 200px;
`;

const NewButton = styled(Button)`
  align-self: center;
`;

const ErrorMessage = styled.div`
  color: #ed3636;
  font-size: 14px;
`;

function SignInModal({ setOpenSignIn }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errMessage, setErrMessage] = React.useState("");

  return (
    <Overlay out={false}>
      <NewModal>
        <Header>
          <Title>登入</Title>
          <CloseButton onClick={() => setOpenSignIn(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <form>
            <SmallLabel>帳號</SmallLabel>
            <Input
              placeholder="請輸入信箱"
              type="email"
              id="email"
              value={email}
              autoComplete="true"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setErrMessage("")}
            />
            <SmallLabel>密碼</SmallLabel>
            <Input
              placeholder="請輸入密碼"
              type="password"
              id="password"
              value={password}
              autoComplete="true"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setErrMessage("")}
            />
          </form>
          {errMessage && <ErrorMessage>{errMessage}</ErrorMessage>}
        </NewBody>
        <NewButton
          onClick={() => {
            if (!email.trim() || !password.trim()) return;
            api.signIn(email, password, setErrMessage);
          }}
        >
          登入
        </NewButton>
      </NewModal>
    </Overlay>
  );
}

export default SignInModal;
