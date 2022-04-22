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
import { useNavigate } from "react-router-dom";

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
  const userRoles = [
    { no: 1, name: "房客" },
    { no: 2, name: "屋主" },
  ];
  const navigate = useNavigate();

  const defaultImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/users%2Fdefault%2Fdefault?alt=media&token=381e1e3a-523e-4b92-b09e-871f4e0ca48e";

  function SignupAndQuickSetUp() {
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
    api
      .signUp(email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        const userId = userCredential.user.uid;
        const basicInfo = {
          uid: userId,
          role,
          email,
          password,
          profileImage: defaultImageUrl,
          name: "",
          alias: "",
          phone: "",
          evaluation: [],
          selfIntro: "",
          birthday: "",
          gender: 0,
          status: 0,
          collectionList: [],
        };
        api.SetDoc(
          api.Doc(api.DB, "users", userId),
          role === 1
            ? {
                ...basicInfo,
                jobTitle: "",
                hobbies: [],
                employment: 1,
              }
            : {
                ...basicInfo,
              }
        );
        navigate("/profile");
      })
      .catch((error) => {
        setErrMessage(api.handleError(error));
      });
  }

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
              {userRoles.map((userRole) => (
                <Role
                  key={userRole.name}
                  active={role === userRole.no}
                  onClick={() => setRole(userRole.no)}
                >
                  {userRole.name}
                </Role>
              ))}
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
        <NewButton onClick={SignupAndQuickSetUp}>註冊</NewButton>
      </Modal>
    </Overlay>
  );
}

export default SignUpModal;
