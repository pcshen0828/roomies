import React from "react";
import styled from "styled-components";
import {
  FlexWrapper,
  Input,
  Title,
  SmallLabel,
  Select,
  Textarea,
} from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import ChangeProfileImageModal from "../modals/ChangeProfileImage";
import { LandlordBasicInfoModal } from "../modals/SetUpBasicInfo";
import { Firebase } from "../../utils/firebase";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 10px;
`;

const ImageWrapper = styled(FlexWrapper)`
  margin: 0 0 40px;
  font-size: 14px;
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
`;

const ImageButton = styled.button`
  width: 100px;
  height: 35px;
  font-size: 14px;
  margin-left: 20px;
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

const Block = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1279.98px) {
    width: 100%;
  }
`;

const Required = styled.span`
  color: #ed3636;
`;

const NewButton = styled.button`
  align-self: end;
  margin: 20px;
`;

const Loading = styled.button`
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
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [file, setFile] = React.useState();
  const [name, setName] = React.useState(currentUser.name);
  const [alias, setAlias] = React.useState(currentUser.alias);
  const [gender, setGender] = React.useState(currentUser.gender);
  const [birthday, setBirthday] = React.useState(currentUser.birthday);
  const [phone, setPhone] = React.useState(currentUser.phone);
  const [selfIntro, setSelfIntro] = React.useState(currentUser.selfIntro);
  const [profileImage, setProfileImage] = React.useState(
    currentUser.profileImage
  );

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
    }
  }

  function Render() {
    return (
      <>
        {(!currentUser.name || !currentUser.alias) && (
          <LandlordBasicInfoModal
            user={currentUser}
            name={name}
            setName={setName}
            alias={alias}
            setAlias={setAlias}
            gender={gender}
            setGender={setGender}
            selfIntro={selfIntro}
            setSelfIntro={setSelfIntro}
          />
        )}
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
