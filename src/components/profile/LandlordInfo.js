import { Fragment, useEffect, useState } from "react";
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
import Loader from "../common/Loader";

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
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    alias: "",
    gender: 0,
    birthday: "",
    phone: "",
    selfIntro: "",
    profileImage: "",
  });

  useEffect(() => {
    if (currentUser) {
      const { name, alias, gender, birthday, phone, selfIntro, profileImage } =
        currentUser;
      setBasicInfo({
        name,
        alias,
        gender,
        birthday,
        phone,
        selfIntro,
        profileImage,
      });
    }
  }, [currentUser]);

  function updateUserData() {
    setIsLoading(true);
    api.updateDocData("users", currentUser.uid, basicInfo);
    setIsLoading(false);
    setSaved(true);
  }

  const genders = [
    { name: "???", value: 0 },
    { name: "???", value: 1 },
  ];

  const inputRenderList = [
    {
      id: "name",
      name: "????????????",
      placeholder: "??????????????????????????????",
      required: true,
    },
    {
      id: "alias",
      name: "??????",
      placeholder: "???????????????????????????",
      required: true,
    },
    {
      id: "birthday",
      name: "??????",
      placeholder: "1991/01/01",
      required: false,
    },
    {
      id: "phone",
      name: "????????????",
      placeholder: "0912345678",
      required: false,
    },
  ];

  function Render() {
    return (
      <>
        {saved && (
          <SuccessfullySavedModal toggle={setSaved} message="???????????????" />
        )}
        {openModal && (
          <ChangeProfileImageModal
            toggle={setOpenModal}
            setBasicInfo={setBasicInfo}
            setSaved={setSaved}
          />
        )}
        {basicInfo ? (
          <Wrapper>
            <ImageWrapper>
              <Profile src={currentUser?.profileImage} />
              <>{currentUser?.email}</>
              <ImageButton onClick={() => setOpenModal(true)}>
                ???????????????
              </ImageButton>
            </ImageWrapper>
            <InnerWrapper>
              <Block>
                <NewTitle>????????????</NewTitle>
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
                        const newBasicInfo = { ...basicInfo };
                        newBasicInfo[info.id] = e.target.value;
                        setBasicInfo({ ...newBasicInfo });
                      }}
                    />
                  </Fragment>
                ))}

                <SmallLabel htmlFor="gender">
                  ????????????<Required>*</Required>
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
                <NewTitle>????????????</NewTitle>
                <SmallLabel htmlFor="intro">????????????</SmallLabel>
                <Textarea
                  id="intro"
                  placeholder="??????????????????????????????????????????"
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
              <Loading>?????????</Loading>
            ) : (
              <NewButton onClick={updateUserData}>??????</NewButton>
            )}
          </Wrapper>
        ) : (
          <Loader />
        )}
      </>
    );
  }

  return Render();
}

export default LandlordInfo;
