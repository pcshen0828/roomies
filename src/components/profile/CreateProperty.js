import React from "react";
import { useNavigate } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";

import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
} from "../modals/ModalElements";
import {
  FlexWrapper,
  LoadingButton,
  Button1,
  PrevStepButton,
  SmallTitle,
  ErrorMessage,
} from "../common/Components";

import CreatePropertyPage1 from "./propertyCreateModal/CreatePropertyPage1";
import CreatePropertyPage2 from "./propertyCreateModal/CreatePropertyPage2";
import CreatePropertyPage3 from "./propertyCreateModal/CreatePropertyPage3";
import CreatePropertyPage4 from "./propertyCreateModal/CreatePropertyPage4";
import ConfirmBeforeQuitModal from "../modals/ConfirmBeforeQuit";

import { v4 as uuidv4 } from "uuid";

const NewModal = styled(Modal)`
  width: 80%;
  max-width: 960px;
  height: 85%;
  max-height: 640px;
  position: relative;
  @media screen and (max-width: 767.98px) {
    width: 90%;
  }
`;

const NewBody = styled(Body)`
  height: calc(80% - 30px);
  max-height: 460px;
  padding: 20px 10px 10px 20px;
  border: none;
  width: 70%;
  margin-top: 0;
  border-bottom: 1px solid #dadada;
  @media screen and (max-width: 767.98px) {
    width: calc(100% - 30px);
    height: 63%;
  }
`;

const BodyInnerWrapper = styled(FlexWrapper)`
  position: relative;
  align-items: flex-start;
  width: 100%;
  height: calc(100% - 75px);
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
  }
`;

const StepsWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: calc(30% - 20px);
  height: 100%;
  align-items: flex-start;
  padding: 20px 0 0 20px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-right: 1px solid #e8e8e8;
  @media screen and (max-width: 767.98px) {
    width: calc(100% - 20px);
    flex-direction: row;
    height: 50px;
    box-shadow: none;
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;
    align-items: center;
  }
`;

const StepIndicator = styled(FlexWrapper)`
  width: 50px;
  height: 50px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0px 2px 30px rgba(193, 177, 138, 0.1);
  background: ${(props) => (props.active ? "#424b5a" : "none")};
  color: ${(props) => (props.active ? "#fff" : "#424b5a")};
  cursor: pointer;

  @media screen and (max-width: 767.98px) {
    width: 25px;
    height: 25px;
    margin: 0 10px 0 0;
    font-size: 14px;
  }
  @media screen and (max-width: 600px) {
    width: 30px;
    height: 30px;
  }
`;

const StepWrapper = styled(FlexWrapper)`
  justify-content: center;
  align-items: center;
  margin: 0 20px 20px 0;
  @media screen and (max-width: 767.98px) {
    margin: 0 20px 10px 0;
  }
  @media screen and (max-width: 600px) {
    margin-right: 10px;
  }
`;

const StepName = styled(SmallTitle)`
  margin: 0;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const BottomWrapper = styled(FlexWrapper)`
  justify-content: space-between;
  position: absolute;
  right: 0;
  bottom: 30px;
  width: calc(70% - 40px);
  padding: 0 20px;
  @media screen and (max-width: 767.98px) {
    width: calc(100% - 40px);
    bottom: 10px;
  }
`;

const ButtonWrapper = styled(FlexWrapper)`
  align-items: center;
`;

const conditionList = [
  { en: "balcony", zh: "陽台" },
  { en: "elevator", zh: "電梯" },
  { en: "garbageManagement", zh: "垃圾集中管理" },
  { en: "guard", zh: "大樓管理員" },
  { en: "parking", zh: "停車位" },
  { en: "pet", zh: "可養寵物" },
].map((item) => ({ id: item.en, name: item.zh, value: false }));

const facilityList = [
  { en: "airCon", zh: "冷氣" },
  { en: "fridge", zh: "冰箱" },
  { en: "kitchen", zh: "廚房" },
  { en: "laundry", zh: "洗衣機" },
  { en: "naturalGas", zh: "天然氣" },
  { en: "waterHeater", zh: "熱水器" },
  { en: "payCable", zh: "第四台" },
  { en: "wifi", zh: "Wi-Fi" },
].map((item) => ({
  id: item.en,
  name: item.zh,
  value: false,
}));

