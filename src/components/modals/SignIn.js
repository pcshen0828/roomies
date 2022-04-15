import React from "react";
import { Firebase } from "../../utils/firebase";
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
import { Input, SmallTitle } from "../common/Components";

const NewBody = styled(Body)`
  border: none;
  height: 200px;
`;

const NewButton = styled(Button)`
  align-self: center;
`;

function SignInModal({ setOpenSignIn }) {
  function signIn() {}

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>登入</Title>
          <CloseButton onClick={() => setOpenSignIn(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle>帳號</SmallTitle>
          <Input placeholder="請輸入信箱" />
          <SmallTitle>密碼</SmallTitle>
          <Input placeholder="請輸入密碼" />
        </NewBody>
        <NewButton onClick={signIn}>登入</NewButton>
      </Modal>
    </Overlay>
  );
}

export default SignInModal;
