import React from "react";
import PropTypes from "prop-types";
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
  min-height: 200px;
  padding: 0px 20px 0px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: visible;
`;

const NewHeader = styled(Header)`
  width: 100%;
  align-items: center;
  height: auto;
`;

const ContentWrapper = styled(FlexWrapper)`
  width: 100%;
  padding: 20px 0 0;
`;

const ButtonsWrapper = styled(FlexWrapper)`
  align-self: end;
`;

const ConfirmButton = styled(Button)`
  margin: 20px 0 20px 10px;
  @media screen and (max-width: 767.98px) {
    font-size: 14px;
  }
`;

export default function ConfirmBeforeActionModal({ message, action, toggle }) {
  return (
    <HigherOverlay out={false}>
      <NewModal>
        <NewHeader>
          <Title>再次確認</Title>
          <CloseButton onClick={toggle}>×</CloseButton>
        </NewHeader>
        <ContentWrapper>{message}</ContentWrapper>
        <ButtonsWrapper>
          <RejectButton onClick={toggle}>取消</RejectButton>
          <ConfirmButton
            onClick={() => {
              action();
              toggle();
            }}
          >
            確認
          </ConfirmButton>
        </ButtonsWrapper>
      </NewModal>
    </HigherOverlay>
  );
}

ConfirmBeforeActionModal.propTypes = {
  message: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};
