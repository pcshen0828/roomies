import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
import { FlexWrapper, ErrorMessage } from "../common/Components";

import EditStepsIndicator from "./EditStepsIndicator";
import PropertyPagePrevNext from "./propertyPagePrevNext";
import CreatePropertyPage1 from "./propertyCreateModal/CreatePropertyPage1";
import CreatePropertyPage2 from "./propertyCreateModal/CreatePropertyPage2";
import CreatePropertyPage3 from "./propertyCreateModal/CreatePropertyPage3";
import CreatePropertyPage4 from "./propertyCreateModal/CreatePropertyPage4";
import ConfirmBeforeQuitModal from "../modals/ConfirmBeforeQuit";

import { v4 as uuidv4 } from "uuid";
import {
  conditionList,
  facilityList,
  furnitureList,
  otherInfoList,
} from "../../utils/apartmentSubCollections";

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

const newApartmentId = uuidv4();

function CreatePropertyModal({ toggle, setSaved, currentUser }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [apartmentId, setApartmentId] = useState("");
  const [paging, setPaging] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const navigate = useNavigate();

  const defaultCover =
    "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/apartments%2Fdefault%2Fimgplaceholder.png?alt=media&token=603bce20-3d5b-489f-9ffa-98ee2a3f8aba";

  const [basicInfo, setBasicInfo] = useState({
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

  const [conditions, setConditions] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [furnitures, setFurnitures] = useState([]);
  const [otherInfo, setOtherInfo] = useState([]);
  const [images, setImages] = useState([]);

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
        />
      ),
    },
  ];

  useEffect(() => {
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

    const { title, address, geoLocation, coverImage } = basicInfo;

    api.setNewDoc(newApartmentRef, {
      id: apartmentId,
      createTime: time,
      updateTime: time,
      status: 0,
      owner: currentUser.uid,
      title,
      address,
      geoLocation,
      coverImage,
      monthlyRent: parseInt(basicInfo.monthlyRent),
      roomiesCount: parseInt(basicInfo.roomiesCount),
      rooms: parseInt(basicInfo.rooms),
      images,
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

    Promise.all(promises).then(() => {
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
            <EditStepsIndicator
              pages={pages}
              paging={paging}
              setPaging={setPaging}
            />
            <NewBody>
              {pages.map((page) => page.number === paging && page.component)}
            </NewBody>
            <BottomWrapper>
              <ErrorMessage>{warning}</ErrorMessage>
              <PropertyPagePrevNext
                resetError={() => {
                  setWarning("");
                }}
                paging={paging}
                setPaging={setPaging}
                loading={isLoading}
                action={uploadApartmentInfo}
              />
            </BottomWrapper>
          </BodyInnerWrapper>
        </NewModal>
      </Overlay>
    </>
  );
}

CreatePropertyModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  setSaved: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default CreatePropertyModal;
