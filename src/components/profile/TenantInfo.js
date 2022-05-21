import React, { Fragment, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import { mainColor } from "../../styles/GlobalStyle";
import {
  FlexWrapper,
  Input,
  Title,
  SmallLabel,
  Select,
  Textarea,
  Button1,
  ErrorMessage,
  Bold,
  FlexColumn,
  HiddenInput,
  ProfileImage,
  Required,
} from "../common/Components";
import ChangeProfileImageModal from "../modals/ChangeProfileImage";
import BasicInfoModal from "../modals/SetUpBasicInfo";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";

import Creatable from "react-select/creatable";
import scrollToTop from "../../utils/scroll";

const Wrapper = styled(FlexColumn)`
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;
  position: relative;
  align-items: stretch;
`;

const CoverWrapper = styled.div`
  width: calc(100% + 40px);
  height: 200px;
  position: absolute;
  top: -30px;
  left: -20px;
  background: ${(props) =>
    props.src
      ? `url(${props.src})`
      : "linear-gradient(180deg, rgba(193, 177, 138, 0.5) 0%, rgba(66, 75, 90, 0.5) 100%)"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 1;
`;

const ImageWrapper = styled(FlexWrapper)`
  margin: 170px 0 20px;
  font-size: 14px;
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
  }
  z-index: 1;
`;

const Profile = styled(ProfileImage)`
  width: 100px;
  height: 100px;
  margin: -50px 20px 0 0;
  flex-shrink: 0;
  border: 2px solid #fff;

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

const ImageLabel = styled.label`
  width: 120px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  position: absolute;
  right: 15px;
  bottom: 15px;
  &:hover {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
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

const ConfirmWrapper = styled(FlexWrapper)`
  width: 100%;
  margin: 20px 0 10px;
  align-items: center;
  @media screen and (max-width: 767.98px) {
    align-items: flex-start;
  }
`;

const NewLabel = styled(SmallLabel)`
  margin: 0;
  @media screen and (max-width: 767.98px) {
    margin-top: -2px;
  }
`;

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    width: "100%",
    height: "auto",
    borderBottom: "1px solid #dadada",
    color: mainColor,
    background: state.isSelected ? "#e8e8e8" : "#fff",
    fontSize: "14px",
    "&:hover": {
      background: "#e8e8e8",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "14px",
    color: mainColor,
  }),
  container: (provided) => ({
    ...provided,
    width: "90%",
    margin: "0 0 20px 0",
    boxSizing: "border-box",
  }),
  control: (base, state) => ({
    ...base,
    borderRadius: "0px",
    minHeight: "35px",
    border: state.isFocused ? "1px solid #c1b18a" : "1px solid #dadada",
    boxShadow: state.isFocused ? 0 : 0,
    "&:hover": {
      border: state.isFocused ? "1px solid #c1b18a" : "1px solid #dadada",
    },
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: 0,
    "&:hover": {
      background: "#fff",
    },
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    fontSize: "13px",
  }),
  input: (defaultStyles) => ({
    ...defaultStyles,
    fontSize: "14px",
  }),
};

