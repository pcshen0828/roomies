import React from "react";
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

function SignUpModal({ setOpenSignUp }) {
  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>註冊</Title>
          <CloseButton onClick={() => setOpenSignUp(false)}>×</CloseButton>
        </Header>
        <Body>
          <Button>註冊</Button>
        </Body>
      </Modal>
    </Overlay>
  );
}

export default SignUpModal;
