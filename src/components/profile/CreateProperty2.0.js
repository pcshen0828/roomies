import React from "react";
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
  LoadingButton,
  Button1,
  PrevStepButton,
  SmallTitle,
} from "../common/Components";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";
import CreatePropertyPage1 from "./propertyCreateModal2.0/CreatePropertyPage1";
import CreatePropertyPage2 from "./propertyCreateModal2.0/CreatePropertyPage2";
import CreatePropertyPage3 from "./propertyCreateModal2.0/CreatePropertyPage3";
import CreatePropertyPage4 from "./propertyCreateModal2.0/CreatePropertyPage4";
import ConfirmBeforeQuitModal from "../modals/ConfirmBeforeQuit";
import { useAuth } from "../../context/AuthContext";
import { FlexWrapper } from "../common/Components";
import { useNavigate } from "react-router-dom";

const NewModal = styled(Modal)`
  width: 80%;
  max-width: 960px;
  height: 80%;
  max-height: 640px;
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

const BofyInnerWrapper = styled(FlexWrapper)`
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

const ButtonWrapper = styled.div`
  width: 95%;
  text-align: right;
  position: absolute;
  right: 20px;
  bottom: 30px;
  align-items: center;
`;

const conditionList = [
  { en: "balcony", zh: "陽台" },
  { en: "elevator", zh: "電梯" },
  { en: "garbageManagement", zh: "垃圾集中管理" },
  { en: "guard", zh: "大樓管理員" },
  { en: "parking", zh: "停車位" },
  { en: "pet", zh: "可養寵物" },
].map((item) => ({
  docName: item.en,
  content: { id: item.en, name: item.zh, value: false },
}));

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
  docName: item.en,
  content: { id: item.en, name: item.zh, value: false },
}));

const furnitureList = [
  { en: "bed", zh: "床" },
  { en: "chair", zh: "椅子" },
  { en: "closet", zh: "衣櫥" },
  { en: "sofa", zh: "沙發" },
  { en: "table", zh: "桌子" },
].map((item) => ({
  docName: item.en,
  content: { id: item.en, name: item.zh, value: false },
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
  docName: item.en,
  content: { id: item.en, name: item.zh, value: item.value },
}));

