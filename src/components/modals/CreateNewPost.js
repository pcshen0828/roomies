import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";

const NewModal = styled(Modal)`
  max-width: 700px;

  @media screen and (max-width: 767.98px) {
    width: 90%;
  }
`;

const NewBody = styled(Body)`
  overflow-y: visible;
  border: none;
`;

export default function CreateNewPostModal({ toggle }) {
  const [openConfirm, setOpenConfirm] = React.useState(false);

  return (
    <Overlay>
      {openConfirm && (
        <ConfirmBeforeActionModal
          toggle={setOpenConfirm}
          message="尚未發佈，確認離開？"
          action={() => {
            toggle(false);
          }}
        />
      )}
      <NewModal>
        <Header>
          <Title>建立貼文</Title>
          <CloseButton
            onClick={() => {
              setOpenConfirm(true);
            }}
          >
            ×
          </CloseButton>
        </Header>
        <NewBody></NewBody>
        <Button>發佈</Button>
      </NewModal>
    </Overlay>
  );
}
