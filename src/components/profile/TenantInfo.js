import React from "react";
import { Firebase } from "../../utils/firebase";
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
} from "../common/Components";
import ChangeProfileImageModal from "../modals/ChangeProfileImage";
import BasicInfoModal from "../modals/SetUpBasicInfo";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";

import Creatable from "react-select/creatable";

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

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: -50px 20px 0 0;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

const HiddenInput = styled.input`
  display: none;
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

function TenantInfo() {
  const { currentUser } = useAuth();
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [allHobbies, setAllHobbies] = React.useState([]);
  const [hobbyOptions, setHobbyOptions] = React.useState([]);
  const [saved, setSaved] = React.useState(false);

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

  const coverRef = React.useRef(null);
  const [warning, setWarning] = React.useState(false);

  const [file, setFile] = React.useState();
  const [name, setName] = React.useState(currentUser.name);
  const [alias, setAlias] = React.useState(currentUser.alias);
  const [gender, setGender] = React.useState(currentUser.gender);
  const [birthday, setBirthday] = React.useState(currentUser.birthday);
  const [phone, setPhone] = React.useState(currentUser.phone);

  const [employment, setEmployment] = React.useState(currentUser.employment);
  const [selfIntro, setSelfIntro] = React.useState(currentUser.selfIntro);

  const [allJobs, setAllJobs] = React.useState([]);
  const [jobOptions, setJobOptions] = React.useState([]);
  const [jobTitle, setJobTitle] = React.useState(currentUser.jobTitle);
  const [hobbies, setHobbies] = React.useState(currentUser.hobbies);
  const [profileImage, setProfileImage] = React.useState(
    currentUser.profileImage
  );
  const [status, setStatus] = React.useState(currentUser.status);
  const [error, setError] = React.useState("");

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

  function updateUserData() {
    setIsLoading(true);
    const basicInfo = {
      name,
      alias,
      gender,
      birthday,
      phone,
      jobTitle,
      employment,
      selfIntro,
      hobbies,
      status,
    };

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
  }

  React.useEffect(() => {
    let mounted = true;
    api.getAllDocsFromCollection("hobbies").then((res) => {
      const initData = res.map((item) => item.name);
      if (!mounted) return;
      setAllHobbies(initData);
      setHobbyOptions(
        initData
          .filter((name) => !hobbies.includes(name))
          .map((item) => ({ label: item, value: item }))
      );
    });
    api.getAllDocsFromCollection("jobTitles").then((res) => {
      const initData = res.map((item) => item.name);
      if (!mounted) return;
      setAllJobs(initData);
      setJobOptions(
        initData
          .filter((name) => name !== jobTitle)
          .map((item) => ({ label: item, value: item }))
      );
    });
    return function cleanup() {
      mounted = false;
    };
  }, []);

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
            setProfileImage={setProfileImage}
            file={file}
            setFile={setFile}
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
                if ((file.size / 1024 / 1024).toFixed(4) >= 2) {
                  setWarning(true);
                  return;
                }
                coverRef.current = null;

                const storageRef = Firebase.ref(
                  Firebase.storage,
                  `users/${currentUser.uid}/cover`
                );
                Firebase.uploadBytes(storageRef, file).then((snapshot) => {
                  Firebase.getDownloadURL(snapshot.ref).then((downloadURL) => {
                    api.updateDocData("users", currentUser.uid, {
                      coverImage: downloadURL,
                    });
                    setSaved(true);
                  });
                });
              }}
            />
          </CoverWrapper>

          <ImageWrapper>
            <ProfileImage src={profileImage} />
            <Bold>{currentUser.email}</Bold>
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
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

              <SmallLabel htmlFor="alias">
                暱稱<Required>*</Required>
              </SmallLabel>
              <Input
                id="alias"
                placeholder="顯示在社群上的名字"
                value={alias}
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setAlias(e.target.value);
                }}
              />

              <SmallLabel htmlFor="gender">
                生理性別<Required>*</Required>
              </SmallLabel>
              <Select
                id="gender"
                value={gender}
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setGender(parseInt(e.target.value));
                }}
              >
                {genders.map((g, index) => (
                  <option key={index} value={g.value}>
                    {g.name}
                  </option>
                ))}
              </Select>

              <SmallLabel htmlFor="birth">生日</SmallLabel>
              <Input
                id="birth"
                placeholder="1991/01/01"
                value={birthday}
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setBirthday(e.target.value);
                }}
              />

              <SmallLabel htmlFor="phone">聯絡電話</SmallLabel>
              <Input
                id="phone"
                placeholder="0987654321"
                value={phone}
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setPhone(e.target.value.trim());
                }}
              />
            </Block>
            <Block>
              <NewTitle>進階資訊</NewTitle>

              <SmallLabel htmlFor="hobbies">
                興趣標籤<Required>*</Required>
              </SmallLabel>
              <Creatable
                id="hobbies"
                isClearable
                isMulti
                placeholder="請選擇興趣標籤"
                styled={{ fontSize: "14px" }}
                onFocus={() => {
                  setError("");
                }}
                onChange={(value) => {
                  setHobbies(value.map((item) => item.label));
                }}
                options={hobbyOptions}
                value={hobbies.map((hobby) => ({ label: hobby, value: hobby }))}
                styles={customStyles}
              />

              <SmallLabel htmlFor="job">
                職稱<Required>*</Required>
              </SmallLabel>
              <Creatable
                id="job"
                isClearable
                placeholder={
                  currentUser.jobTitle ? currentUser.jobTitle : "請選擇職稱"
                }
                styled={{ fontSize: "14px" }}
                onFocus={() => {
                  setError("");
                }}
                onChange={(value) => {
                  setJobTitle(value?.label || "");
                }}
                options={jobOptions}
                value={{ label: jobTitle, value: jobTitle }}
                styles={customStyles}
              />

              <SmallLabel htmlFor="emplyment">工作型態</SmallLabel>
              <Select
                id="emplyment"
                name="emplyment"
                value={employment}
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setEmployment(parseInt(e.target.value));
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
                value={selfIntro}
                onFocus={() => {
                  setError("");
                }}
                onChange={(e) => {
                  setSelfIntro(e.target.value);
                }}
              />
            </Block>
          </InnerWrapper>
          <ConfirmWrapper>
            <input
              id="public"
              type="checkbox"
              checked={status === 1 ? true : false}
              onChange={(e) => {
                if (!jobTitle || !hobbies.length || !selfIntro) {
                  setError(
                    "公開個人資訊之前，請確認填寫興趣標籤、職稱和社群簡介喔！"
                  );
                  return;
                }
                setStatus(e.target.checked === true ? 1 : 0);
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
