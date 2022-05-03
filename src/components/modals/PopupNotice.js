import React from "react";
import styled from "styled-components";
import { Overlay, Modal, Body, Button } from "./ModalElements";
import { FlexWrapper, Title } from "../common/Components";
import check from "../../images/check.svg";

const NewOverlay = styled(Overlay)`
  z-index: 1000;
`;

const NewModal = styled(Modal)`
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const ModalFlexWrapper = styled(FlexWrapper)`
  width: 90%;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const NewButton = styled(Button)`
  align-self: center;
  margin: 10px 0 0 0;
`;

const ConfirmImg = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
`;

export default function PopupNoticeModal({ message, toggle }) {
  return (
    <NewOverlay out={false}>
      <NewModal>
        <ModalFlexWrapper>
          <ConfirmImg alt="" src={check} />
          <Title>{message}</Title>
          <NewButton onClick={() => toggle(false)}>關閉</NewButton>
        </ModalFlexWrapper>
      </NewModal>
    </NewOverlay>
  );
}
