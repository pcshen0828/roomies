import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { mainColor, subColor } from "../../styles/GlobalStyle";
import {
  Body,
  Button,
  CloseButton,
  Header,
  Modal,
  Overlay,
  Title,
} from "./ModalElements";
import alert from "../../images/alert.svg";

const NewBody = styled(Body)`
  border: none;
  height: auto;
  line-height: 150%;
  margin-bottom: -10px;
  display: flex;
  flex-direction: column;
`;

const BoldSpan = styled.span`
  font-weight: 700;
`;

const EditLink = styled(Link)`
  display: block;
  align-self: center;
  width: auto;
  text-decoration: underline;
  color: ${mainColor};
  margin: 20px 0 0;
  &:hover {
    color: ${subColor};
  }
`;

const Alert = styled.img`
  width: 60px;
  height: 60px;
  margin: 10px 0 20px;
  align-self: center;
`;

export default function CompleteProfileBeforeJoinModal({ toggle }) {
  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>貼心提醒</Title>
          <CloseButton onClick={toggle}>×</CloseButton>
        </Header>
        <NewBody>
          <Alert src={alert} />
          <div>
            加入房源社團之前，請確認完成填寫
            <BoldSpan>職稱、興趣、姓名</BoldSpan>
            等個人資料，並同意<BoldSpan>公開你的個人資訊</BoldSpan>
            ，讓社團中的其他成員可以更了解你！
          </div>
          <EditLink to="/profile/info/edit">前往會員專區進行編輯</EditLink>
        </NewBody>
        <Button onClick={toggle}>關閉</Button>
      </Modal>
    </Overlay>
  );
}

CompleteProfileBeforeJoinModal.propTypes = {
  toggle: PropTypes.func.isRequired,
};
