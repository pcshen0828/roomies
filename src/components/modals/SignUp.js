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
  Input,
  SmallLabel,
  SmallTitle,
  FlexWrapper,
} from "../common/Components";
import api from "../../utils/api";

const NewBody = styled(Body)`
  border: none;
  height: 350px;
  margin-bottom: 0;
`;

const NewButton = styled(Button)`
  align-self: center;
`;

const ErrorMessage = styled.div`
  color: #ed3636;
  font-size: 14px;
`;

const Role = styled.div`
  width: 90px;
  height: 35px;
  border: 1px solid #dadada;
  font-size: 14px;
  margin: 0 10px 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${(props) => (props.active ? "#dadada" : "")};
  &:hover {
    background: #dadada;
  }
`;

function SignUpModal({ setOpenSignUp }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPwd, setCofirmPwd] = React.useState("");
  const [errMessage, setErrMessage] = React.useState("");
  const [role, setRole] = React.useState(1);

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>註冊</Title>
          <CloseButton onClick={() => setOpenSignUp(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <form>
            <SmallTitle>選擇註冊身份</SmallTitle>
            <FlexWrapper>
              <Role active={role === 1} onClick={() => setRole(1)}>
                房客
              </Role>
              <Role active={role === 2} onClick={() => setRole(2)}>
                屋主
              </Role>
            </FlexWrapper>
            <SmallLabel htmlFor="email">帳號</SmallLabel>
            <Input
              placeholder="請輸入信箱"
              type="email"
              id="email"
              value={email}
              autoComplete="true"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setErrMessage("")}
            />
            <SmallLabel htmlFor="password">密碼</SmallLabel>
            <Input
              placeholder="請輸入密碼至少 6 位元"
              type="password"
              id="password"
              value={password}
              autoComplete="true"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setErrMessage("")}
            />
            <SmallLabel htmlFor="pwdcheck">確認密碼</SmallLabel>
            <Input
              placeholder="請再次輸入密碼"
              type="password"
              id="pwdcheck"
              value={confirmPwd}
              autoComplete="true"
              onChange={(e) => setCofirmPwd(e.target.value)}
              onFocus={() => setErrMessage("")}
            />
          </form>
          {errMessage && <ErrorMessage>{errMessage}</ErrorMessage>}
        </NewBody>
        <NewButton
          onClick={() => {
            if (!email.trim() || !password.trim()) {
              setErrMessage("每一欄位都需要輸入喔！");
              return;
            } else if (password.length < 6) {
              setErrMessage("密碼長度不足");
              return;
            } else if (!confirmPwd) {
              setErrMessage("請確認密碼");
              return;
            } else if (password !== confirmPwd) {
              setErrMessage("請再次確認密碼");
              return;
            }
            api.signUp(email, password, role);
          }}
        >
          註冊
        </NewButton>
      </Modal>
    </Overlay>
  );
}

export default SignUpModal;
