import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Button,
} from "./ModalElements";

const NewHeader = styled(Header)`
  justify-content: center;
  padding: 40px 0 20px;
`;
const CenterButton = styled(Button)`
  align-self: center;
  margin: 20px 0;
`;

function SignInFirstModal({ setToggle }) {
  return (
    <Overlay out={false}>
      <Modal>
        <NewHeader>
          <Title>請先登入</Title>
        </NewHeader>
        <CenterButton onClick={() => setToggle(false)}>確認</CenterButton>
      </Modal>
    </Overlay>
  );
}
export default SignInFirstModal;
