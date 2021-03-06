import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

import styled from "styled-components";
import { mainColor, subColor } from "../../styles/GlobalStyle";
import { Overlay, Modal, CloseButton, Button } from "./ModalElements";
import {
  Input,
  SmallLabel,
  SmallTitle,
  FlexWrapper,
  FlexColumn,
  TitleSub,
  BackgroundImage,
  Bold,
} from "../common/Components";
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
  width: 100%;
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

const BodyLeft = styled(BackgroundImage)`
  width: calc(40% - 18px);
  align-self: stretch;
  background: linear-gradient(
    180deg,
    rgba(66, 75, 90, 0.5) 0%,
    rgba(66, 75, 90, 0.3) 0.01%,
    rgba(193, 177, 138, 0.3) 100%
  );
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 10px;
  @media screen and (max-width: 995.98px) {
    display: none;
  } ;
`;

const WelcomeText = styled(Bold)`
  font-size: 60px;
  background: linear-gradient(90.19deg, #424b5a 6.41%, #c1b18a 70.82%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  opacity: 0.3;
  margin-left: -16px;
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

const Role = styled(FlexWrapper)`
  width: 90px;
  height: 35px;
  border: 1px solid ${subColor};
  font-size: 14px;
  margin: 0 10px 10px 0;
  justify-content: center;
  cursor: pointer;
  background: ${(props) => (props.active ? subColor : "")};
  color: ${(props) => (props.active ? "#fff" : mainColor)};
  &:hover {
    background: ${subColor};
    color: #fff;
  }
`;

function SignUpModal({ toggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setCofirmPwd] = useState("");
  const [alias, setAlias] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [role, setRole] = useState(1);
  const userRoles = [
    { no: 1, name: "??????" },
    { no: 2, name: "??????" },
  ];
  const navigate = useNavigate();

  const defaultImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/users%2Fdefault%2Fdefault?alt=media&token=381e1e3a-523e-4b92-b09e-871f4e0ca48e";

  function SignupAndQuickSetUp() {
    if (!email.trim() || !password.trim() || !alias.trim()) {
      setErrMessage("?????????????????????????????????");
      return;
    } else if (password.length < 6) {
      setErrMessage("??????????????????");
      return;
    } else if (!confirmPwd) {
      setErrMessage("???????????????");
      return;
    } else if (password !== confirmPwd) {
      setErrMessage("?????????????????????");
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
          <BodyLeft src={signup}>
            <WelcomeText>
              Welcome
              <br />
              to
              <br />
              Roomies
            </WelcomeText>
          </BodyLeft>
          <NewBody>
            <BodyHeader>
              <NewTitle>????????????</NewTitle>
              <CloseButton onClick={toggle}>??</CloseButton>
            </BodyHeader>
            <SmallTitle>?????????????????????</SmallTitle>
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
              <SmallLabel htmlFor="email">??????</SmallLabel>
              <NewInput
                placeholder="???????????????"
                type="email"
                id="email"
                value={email}
                autoComplete="true"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
              <SmallLabel htmlFor="name">??????</SmallLabel>
              <NewInput
                placeholder="?????????????????????????????????"
                type="text"
                id="name"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
              <SmallLabel htmlFor="password">??????</SmallLabel>
              <NewInput
                placeholder="????????????????????? 6 ??????"
                type="password"
                id="password"
                value={password}
                autoComplete="true"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
              <SmallLabel htmlFor="pwdcheck">????????????</SmallLabel>
              <NewInput
                placeholder="?????????????????????"
                type="password"
                id="pwdcheck"
                value={confirmPwd}
                autoComplete="true"
                onChange={(e) => setCofirmPwd(e.target.value)}
                onFocus={() => setErrMessage("")}
              />
            </form>
            <ErrorMessage>{errMessage && errMessage}</ErrorMessage>
            <NewButton onClick={SignupAndQuickSetUp}>??????</NewButton>
          </NewBody>
        </BodyWrapper>
      </NewModal>
    </Overlay>
  );
}

SignUpModal.propTypes = {
  toggle: PropTypes.func.isRequired,
};

export default SignUpModal;