const furnitureList = [
  { en: "bed", zh: "床" },
  { en: "chair", zh: "椅子" },
  { en: "closet", zh: "衣櫥" },
  { en: "sofa", zh: "沙發" },
  { en: "table", zh: "桌子" },
].map((item) => ({
  id: item.en,
  name: item.zh,
  value: false,
}));

const otherInfoList = [
  { en: "availableTime", zh: "可入住日期", value: "" },
  { en: "depositMonth", zh: "押金（月）", value: 0 },
  { en: "feature", zh: "房源特色", value: "" },
  { en: "floor", zh: "所在樓層", value: 1 },
  { en: "isRentIncludeUtilities", zh: "房租含水電雜費", value: false },
  { en: "managementFee", zh: "管理費", value: false },
  { en: "minLeaseTerm", zh: "最短租期", value: "半年" },
  { en: "squareFeet", zh: "坪數", value: 50 },
].map((item) => ({
  id: item.en,
  name: item.zh,
  value: item.value,
}));

const newApartmentId = uuidv4();

function CreatePropertyModal({ toggle, setSaved, currentUser }) {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [apartmentId, setApartmentId] = React.useState("");
  const [paging, setPaging] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [warning, setWarning] = React.useState("");

  const navigate = useNavigate();

  const defaultCover =
    "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/apartments%2Fdefault%2Fimgplaceholder.png?alt=media&token=603bce20-3d5b-489f-9ffa-98ee2a3f8aba";

  const [basicInfo, setBasicInfo] = React.useState({
    title: "",
    monthlyRent: 10000,
    rooms: 1,
    roomiesCount: 1,
    coverImage: defaultCover,
    coverFile: null,
    coverFileRef: null,
    geoLocation: {},
    query: "",
    address: "",
  });

  const [conditions, setConditions] = React.useState([]);
  const [facilities, setFacilities] = React.useState([]);
  const [furnitures, setFurnitures] = React.useState([]);
  const [otherInfo, setOtherInfo] = React.useState([]);
  const [images, setImages] = React.useState([]);

  const pages = [
    {
      number: 1,
      name: "基本資訊",
      component: (
        <CreatePropertyPage1
          key={1}
          id={apartmentId}
          basicInfo={basicInfo}
          setBasicInfo={setBasicInfo}
          handleError={setWarning}
        />
      ),
    },
    {
      number: 2,
      name: "房源條件",
      component: (
        <CreatePropertyPage2
          key={2}
          conditions={conditions}
          setConditions={setConditions}
          facilities={facilities}
          setFacilities={setFacilities}
          furnitures={furnitures}
          setFurnitures={setFurnitures}
          conditionList={conditionList}
          furnitureList={furnitureList}
          facilityList={facilityList}
          handleError={setWarning}
        />
      ),
    },
    {
      number: 3,
      name: "其他資訊",
      component: (
        <CreatePropertyPage3
          key={3}
          otherInfo={otherInfo}
          setOtherInfo={setOtherInfo}
          handleError={setWarning}
        />
      ),
    },
    {
      number: 4,
      name: "其他照片",
      component: (
        <CreatePropertyPage4
          key={4}
          id={apartmentId}
          images={images}
          setImages={setImages}
          handleError={setWarning}
        />
      ),
    },
  ];

  React.useEffect(() => {
    let mounted = true;
    if (!mounted) return;
    setApartmentId(newApartmentId);

    setConditions(conditionList);
    setFacilities(facilityList);
    setFurnitures(furnitureList);
    setOtherInfo(otherInfoList);

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function uploadApartmentInfo() {
    const { coverFile, coverFileRef, ...others } = basicInfo;
    if (Object.values(others).some((value) => !value)) {
      setWarning("請確認填寫基本資訊每一欄位！");
      return;
    }

    if (basicInfo.coverImage === defaultCover) {
      setWarning("請更新房源封面照片");
      return;
    }

    if (
      conditions.every((item) => item.value === false) ||
      facilities.every((item) => item.value === false) ||
      furnitures.every((item) => item.value === false)
    ) {
      setWarning("請選擇房源條件");
      return;
    }

    if (
      otherInfo
        .filter(
          (info) =>
            info.id === "availableTime" ||
            info.id === "depositMonth" ||
            info.id === "floor" ||
            info.id === "minLeaseTerm" ||
            info.id === "squareFeet"
        )
        .some((item) => !item.value)
    ) {
      setWarning("請確認填寫其他資訊");
      return;
    }

    setIsLoading(true);

    const time = Firebase.Timestamp.fromDate(new Date());

    const newApartmentRef = api.createNewDocRefWithDocID(
      "apartments",
      apartmentId
    );
    api.setNewDoc(newApartmentRef, {
      id: apartmentId,
      createTime: time,
      updateTime: time,
      status: 0,
      owner: currentUser.uid,
      address: basicInfo.address,
      geoLocation: basicInfo.geoLocation,
      monthlyRent: parseInt(basicInfo.monthlyRent),
      roomiesCount: parseInt(basicInfo.roomiesCount),
      rooms: parseInt(basicInfo.rooms),
      title: basicInfo.title,
      images,
      coverImage: basicInfo.coverImage,
    });

    const newGroupRef = api.createNewDocRef("groups");
    api.setNewDoc(newGroupRef, {
      id: newGroupRef.id,
      apartmentId,
      member: [],
    });

    let promises = [];

    conditions.forEach((condition) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        `apartments/${apartmentId}/conditions/${condition.id}`
      );
      promises.push(
        api.setNewDoc(newDocRef, {
          id: condition.id,
          name: condition.name,
          value: condition.value,
        })
      );
    });

    facilities.forEach((facility) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        `apartments/${apartmentId}/facilities/${facility.id}`
      );
      promises.push(
        api.setNewDoc(newDocRef, {
          id: facility.id,
          name: facility.name,
          value: facility.value,
        })
      );
    });

    furnitures.forEach((furniture) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        `apartments/${apartmentId}/furnitures/${furniture.id}`
      );
      promises.push(
        api.setNewDoc(newDocRef, {
          id: furniture.id,
          name: furniture.name,
          value: furniture.value,
        })
      );
    });

    otherInfo.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        `apartments/${apartmentId}/otherInfo/${item.id}`
      );
      promises.push(
        api.setNewDoc(newDocRef, {
          id: item.id,
          name: item.name,
          value: item.value,
        })
      );
    });

    Promise.all(promises).then((res) => {
      setIsLoading(false);
      toggle(false);
      navigate("/profile/apartments/inactive");
      setSaved(true);
    });
  }

  return (
    <>
      {openConfirm && (
        <ConfirmBeforeQuitModal
          toggle={toggle}
          apartmentId={apartmentId}
          file={basicInfo.coverFile}
        />
      )}
      <Overlay out={false}>
        <NewModal>
          <Header>
            <Title>上架房源</Title>
            <CloseButton
              onClick={() => {
                setOpenConfirm(true);
              }}
            >
              ×
            </CloseButton>
          </Header>
          <BodyInnerWrapper>
            <StepsWrapper>
              {pages.map((page) => (
                <StepWrapper key={page.number}>
                  <StepIndicator
                    active={page.number === paging}
                    onClick={() => {
                      setPaging(page.number);
                    }}
                  >
                    {page.number}
                  </StepIndicator>
                  <StepName>{page.name}</StepName>
                </StepWrapper>
              ))}
            </StepsWrapper>
            <NewBody>
              {pages.map((page) => page.number === paging && page.component)}
            </NewBody>
            <BottomWrapper>
              <ErrorMessage>{warning}</ErrorMessage>
              <ButtonWrapper>
                {paging > 1 && paging <= 4 && (
                  <PrevStepButton
                    onClick={() => {
                      if (paging === 1) return;
                      setWarning("");
                      setPaging(paging - 1);
                    }}
                  >
                    上一步
                  </PrevStepButton>
                )}
                {paging < 4 &&
                  (isLoading ? (
                    <LoadingButton>...</LoadingButton>
                  ) : (
                    <Button1
                      onClick={() => {
                        if (paging === 4) return;
                        setWarning("");
                        setPaging(paging + 1);
                      }}
                    >
                      下一步
                    </Button1>
                  ))}
                {paging === 4 && (
                  <Button1 onClick={uploadApartmentInfo}>完成</Button1>
                )}
              </ButtonWrapper>
            </BottomWrapper>
          </BodyInnerWrapper>
        </NewModal>
      </Overlay>
    </>
  );
}

export default CreatePropertyModal;
