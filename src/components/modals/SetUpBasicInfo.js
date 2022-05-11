import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import { TitleSub } from "../common/Components";
import { useNavigate } from "react-router-dom";

const HigherOverlay = styled(Overlay)`
  z-index: 1000;
`;

const NewModal = styled(Modal)`
  max-width: 600px;
  @media screen and (max-width: 575.98px) {
    width: 90%;
  }
`;

const NewHeader = styled(Header)`
  justify-content: flex-end;
`;

const NewBody = styled(Body)`
  padding: 10px 0 0 10px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
`;

const NewButton = styled(Button)`
  align-self: center;
  margin: 0 0 30px 0;
`;

const Required = styled.span`
  color: #ed3636;
`;

export default function BasicInfoModal({ role }) {
  const [toggle, setToggle] = React.useState(true);

  return (
    toggle && (
      <HigherOverlay out={false}>
        <NewModal>
          <NewHeader>
            <CloseButton onClick={() => setToggle(false)}>×</CloseButton>
          </NewHeader>
          <NewBody>
            <TitleSub>使用提示</TitleSub>
            <>
              <div>
                更新並公開你的職稱、興趣等個人資訊，開始連結更多的用戶！
              </div>
            </>
          </NewBody>
          <NewButton onClick={() => setToggle(false)}>關閉</NewButton>
        </NewModal>
      </HigherOverlay>
    )
  );
}
