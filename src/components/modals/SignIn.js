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
import { Input, SmallLabel } from "../common/Components";
import api from "../../utils/api";

const NewBody = styled(Body)`
  border: none;
  height: 200px;
`;

const NewButton = styled(Button)`
  align-self: center;
`;

function SignInModal({ setOpenSignIn }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>登入</Title>
          <CloseButton onClick={() => setOpenSignIn(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallLabel>帳號</SmallLabel>
          <Input placeholder="請輸入信箱" />
          <SmallLabel>密碼</SmallLabel>
          <Input placeholder="請輸入密碼" />
        </NewBody>
        <NewButton
          onClick={() => {
            if (!email.trim() || !password.trim()) return;
            api.signIn();
          }}
        >
          登入
        </NewButton>
      </Modal>
    </Overlay>
  );
}

export default SignInModal;
