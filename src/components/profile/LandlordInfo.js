import React, { Fragment, useState } from "react";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import {
  FlexWrapper,
  Input,
  Title,
  SmallLabel,
  Select,
  Textarea,
  Button1,
  FlexColumn,
  ProfileImage,
  Required,
} from "../common/Components";
import ChangeProfileImageModal from "../modals/ChangeProfileImage";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";

const Wrapper = styled(FlexColumn)`
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;
  align-items: stretch;
`;

const ImageWrapper = styled(FlexWrapper)`
  margin: 0 0 40px;
  font-size: 14px;
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
  }
`;

const Profile = styled(ProfileImage)`
  width: 100px;
  height: 100px;
  margin-right: 20px;
  flex-shrink: 0;

  @media screen and (max-width: 767.98px) {
    margin: 0 0 10px;
  }
`;

const ImageButton = styled(Button1)`
  width: 100px;
  height: 35px;
  font-size: 14px;
  margin-left: 20px;
  @media screen and (max-width: 767.98px) {
    margin: 10px 0 0;
  }
`;

const NewTitle = styled(Title)`
  font-size: 16px;
  margin-bottom: 20px;
`;

const InnerWrapper = styled(FlexWrapper)`
  align-items: flex-start;
  @media screen and (max-width: 1279.98px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Block = styled(FlexColumn)`
  width: 50%;
  @media screen and (max-width: 1279.98px) {
    width: 100%;
  }
`;

const NewButton = styled(Button1)`
  align-self: end;
  margin: 20px;
  @media screen and (max-width: 767.98px) {
    margin: 30px 0 20px;
  }
`;

const Loading = styled(Button1)`
  align-self: end;
  margin: 20px;
  cursor: not-allowed;
  background: #dadada;
  color: #424b5a;
  &:hover {
    background: #dadada;
  }
`;

function LandlordInfo() {
  const { currentUser } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [file, setFile] = useState();
  const { name, alias, gender, birthday, phone, selfIntro, profileImage } =
    currentUser;

  const [basicInfo, setBasicInfo] = useState({
    name,
    alias,
    gender,
    birthday,
    phone,
    selfIntro,
    profileImage,
  });

  const genders = [
    { name: "女", value: 0 },
    { name: "男", value: 1 },
  ];

  function updateUserData() {
    setIsLoading(true);
    api.updateDocData("users", currentUser.uid, {
      ...basicInfo,
    });
    setIsLoading(false);
    setSaved(true);
  }

  const inputRenderList = [
    {
      id: "name",
      name: "姓名全名",
      placeholder: "請填寫中文或英文全名",
      required: true,
    },
    {
      id: "alias",
      name: "暱稱",
      placeholder: "顯示在社群上的名字",
      required: true,
    },
    {
      id: "birthday",
      name: "生日",
      placeholder: "1991/01/01",
      required: false,
    },
    {
      id: "phone",
      name: "聯絡電話",
      placeholder: "1991/01/01",
      required: false,
    },
  ];

  function Render() {
    return (
      <>
        {saved && (
          <SuccessfullySavedModal toggle={setSaved} message="儲存成功！" />
        )}
        {openModal && (
          <ChangeProfileImageModal
            toggle={setOpenModal}
            setBasicInfo={setBasicInfo}
            file={file}
            setFile={setFile}
            setSaved={setSaved}
          />
        )}
        <Wrapper>
          <ImageWrapper>
            <Profile src={basicInfo.profileImage} />
            <>{currentUser.email}</>
            <ImageButton onClick={() => setOpenModal(true)}>
              更換大頭照
            </ImageButton>
          </ImageWrapper>
          <InnerWrapper>
            <Block>
              <NewTitle>基本資訊</NewTitle>
              {inputRenderList.map((info) => (
                <Fragment key={info.id}>
                  <SmallLabel htmlFor={info.id}>
                    {info.name}
                    {info.required && <Required>*</Required>}
                  </SmallLabel>
                  <Input
                    id={info.id}
                    placeholder={info.placeholder}
                    value={basicInfo[info.id]}
                    onChange={(e) => {
                      basicInfo[info.id] = e.target.value;
                      setBasicInfo({ ...basicInfo });
                    }}
                  />
                </Fragment>
              ))}

              <SmallLabel htmlFor="gender">
                生理性別<Required>*</Required>
              </SmallLabel>
              <Select
                id="gender"
                value={basicInfo.gender}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    gender: parseInt(e.target.value),
                  }))
                }
              >
                {genders.map((g, index) => (
                  <option key={index} value={g.value}>
                    {g.name}
                  </option>
                ))}
              </Select>
            </Block>

            <Block>
              <NewTitle>進階資訊</NewTitle>
              <SmallLabel htmlFor="intro">社群簡介</SmallLabel>
              <Textarea
                id="intro"
                placeholder="介紹自己，讓其他人更認識你！"
                value={basicInfo.selfIntro}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    selfIntro: e.target.value,
                  }))
                }
              />
            </Block>
          </InnerWrapper>
          {isLoading ? (
            <Loading>上傳中</Loading>
          ) : (
            <NewButton onClick={updateUserData}>儲存</NewButton>
          )}
        </Wrapper>
      </>
    );
  }

  return Render();
}

export default LandlordInfo;
