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
  SmallLabel,
  Input,
  Select,
  Textarea,
  SubTitle,
} from "../common/Components";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const HigherOverlay = styled(Overlay)`
  z-index: 1000;
`;

const NewModal = styled(Modal)`
  width: 80%;
`;

const NewBody = styled(Body)`
  height: 400px;
  padding: 10px 0 0 10px;
`;

const Required = styled.span`
  color: #ed3636;
`;

const genders = [
  { name: "女", value: 0 },
  { name: "男", value: 1 },
];

function TenantBasicInfoModal({
  user,
  name,
  setName,
  alias,
  setAlias,
  gender,
  setGender,
  jobTitle,
  setJobTitle,
  selfIntro,
  setSelfIntro,
}) {
  const [toggle, setToggle] = React.useState(true);
  const navigate = useNavigate();

  function trimString(string) {
    return string.trim();
  }

  function SetupUserInfo() {
    if (!name.trim() || !alias.trim() || !jobTitle.trim()) return;
    api
      .updateDocData("users", user.uid, {
        name: trimString(name),
        alias: trimString(alias),
        gender,
        jobTitle: trimString(jobTitle),
        selfIntro: trimString(selfIntro),
      })
      .then(() => {
        setToggle(false);
        navigate("/profile/info");
      });
  }

  return (
    toggle && (
      <HigherOverlay>
        <NewModal>
          <Header>
            <Title>基本資料快速設定</Title>
            <CloseButton onClick={() => setToggle(false)}>×</CloseButton>
          </Header>
          <NewBody>
            <SmallLabel htmlFor="fullname">
              姓名全名<Required>*</Required>
            </SmallLabel>
            <Input
              id="fullname"
              placeholder="請填寫中文或英文全名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <SmallLabel htmlFor="alias">
              暱稱<Required>*</Required>
            </SmallLabel>
            <Input
              id="alias"
              placeholder="顯示在社群上的名字"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <SmallLabel htmlFor="gender">
              生理性別<Required>*</Required>
            </SmallLabel>
            <Select
              id="gender"
              value={gender}
              onChange={(e) => setGender(parseInt(e.target.value))}
            >
              {genders.map((g, index) => (
                <option key={index} value={g.value}>
                  {g.name}
                </option>
              ))}
            </Select>
            <SmallLabel htmlFor="job">
              職稱<Required>*</Required>
            </SmallLabel>
            <Input
              id="job"
              placeholder="工程師"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <SmallLabel htmlFor="intro">社群簡介</SmallLabel>
            <Textarea
              id="intro"
              placeholder="介紹自己，讓其他人快速認識你！"
              value={selfIntro}
              onChange={(e) => setSelfIntro(e.target.value)}
            />
          </NewBody>
          <Button onClick={SetupUserInfo}>完成</Button>
        </NewModal>
      </HigherOverlay>
    )
  );
}

function LandlordBasicInfoModal({
  user,
  name,
  setName,
  alias,
  setAlias,
  gender,
  setGender,
  selfIntro,
  setSelfIntro,
}) {
  const [toggle, setToggle] = React.useState(true);

  function trimString(string) {
    return string.trim();
  }

  function SetupUserInfo() {
    if (!name.trim() || !alias.trim()) return;
    console.log(name, alias, gender, selfIntro);
    api
      .updateDocData("users", user.uid, {
        name: trimString(name),
        alias: trimString(alias),
        gender,
        selfIntro: trimString(selfIntro),
      })
      .then(() => {
        setToggle(false);
      });
  }

  return (
    toggle && (
      <HigherOverlay>
        <Modal>
          <Header>
            <Title>基本資料設定</Title>
            <CloseButton onClick={() => setToggle(false)}>×</CloseButton>
          </Header>
          <NewBody>
            <SmallLabel htmlFor="fullname">
              姓名全名<Required>*</Required>
            </SmallLabel>
            <Input
              id="fullname"
              placeholder="請填寫中文或英文全名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <SmallLabel htmlFor="alias">
              暱稱<Required>*</Required>
            </SmallLabel>
            <Input
              id="alias"
              placeholder="顯示在社群上的名字"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <SmallLabel htmlFor="gender">
              生理性別<Required>*</Required>
            </SmallLabel>
            <Select
              id="gender"
              value={gender}
              onChange={(e) => setGender(parseInt(e.target.value))}
            >
              {genders.map((g, index) => (
                <option key={index} value={g.value}>
                  {g.name}
                </option>
              ))}
            </Select>
            <SmallLabel htmlFor="intro">社群簡介</SmallLabel>
            <Textarea
              id="intro"
              placeholder="介紹自己，讓其他人快速認識你！"
              value={selfIntro}
              onChange={(e) => setSelfIntro(e.target.value)}
            />
          </NewBody>
          <Button onClick={SetupUserInfo}>完成</Button>
        </Modal>
      </HigherOverlay>
    )
  );
}

export { TenantBasicInfoModal, LandlordBasicInfoModal };
