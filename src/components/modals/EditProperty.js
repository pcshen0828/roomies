import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import {
  SmallTitle,
  SmallLabel,
  Input,
  FlexWrapper,
  Textarea,
  Error,
} from "../common/Components";
import api from "../../utils/api";

const NewBody = styled(Body)`
  height: 70%;
  padding: 10px 0 10px 10px;
`;

const NewModal = styled(Modal)`
  width: 80%;
  height: 80%;
`;

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled(SmallLabel)`
  margin: 3px 10px 5px 3px;
`;

const CoverImageDisplayer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const Image = styled.div`
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 320px;
  height: 200px;
  margin: 0 10px 10px 0;
`;

const ImagesDisplayer = styled(FlexWrapper)`
  width: 95%;
  height: 200px;
  overflow-x: scroll;
`;

const ChooseImageButton = styled.label`
  width: 90px;
  height: 30px;
  border: 1px solid #dadada;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #dadada;
  }
`;

const HiddenInputFilePicker = styled.input`
  display: none;
`;

const UploadNewImage = styled.label`
  margin: 0 30px 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
`;

function EditPropertyModal({ toggle, apartment }) {
  const [title, setTitle] = React.useState(apartment.title);
  const [address, setAddress] = React.useState(apartment.address);
  const [monthlyRent, setMonthlyRent] = React.useState(apartment.monthlyRent);
  const [roomiesCount, setRoomiesCount] = React.useState(
    apartment.roomiesCount
  );
  const [coverImage, setCoverImage] = React.useState(apartment.coverImage);

  const [rooms, setRooms] = React.useState(apartment.rooms);
  const [conditions, setConditions] = React.useState([]);
  const [facilities, setFacilities] = React.useState([]);
  const [furnitures, setFurnitures] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [otherInfo, setOtherInfo] = React.useState([]);

  const [file, setFile] = React.useState();
  const [error, setError] = React.useState("");
  const fileRef = React.useRef(null);

  const stringToBoolean = (string) => (string === "false" ? false : !!string);

  React.useEffect(() => {
    console.log(apartment);
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/conditions")
      .then((res) => {
        console.log(res[0]);
        setConditions(res[0].content);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/facilities")
      .then((res) => {
        console.log(res[0]);
        setFacilities(res[0].content);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/furnitures")
      .then((res) => {
        console.log(res[0]);
        setFurnitures(res[0].content);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/images")
      .then((res) => {
        console.log(res);
        setImages(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/otherInfo")
      .then((res) => {
        console.log(res[0]);
        setOtherInfo(res[0].content);
      });
  }, []);

  function updateApartmentInfo() {
    // firestore 要上傳 單張封面照片 並取得圖片網址
    // firestore 要上傳 多張特色照片 並取得圖片網址們
    // 要更新 多個 collection 的資料
  }

  return (
    <Overlay>
      <NewModal>
        <Header>
          <Title>編輯房源資訊</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle htmlFor="title">封面照片（建議比例：16:9）</SmallTitle>
          <CoverImageDisplayer>
            <Image src={coverImage} />
            <ChooseImageButton htmlFor="coverImage">重新選擇</ChooseImageButton>
            <HiddenInputFilePicker
              id="coverImage"
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if ((e.target.files[0].size / 1024 / 1024).toFixed(4) >= 1.5) {
                  setError("檔案大小過大，請重新上傳");
                  return;
                }
                setError("");
                setFile(e.target.files[0]);
                const objectUrl = URL.createObjectURL(e.target.files[0]);
                setCoverImage(objectUrl);
              }}
            />
            {error && <Error>{error}</Error>}
          </CoverImageDisplayer>
          <SmallLabel htmlFor="title">房源名稱</SmallLabel>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <SmallLabel htmlFor="address">房源地址</SmallLabel>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <SmallLabel htmlFor="monthlyRent">每月房租（間）</SmallLabel>
          <Input
            id="monthlyRent"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />

          <SmallLabel htmlFor="roomiesCount">可住人數</SmallLabel>
          <Input
            id="roomiesCount"
            value={roomiesCount}
            onChange={(e) => setRoomiesCount(e.target.value)}
          />

          <SmallLabel htmlFor="rooms">房間數</SmallLabel>
          <Input
            id="rooms"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
          />

          <SmallTitle htmlFor="title">設施條件</SmallTitle>
          <CheckboxWrapper>
            {conditions.map((condition, index) => (
              <React.Fragment key={index}>
                <input
                  id={condition.id}
                  type="checkbox"
                  checked={condition.value}
                  onChange={(e) => {
                    setConditions((prev) =>
                      prev.map((item) =>
                        item.id === condition.id
                          ? { ...item, value: e.target.checked }
                          : item
                      )
                    );
                  }}
                />
                <CheckboxLabel htmlFor={condition.id}>
                  {condition.name}
                </CheckboxLabel>
              </React.Fragment>
            ))}
          </CheckboxWrapper>
          <SmallTitle htmlFor="title">室內設備</SmallTitle>
          <CheckboxWrapper>
            {facilities.map((facility, index) => (
              <React.Fragment key={index}>
                <input
                  id={facility.id}
                  type="checkbox"
                  checked={facility.value}
                  onChange={(e) => {
                    setFacilities((prev) =>
                      prev.map((item) =>
                        item.id === facility.id
                          ? { ...item, value: e.target.checked }
                          : item
                      )
                    );
                  }}
                />
                <CheckboxLabel htmlFor={facility.id}>
                  {facility.name}
                </CheckboxLabel>
              </React.Fragment>
            ))}
          </CheckboxWrapper>
          <SmallTitle htmlFor="title">家具</SmallTitle>
          <CheckboxWrapper>
            {furnitures.map((furniture, index) => (
              <React.Fragment key={index}>
                <input
                  id={furniture.id}
                  type="checkbox"
                  checked={furniture.value}
                  onChange={(e) => {
                    setFurnitures((prev) =>
                      prev.map((item) =>
                        item.id === furniture.id
                          ? { ...item, value: e.target.checked }
                          : item
                      )
                    );
                  }}
                />
                <CheckboxLabel htmlFor={furniture.id}>
                  {furniture.name}
                </CheckboxLabel>
              </React.Fragment>
            ))}
          </CheckboxWrapper>
          {otherInfo.map((info, index) => (
            <React.Fragment key={index}>
              <SmallLabel htmlFor={info.id}>{info.name}</SmallLabel>
              {info.id === "feature" ? (
                <Textarea
                  id={info.id}
                  value={info.value}
                  onChange={(e) => {
                    setOtherInfo((prev) =>
                      prev.map((item) =>
                        item.id === info.id
                          ? { ...item, value: e.target.value }
                          : item
                      )
                    );
                  }}
                />
              ) : info.name === "房租含水電雜費" || info.name === "管理費" ? (
                <CheckboxWrapper>
                  {[
                    { name: "是", value: true },
                    { name: "否", value: false },
                  ].map((choice, index) => (
                    <React.Fragment key={index}>
                      <input
                        id={`${info.id}${index}`}
                        name={info.id}
                        type="radio"
                        value={stringToBoolean(choice.value)}
                        onChange={(e) => {
                          setOtherInfo((prev) =>
                            prev.map((item) =>
                              item.id === info.id
                                ? {
                                    ...item,
                                    value: stringToBoolean(e.target.value),
                                  }
                                : item
                            )
                          );
                        }}
                      />
                      <CheckboxLabel htmlFor={`${info.id}${index}`}>
                        {choice.name}
                      </CheckboxLabel>
                    </React.Fragment>
                  ))}
                </CheckboxWrapper>
              ) : (
                <Input
                  id={info.id}
                  value={info.value}
                  onChange={(e) => {
                    setOtherInfo((prev) =>
                      prev.map((item) =>
                        item.id === info.id
                          ? { ...item, value: e.target.value }
                          : item
                      )
                    );
                  }}
                />
              )}
            </React.Fragment>
          ))}
          <SmallTitle htmlFor="title">其他照片</SmallTitle>
          <ImagesDisplayer>
            <FlexWrapper>
              {images.map((image, index) => (
                <Image key={index} src={image.url} />
              ))}
              <UploadNewImage htmlFor="images">+</UploadNewImage>
              <HiddenInputFilePicker
                id="images"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (
                    (e.target.files[0].size / 1024 / 1024).toFixed(4) >= 1.5
                  ) {
                    setError("檔案大小過大，請重新上傳");
                    return;
                  }
                  setError("");
                  setFile(e.target.files[0]);
                  const objectUrl = URL.createObjectURL(e.target.files[0]);
                  setCoverImage(objectUrl);
                }}
              />
            </FlexWrapper>
          </ImagesDisplayer>
        </NewBody>
        <Button onClick={updateApartmentInfo}>儲存</Button>
      </NewModal>
    </Overlay>
  );
}

export default EditPropertyModal;
