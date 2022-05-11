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
import {
  SmallLabel,
  Input,
  Select,
  Textarea,
  SubTitle,
} from "../common/Components";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const HigherOverlay = styled(Overlay)`
  z-index: 1000;
`;

const NewModal = styled(Modal)`
  width: 80%;
`;

const NewBody = styled(Body)`
  height: 400px;
  padding: 10px 0 0 10px;
`;

const Required = styled.span`
  color: #ed3636;
`;

function TenantBasicInfoModal() {
  const [toggle, setToggle] = React.useState(true);
  const navigate = useNavigate();

  return (
    toggle && (
      <HigherOverlay out={false}>
        <NewModal>
          <Header>
            <Title>基本資料快速設定</Title>
            <CloseButton onClick={() => setToggle(false)}>×</CloseButton>
          </Header>
          <NewBody></NewBody>
          <Button onClick={() => setToggle(false)}>關閉</Button>
        </NewModal>
      </HigherOverlay>
    )
  );
}

function LandlordBasicInfoModal() {
  const [toggle, setToggle] = React.useState(true);

  return (
    toggle && (
      <HigherOverlay out={false}>
        <Modal>
          <Header>
            <Title>基本資料快速設定</Title>
            <CloseButton onClick={() => setToggle(false)}>×</CloseButton>
          </Header>
          <NewBody></NewBody>
          <Button onClick={() => setToggle(false)}>完成</Button>
        </Modal>
      </HigherOverlay>
    )
  );
}

export { TenantBasicInfoModal, LandlordBasicInfoModal };