function TenantInfo() {
  const { currentUser } = useAuth();

  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState("");

  const [allHobbies, setAllHobbies] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const coverRef = useRef(null);

  const {
    name,
    alias,
    gender,
    birthday,
    phone,
    employment,
    selfIntro,
    jobTitle,
    hobbies,
    profileImage,
    status,
  } = currentUser;

  const [basicInfo, setBasicInfo] = useState({
    name,
    alias,
    gender,
    birthday,
    phone,
    employment,
    selfIntro,
    jobTitle,
    hobbies,
    profileImage,
    status,
  });

  const employments = [
    { name: "待業中", value: 0 },
    { name: "上班族", value: 1 },
    { name: "兼職", value: 2 },
    { name: "自由工作者", value: 3 },
    { name: "自僱者", value: 4 },
  ];

  const genders = [
    { name: "女", value: 0 },
    { name: "男", value: 1 },
  ];

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
      placeholder: "0912345678",
      required: false,
    },
  ];

  const creatableSelectList = [
    {
      id: "hobbies",
      name: "興趣標籤",
      placeholder: "請選擇興趣標籤",
      isMulti: true,
      value: basicInfo.hobbies.map((hobby) => ({
        label: hobby,
        value: hobby,
      })),
      options: generateHobbyOptions(),
    },
    {
      id: "jobTitle",
      name: "職稱",
      placeholder: currentUser.jobTitle ? currentUser.jobTitle : "請選擇職稱",
      isMulti: false,
      value: { label: basicInfo.jobTitle, value: basicInfo.jobTitle },
      options: generateJobOptions(),
    },
  ];

  useEffect(() => {
    let mounted = true;

    api.getAllDocsFromCollection("hobbies").then((res) => {
      const initData = res.map((item) => item.name);
      if (!mounted) return;
      setAllHobbies(initData);
    });
    api.getAllDocsFromCollection("jobTitles").then((res) => {
      const initData = res.map((item) => item.name);
      if (!mounted) return;
      setAllJobs(initData);
    });
    return function cleanup() {
      mounted = false;
    };
  }, []);

  function updateUserData() {
    setIsLoading(true);

    const newHobbies = hobbies.filter((item) => !allHobbies.includes(item));
    if (newHobbies.length) {
      newHobbies.forEach((name) => {
        const newDocRef = api.createNewDocRef("hobbies");
        api.setNewDoc(newDocRef, {
          id: newDocRef.id,
          name,
        });
      });
    }

    if (!allJobs.includes(jobTitle)) {
      const newDocRef = api.createNewDocRef("jobTitles");
      api.setNewDoc(newDocRef, {
        id: newDocRef.id,
        name: jobTitle,
      });
    }

    api.updateDocData("users", currentUser.uid, {
      ...basicInfo,
    });
    setIsLoading(false);
    setSaved(true);
    scrollToTop();
  }

  function generateHobbyOptions() {
    return allHobbies.map((item) => ({ label: item, value: item }));
  }

  function generateJobOptions() {
    return allJobs.map((item) => ({ label: item, value: item }));
  }

  function uploadCoverImage(file) {
    if ((file.size / 1024 / 1024).toFixed(4) >= 2) {
      setWarning(true);
      return;
    }
    coverRef.current = null;
    api
      .uploadFileAndGetDownloadUrl(`users/${currentUser.uid}/cover`, file)
      .then((res) => {
        api.updateDocData("users", currentUser.uid, {
          coverImage: res,
        });
        setSaved(true);
      });
  }

  function Render() {
    return (
      <>
        {saved && (
          <SuccessfullySavedModal toggle={setSaved} message="更新成功！" />
        )}
        {(!currentUser.name || !currentUser.jobTitle) && (
          <BasicInfoModal role="tenant" />
        )}
        {openModal && (
          <ChangeProfileImageModal
            toggle={setOpenModal}
            setBasicInfo={setBasicInfo}
            setSaved={setSaved}
          />
        )}
        {warning && (
          <SuccessfullySavedModal
            message="檔案過大，請重新上傳！"
            toggle={setWarning}
          />
        )}

        <Wrapper>
          <CoverWrapper src={currentUser.coverImage}>
            <ImageLabel htmlFor="coverImage">編輯封面照片</ImageLabel>
            <HiddenInput
              id="coverImage"
              type="file"
              accept="image/*"
              ref={coverRef}
              onChange={(e) => {
                const file = e.target.files[0];
                uploadCoverImage(file);
              }}
            />
          </CoverWrapper>

          <ImageWrapper>
            <Profile src={profileImage} />
            <Bold>{currentUser.email}</Bold>
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
                    onFocus={() => {
                      setError("");
                    }}
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
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setBasicInfo((prev) => ({
                    ...prev,
                    gender: parseInt(e.target.value),
                  }));
                }}
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

              {creatableSelectList.map((select) => (
                <Fragment key={select.id}>
                  <SmallLabel htmlFor={select.id}>
                    {select.name}
                    <Required>*</Required>
                  </SmallLabel>
                  <Creatable
                    id={select.id}
                    isClearable
                    isMulti={select.isMulti}
                    placeholder={select.placeholder}
                    styled={{ fontSize: "14px" }}
                    onFocus={() => {
                      setError("");
                    }}
                    onChange={(value) => {
                      const newValue =
                        select.id === "hobbies"
                          ? value.map((item) => item.label)
                          : value?.label || "";
                      basicInfo[select.id] = newValue;
                      setBasicInfo({ ...basicInfo });
                    }}
                    options={select.options}
                    value={select.value}
                    styles={customStyles}
                  />
                </Fragment>
              ))}

              <SmallLabel htmlFor="employment">工作型態</SmallLabel>
              <Select
                id="employment"
                name="employment"
                value={basicInfo.employment}
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setBasicInfo((prev) => ({
                    ...prev,
                    employment: parseInt(e.target.value),
                  }));
                }}
              >
                {employments.map((e, index) => (
                  <option key={index} value={e.value}>
                    {e.name}
                  </option>
                ))}
              </Select>

              <SmallLabel htmlFor="intro">
                社群簡介<Required>*</Required>
              </SmallLabel>
              <Textarea
                id="intro"
                placeholder="介紹自己，讓其他人更認識你！"
                value={basicInfo.selfIntro}
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setBasicInfo((prev) => ({
                    ...prev,
                    selfIntro: e.target.value,
                  }));
                }}
              />
            </Block>
          </InnerWrapper>
          <ConfirmWrapper>
            <input
              id="public"
              type="checkbox"
              checked={basicInfo.status === 1 ? true : false}
              onChange={(e) => {
                if (
                  !basicInfo.jobTitle ||
                  !basicInfo.hobbies.length ||
                  !basicInfo.selfIntro
                ) {
                  setError(
                    "公開個人資訊之前，請確認填寫興趣標籤、職稱和社群簡介喔！"
                  );
                  return;
                }
                setBasicInfo((prev) => ({
                  ...prev,
                  status: e.target.checked === true ? 1 : 0,
                }));
              }}
            />
            <NewLabel htmlFor="public">
              公開個人資訊（讓其他使用者可以看到你的職稱、興趣和簡介）
            </NewLabel>
          </ConfirmWrapper>
          <ErrorMessage>{error}</ErrorMessage>
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

export default TenantInfo;
