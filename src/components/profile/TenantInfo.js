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
import { TenantBasicInfoModal } from "../modals/SetUpBasicInfo";
import { Firebase } from "../../utils/firebase";
import HobbyPicker from "./HobbyPicker";

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

const HobbyDisplayer = styled(FlexWrapper)`
  flex-wrap: wrap;
  width: 90%;
  padding: 10px 6px 10px 0;
`;

const HobbyTag = styled(FlexWrapper)`
  padding: 5px;
  border-radius: 5px;
  background: #dadada;
  font-size: 14px;
  margin: 0 5px 5px 0;
  cursor: pointer;
`;

const ConfirmWrapper = styled(FlexWrapper)`
  width: 100%;
  margin-top: 20px;
  align-items: center;
`;

const NewLabel = styled(SmallLabel)`
  margin: 0;
`;

let allHobbies = [];

function TenantInfo() {
  const { currentUser } = useAuth();
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openPicker, setOpenPicker] = React.useState(false);
  const [allHobbies, setAllHobbies] = React.useState(false);
  const [hobbyList, setHobbyList] = React.useState([]);
  const [query, setQuery] = React.useState("");

  const [file, setFile] = React.useState();
  const [name, setName] = React.useState(currentUser.name);
  const [alias, setAlias] = React.useState(currentUser.alias);
  const [gender, setGender] = React.useState(currentUser.gender);
  const [birthday, setBirthday] = React.useState(currentUser.birthday);
  const [phone, setPhone] = React.useState(currentUser.phone);
  const [jobTitle, setJobTitle] = React.useState(currentUser.jobTitle);
  const [employment, setEmployment] = React.useState(currentUser.employment);
  const [selfIntro, setSelfIntro] = React.useState(currentUser.selfIntro);
  const [hobbies, setHobbies] = React.useState(currentUser.hobbies);
  const [profileImage, setProfileImage] = React.useState(
    currentUser.profileImage
  );
  const [status, setStatus] = React.useState(currentUser.status);

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
    if (file) {
      const storageRef = Firebase.ref(
        Firebase.storage,
        `users/${currentUser.uid}/profile`
      );
      Firebase.uploadBytes(storageRef, file).then((snapshot) => {
        Firebase.getDownloadURL(snapshot.ref).then((downloadURL) => {
          api.updateDocData("users", currentUser.uid, {
            ...currentUser,
            ...basicInfo,
            profileImage: downloadURL,
          });
          setIsLoading(false);
        });
      });
    } else {
      api.updateDocData("users", currentUser.uid, {
        ...currentUser,
        ...basicInfo,
      });
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    api.getAllDocsFromCollection("hobbies").then((res) => {
      const allData = res
        .map((item) => item.name)
        .filter((name) => !hobbies.includes(name));
      setAllHobbies(allData);
      setHobbyList(allData);
    });
  }, []);

  function Render() {
    return (
      <>
        {(!currentUser.name || !currentUser.alias || !currentUser.jobTitle) && (
          <TenantBasicInfoModal
            user={currentUser}
            name={name}
            setName={setName}
            alias={alias}
            setAlias={setAlias}
            gender={gender}
            setGender={setGender}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
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
                onChange={(e) => setPhone(e.target.value.trim())}
              />
            </Block>
            <Block>
              <NewTitle>進階資訊</NewTitle>

              <SmallLabel htmlFor="hobbies">興趣標籤</SmallLabel>
              {hobbies.length ? (
                <HobbyDisplayer
                  onClick={() => {
                    setOpenPicker(false);
                  }}
                >
                  {hobbies.map((hobby, index) => (
                    <HobbyTag
                      key={index}
                      onClick={() => {
                        setHobbies((prev) =>
                          prev.filter((item) => item !== hobby)
                        );
                        setHobbyList((prev) => [...prev, hobby]);
                      }}
                    >
                      {hobby}
                    </HobbyTag>
                  ))}
                </HobbyDisplayer>
              ) : (
                ""
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newHobby = e.target[0].value;
                  console.log(newHobby);
                  if (!hobbyList.includes(newHobby)) {
                    setHobbies((prev) => [...prev, newHobby]);
                  } else {
                    setHobbies((prev) => [...prev, newHobby]);
                    setHobbyList(
                      allHobbies.filter((item) => item !== newHobby)
                    );
                  }
                  setQuery("");
                  setHobbyList(allHobbies);
                }}
              >
                <Input
                  id="hobbies"
                  placeholder="請輸入或選擇興趣"
                  value={query}
                  onFocus={() => {
                    setOpenPicker(true);
                  }}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHobbyList(
                      allHobbies.filter((item) => item.includes(e.target.value))
                    );
                  }}
                />
              </form>
              {openPicker && (
                <HobbyPicker
                  hobbyList={hobbyList}
                  toggle={setOpenPicker}
                  setHobbies={setHobbies}
                  setHobbyList={setHobbyList}
                />
              )}

              <SmallLabel htmlFor="job">職稱</SmallLabel>
              <Input
                id="job"
                placeholder={
                  currentUser.jobTitle ? currentUser.jobTitle : "工程師"
                }
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />

              <SmallLabel htmlFor="emplyment">工作型態</SmallLabel>
              <Select
                id="emplyment"
                name="emplyment"
                value={employment}
                onChange={(e) => setEmployment(parseInt(e.target.value))}
              >
                {employments.map((e, index) => (
                  <option key={index} value={e.value}>
                    {e.name}
                  </option>
                ))}
              </Select>

              <SmallLabel htmlFor="intro">社群簡介</SmallLabel>
              <Textarea
                id="intro"
                placeholder="介紹自己，讓其他人更認識你！"
                value={selfIntro}
                onChange={(e) => setSelfIntro(e.target.value)}
              />
            </Block>
          </InnerWrapper>
          <ConfirmWrapper>
            <input
              id="public"
              type="checkbox"
              checked={status === 1 ? true : false}
              onChange={(e) => setStatus(e.target.checked === true ? 1 : 0)}
            />
            <NewLabel htmlFor="public">
              公開個人資訊（讓其他使用者可以看到你的職稱、興趣和簡介）
            </NewLabel>
          </ConfirmWrapper>
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
