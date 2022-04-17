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

function EditPropertyModal({ toggle, apartment }) {
  React.useEffect(() => {}, []);

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>編輯房源資訊</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <Body></Body>
        <Button>更新</Button>
      </Modal>
    </Overlay>
  );
}

export default EditPropertyModal;
