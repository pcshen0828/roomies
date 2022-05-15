import React from "react";
import styled from "styled-components";
import { Overlay, Modal, CloseButton, Button } from "./ModalElements";
import {
  Input,
  SmallLabel,
  SmallTitle,
  FlexWrapper,
  FlexColumn,
  TitleSub,
} from "../common/Components";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { mainColor, subColor } from "../../styles/GlobalStyle";
import signup from "../../images/tree.png";

const NewModal = styled(Modal)`
  max-width: 850px;
  width: 70%;
  max-height: 90%;
  @media screen and (max-width: 575.98px) {
    width: 90%;
  }
`;

const BodyWrapper = styled(FlexWrapper)`
  align-items: flex-start;
  height: 100%;
  justify-content: space-between;
`;

const NewBody = styled(FlexColumn)`
  align-items: flex-start;
  width: calc(60% - 40px);
  padding: 20px;

  @media screen and (max-width: 995.98px) {
    width: 100%;
  } ;
`;

const BodyHeader = styled(FlexWrapper)`
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
`;

const NewTitle = styled(TitleSub)`
  margin-bottom: 0;
`;

const BodyLeft = styled.div`
  width: calc(40% - 8px);
  align-self: stretch;
  opacity: 0.2;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.2);
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @media screen and (max-width: 995.98px) {
    display: none;
  } ;
`;

const NewInput = styled(Input)`
  width: calc(100% - 40px);
`;

const NewButton = styled(Button)`
  margin: 0 20px 20px 0;
`;

const ErrorMessage = styled.div`
  color: #ed3636;
  font-size: 14px;
  height: 20px;
`;

const Role = styled.div`
  width: 90px;
  height: 35px;
  border: 1px solid ${subColor};
  font-size: 14px;
  margin: 0 10px 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${(props) => (props.active ? subColor : "")};
  color: ${(props) => (props.active ? "#fff" : mainColor)};
  &:hover {
    background: ${subColor};
    color: #fff;
  }
`;

function SignUpModal({ setOpenSignUp }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPwd, setCofirmPwd] = React.useState("");
  const [alias, setAlias] = React.useState("");
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
    if (!email.trim() || !password.trim() || !alias.trim()) {
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
        const userId = userCredential.user.uid;
        const basicInfo = {
          uid: userId,
          role,
          email,
          password,
          profileImage: defaultImageUrl,
          coverImage: "",
          name: "",
          alias,
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
        navigate("/profile/info/edit");
      })
      .catch((error) => {
        setErrMessage(api.handleError(error));
      });
  }

  return (
    <Overlay out={false}>
      <NewModal>
        <BodyWrapper>
          <BodyLeft src={signup}></BodyLeft>
          <NewBody>
            <BodyHeader>
              <NewTitle>註冊會員</NewTitle>
              <CloseButton onClick={() => setOpenSignUp(false)}>×</CloseButton>
            </BodyHeader>
            <SmallTitle>請選擇註冊身份</SmallTitle>
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
            <form>
              <SmallLabel htmlFor="email">帳號</SmallLabel>
              <NewInput
                placeholder="請輸入信箱"
                type="email"
                id="email"
                value={email}
                autoComplete="true"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
              <SmallLabel htmlFor="name">姓名</SmallLabel>
              <NewInput
                placeholder="希望我們怎麼稱呼你呢？"
                type="text"
                id="name"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
              <SmallLabel htmlFor="password">密碼</SmallLabel>
              <NewInput
                placeholder="請輸入密碼至少 6 位元"
                type="password"
                id="password"
                value={password}
                autoComplete="true"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
              <SmallLabel htmlFor="pwdcheck">確認密碼</SmallLabel>
              <NewInput
                placeholder="請再次輸入密碼"
                type="password"
                id="pwdcheck"
                value={confirmPwd}
                autoComplete="true"
                onChange={(e) => setCofirmPwd(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
            </form>
            <ErrorMessage>{errMessage && errMessage}</ErrorMessage>
            <NewButton onClick={SignupAndQuickSetUp}>註冊</NewButton>
          </NewBody>
        </BodyWrapper>
      </NewModal>
    </Overlay>
  );
}

export default SignUpModal;
