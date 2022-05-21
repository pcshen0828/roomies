import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";
import { CloseButton, Header, Modal, Overlay, Title } from "./ModalElements";
import { Button1, FlexWrapper, RejectButton } from "../common/Components";

const NewModal = styled(Modal)`
  max-width: 600px;
`;

const Buttons = styled(FlexWrapper)`
  align-self: end;
  margin-right: 20px;
  height: 90px;
`;

export default function ConfirmChangeStatus({
  currentStatus,
  item,
  toggle,
  successfullySaved,
}) {
  function updateStatus() {
    const time = Firebase.Timestamp.fromDate(new Date());
    api.updateDocData("apartments", item.id, {
      updateTime: time,
      status: currentStatus === 0 ? 1 : 0,
    });
    toggle();
    successfullySaved();
  }
  return (
    <Overlay>
      <NewModal>
        <Header>
          <Title>確認更新？</Title>
          <CloseButton onClick={toggle}>×</CloseButton>
        </Header>
        <Buttons>
          <Button1 onClick={updateStatus}>確認</Button1>
          <RejectButton onClick={toggle}>取消</RejectButton>
        </Buttons>
      </NewModal>
    </Overlay>
  );
}

ConfirmChangeStatus.propTypes = {
  currentStatus: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  successfullySaved: PropTypes.func.isRequired,
};
