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

const HigherOverlay = styled(Overlay)`
  z-index: 1200;
`;

const NewModal = styled(Modal)`
  justify-content: center;
  align-items: center;
  height: 150px;
  padding: 0px 20px 0px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NewHeader = styled(Header)`
  width: 100%;
  align-items: center;
  height: 20px;
  margin-bottom: 10px;
`;

const ConfirmButton = styled(Button)`
  margin-bottom: 20px;
`;

export default function ConfirmBeforeActionModal({ message, action, toggle }) {
  return (
    <HigherOverlay out={false}>
      <NewModal>
        <NewHeader>
          <Title>{message}</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </NewHeader>
        <ConfirmButton
          onClick={() => {
            action();
            toggle(false);
          }}
        >
          確認
        </ConfirmButton>
      </NewModal>
    </HigherOverlay>
  );
}
