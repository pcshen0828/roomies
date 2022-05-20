import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FlexColumn } from "../common/Components";
import { Overlay, Modal, Header, CloseButton, Button } from "./ModalElements";

const NewHeader = styled(Header)`
  justify-content: flex-end;
`;

const Body = styled(FlexColumn)`
  align-items: center;
  margin-top: 40px;
`;

const Maintext = styled.div`
  font-weight: 700;
  margin-bottom: 20px;
`;

const NewButton = styled(Button)`
  margin-top: 50px;
  align-self: center;
`;

function ApplyJoinModal({ toggle }) {
  return (
    <Overlay out={false}>
      <Modal>
        <NewHeader>
          <CloseButton onClick={() => toggle()}>×</CloseButton>
        </NewHeader>
        <Body>
          <Maintext>已送出申請！</Maintext>
          <>待成員核准後，即可加入該租房隊伍</>
        </Body>
        <NewButton onClick={() => toggle()}>關閉</NewButton>
      </Modal>
    </Overlay>
  );
}

ApplyJoinModal.propTypes = {
  toggle: PropTypes.func.isRequired,
};

export default ApplyJoinModal;