function CreatePropertyModal({ toggle, setSaved }) {
  const { currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [apartmentId, setApartmentId] = React.useState("");
  const [apartment, setApartment] = React.useState({});
  const [paging, setPaging] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const defaultCover =
    "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/apartments%2Fdefault%2Fimgplaceholder.png?alt=media&token=603bce20-3d5b-489f-9ffa-98ee2a3f8aba";

  const [basicInfo, setBasicInfo] = React.useState({
    title: apartment.title ? apartment.title : "",
    monthlyRent: apartment.monthlyRent ? apartment.monthlyRent : "",
    rooms: apartment.rooms ? apartment.rooms : "",
    roomiesCount: apartment.roomiesCount ? apartment.roomiesCount : "",
    coverImage: apartment.coverFile ? apartment.coverFile : defaultCover,
    coverFile: null,
    coverFileRef: null,
    geoLocation: apartment.geoLocation ? apartment.geoLocation : {},
    query: "",
    address: apartment.address ? apartment.address : "",
  });

  const [conditions, setConditions] = React.useState([]);
  const [facilities, setFacilities] = React.useState([]);
  const [furnitures, setFurnitures] = React.useState([]);
  const [otherInfo, setOtherInfo] = React.useState([]);
  const [images, setImages] = React.useState(
    apartment.images ? apartment.images : []
  );

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
        />
      ),
    },
  ];

  React.useEffect(() => {
    let mounted = true;
    const newTeamRef = api.createNewDocRef("apartments");
    const apartmentId = newTeamRef.id;
    const time = Firebase.Timestamp.fromDate(new Date());

    api.setNewDoc(newTeamRef, {
      id: newTeamRef.id,
      createTime: time,
      updateTime: time,
      status: 0,
      owner: currentUser.uid,
    });
    setApartmentId(newTeamRef.id);

    const query = api.createQuery("apartments", "id", "==", apartmentId);
    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      console.log(querySnapShot.docs.map((doc) => doc.data())[0]);
      setApartment(querySnapShot.docs.map((doc) => doc.data())[0]);
    });

    conditionList.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        "apartments",
        apartmentId,
        "conditions",
        item.docName
      );
      if (!mounted) return;
      api.setNewDoc(newDocRef, {
        ...item.content,
      });
    });
    facilityList.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        "apartments",
        apartmentId,
        "facilities",
        item.docName
      );
      if (!mounted) return;
      api.setNewDoc(newDocRef, {
        ...item.content,
      });
    });
    furnitureList.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        "apartments",
        apartmentId,
        "furnitures",
        item.docName
      );
      if (!mounted) return;
      api.setNewDoc(newDocRef, {
        ...item.content,
      });
    });
    otherInfoList.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        "apartments",
        apartmentId,
        "otherInfo",
        item.docName
      );
      api.setNewDoc(newDocRef, {
        ...item.content,
      });
    });

    api
      .getAllDocsFromCollection("apartments/" + apartmentId + "/conditions")
      .then((res) => {
        if (!mounted) return;
        setConditions(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartmentId + "/facilities")
      .then((res) => {
        if (!mounted) return;
        setFacilities(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartmentId + "/furnitures")
      .then((res) => {
        if (!mounted) return;
        setFurnitures(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartmentId + "/otherInfo")
      .then((res) => {
        if (!mounted) return;
        setOtherInfo(res);
      });

    return function cleanup() {
      mounted = false;
      unsubscribe();
    };
  }, []);

  function updateApartmentInfo() {
    setIsLoading(true);
    const time = Firebase.Timestamp.fromDate(new Date());

    conditions.forEach((condition) => {
      api.updateSubCollectionDocData(
        "apartments",
        apartmentId,
        "conditions",
        condition.id,
        {
          id: condition.id,
          name: condition.name,
          value: condition.value,
        }
      );
    });
    facilities.forEach((facility) => {
      api.updateSubCollectionDocData(
        "apartments",
        apartmentId,
        "facilities",
        facility.id,
        {
          id: facility.id,
          name: facility.name,
          value: facility.value,
        }
      );
    });
    furnitures.forEach((furniture) => {
      api.updateSubCollectionDocData(
        "apartments",
        apartmentId,
        "furnitures",
        furniture.id,
        {
          id: furniture.id,
          name: furniture.name,
          value: furniture.value,
        }
      );
    });
    otherInfo.forEach((info) => {
      api.updateSubCollectionDocData(
        "apartments",
        apartmentId,
        "otherInfo",
        info.id,
        {
          id: info.id,
          name: info.name,
          value: info.value,
        }
      );
    });
    api
      .updateDocData("apartments", apartmentId, {
        ...apartment,
        address: basicInfo.address,
        geoLocation: basicInfo.geoLocation,
        monthlyRent: parseInt(basicInfo.monthlyRent),
        roomiesCount: parseInt(basicInfo.roomiesCount),
        rooms: parseInt(basicInfo.rooms),
        title: basicInfo.title,
        updateTime: time,
        status: 0,
        images,
        coverImage: basicInfo.coverImage,
      })
      .then(() => {
        setIsLoading(false);
        toggle(false);
        navigate("/profile/apartments?status=inactive");
        setSaved(true);
      });
  }

  return (
    <>
      {openConfirm && (
        <ConfirmBeforeQuitModal toggle={toggle} apartmentId={apartmentId} />
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
          <BofyInnerWrapper>
            <StepsWrapper>
              {pages.map((page) => (
                <StepWrapper key={page.number}>
                  <StepIndicator active={page.number === paging}>
                    {page.number}
                  </StepIndicator>
                  <StepName>{page.name}</StepName>
                </StepWrapper>
              ))}
            </StepsWrapper>
            <NewBody>
              {pages.map((page) => page.number === paging && page.component)}
            </NewBody>
          </BofyInnerWrapper>
          <ButtonWrapper>
            {paging > 1 && paging <= 4 && (
              <PrevStepButton
                onClick={() => {
                  if (paging === 1) return;
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
                    setPaging(paging + 1);
                  }}
                >
                  下一步
                </Button1>
              ))}
            {paging === 4 && (
              <Button1 onClick={updateApartmentInfo}>完成</Button1>
            )}
          </ButtonWrapper>
        </NewModal>
      </Overlay>
    </>
  );
}

export default CreatePropertyModal;
