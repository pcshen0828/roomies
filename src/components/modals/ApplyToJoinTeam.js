import React from "react";
import styled from "styled-components";
import { Overlay, Modal, Header, CloseButton, Button } from "./ModalElements";

const NewHeader = styled(Header)`
  justify-content: flex-end;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
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
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </NewHeader>
        <Body>
          <Maintext>已送出申請！</Maintext>
          <>待成員核准後，即可加入該看房隊伍</>
        </Body>
        <NewButton onClick={() => toggle(false)}>關閉</NewButton>
      </Modal>
    </Overlay>
  );
}

export default ApplyJoinModal;
