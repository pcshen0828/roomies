import React from "react";
import styled from "styled-components";
import { FlexWrapper, RejectButton } from "../common/Components";
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
  height: 160px;
  padding: 0px 20px 0px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NewHeader = styled(Header)`
  width: 100%;
  align-items: center;
  height: 60px;
`;

const ButtonsWrapper = styled(FlexWrapper)`
  align-self: end;
`;

const ConfirmButton = styled(Button)`
  margin: 20px 0 20px 10px;
`;

export default function ConfirmBeforeActionModal({ message, action, toggle }) {
  return (
    <HigherOverlay out={false}>
      <NewModal>
        <NewHeader>
          <Title>{message}</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </NewHeader>
        <ButtonsWrapper>
          <RejectButton onClick={() => toggle(false)}>取消</RejectButton>
          <ConfirmButton
            onClick={() => {
              action();
              toggle(false);
            }}
          >
            確認
          </ConfirmButton>
        </ButtonsWrapper>
      </NewModal>
    </HigherOverlay>
  );
}
