import React, { useState } from "react";
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

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

const Required = styled.span`
  color: #ed3636;
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
  const [name, setName] = useState(currentUser.name);
  const [alias, setAlias] = useState(currentUser.alias);
  const [gender, setGender] = useState(currentUser.gender);
  const [birthday, setBirthday] = useState(currentUser.birthday);
  const [phone, setPhone] = useState(currentUser.phone);
  const [selfIntro, setSelfIntro] = useState(currentUser.selfIntro);
  const [profileImage, setProfileImage] = useState(currentUser.profileImage);

  const genders = [
    { name: "女", value: 0 },
    { name: "男", value: 1 },
  ];

  function updateUserData() {
    setIsLoading(true);
    if (file) {
      const storageRef = Firebase.ref(
        Firebase.storage,
        `users/${currentUser.uid}/profile`
      );
      Firebase.uploadBytes(storageRef, file).then((snapshot) => {
        Firebase.getDownloadURL(snapshot.ref).then((downloadURL) => {
          api.updateDocData("users", currentUser.uid, {
            ...currentUser,
            name,
            alias,
            gender,
            birthday,
            phone,
            selfIntro,
            profileImage: downloadURL,
          });
          setIsLoading(false);
        });
      });
    } else {
      api.updateDocData("users", currentUser.uid, {
        ...currentUser,
        name,
        alias,
        gender,
        birthday,
        phone,
        selfIntro,
      });
      setIsLoading(false);
      setSaved(true);
    }
  }

  function Render() {
    return (
      <>
        {saved && (
          <SuccessfullySavedModal toggle={setSaved} message="儲存成功！" />
        )}
        {/* {!currentUser.name && <BasicInfoModal role="landlord" />} */}
        {openModal && (
          <ChangeProfileImageModal
            toggle={setOpenModal}
            setProfileImage={setProfileImage}
            file={file}
            setFile={setFile}
          />
        )}
        <Wrapper>
          <ImageWrapper>
            <ProfileImage src={profileImage} />
            <>{currentUser.email}</>
            <ImageButton onClick={() => setOpenModal(true)}>
              更換大頭照
            </ImageButton>
          </ImageWrapper>
          <InnerWrapper>
            <Block>
              <NewTitle>基本資訊</NewTitle>
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
              <SmallLabel htmlFor="birth">
                生日<Required>*</Required>
              </SmallLabel>
              <Input
                id="birth"
                placeholder="1991/01/01"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
              <SmallLabel htmlFor="phone">
                聯絡電話<Required>*</Required>
              </SmallLabel>
              <Input
                id="phone"
                placeholder="0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Block>
            <Block>
              <NewTitle>進階資訊</NewTitle>
              <SmallLabel htmlFor="intro">社群簡介</SmallLabel>
              <Textarea
                id="intro"
                placeholder="介紹自己，讓其他人更認識你！"
                value={selfIntro}
                onChange={(e) => setSelfIntro(e.target.value)}
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
