import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  BodyInnerWrapper,
  BottomWrapper,
  ErrorMessage,
} from "../common/Components";

import EditStepsIndicator from "./EditStepsIndicator";
import PropertyPagePrevNext from "./propertyPagePrevNext";
import EditPropertyPage1 from "./propertyEditModal/EditPropertyPage1";
import EditPropertyPage2 from "./propertyEditModal/EditPropertyPage2";
import EditPropertyPage3 from "./propertyEditModal/EditPropertyPage3";
import EditPropertyPage4 from "./propertyEditModal/EditPropertyPage4";
import ConfirmBeforeActionModal from "../modals/ConfirmBeforeAction";

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

function EditPropertyModal({ toggle, apartment, setSaved }) {
  const [paging, setPaging] = useState(1);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    ...apartment,
    coverFile: null,
    coverFileRef: null,
    query: apartment.address,
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
        <EditPropertyPage1
          key={1}
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
        <EditPropertyPage2
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
        <EditPropertyPage3
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
        <EditPropertyPage4
          key={4}
          apartment={apartment}
          images={images}
          setImages={setImages}
        />
      ),
    },
  ];

  useEffect(() => {
    let mounted = true;
    if (!mounted) return;

    [
      { name: "conditions", setData: setConditions },
      { name: "facilities", setData: setFacilities },
      { name: "furnitures", setData: setFurnitures },
      { name: "otherInfo", setData: setOtherInfo },
    ].forEach((subCollection) => {
      api
        .getAllDocsFromCollection(
          `apartments/${apartment.id}/${subCollection.name}`
        )
        .then((docs) => {
          subCollection.setData(docs);
        });
    });

    setImages(apartment.images);

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function updateApartmentData() {
    const { coverFile, coverFileRef, ...others } = basicInfo;
    if (Object.values(others).some((value) => !value)) {
      setWarning("請確認填寫基本資訊每一欄位！");
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

    setLoading(true);

    const time = Firebase.Timestamp.fromDate(new Date());

    api.updateDocData("apartments", apartment.id, {
      updateTime: time,
      address: basicInfo.address,
      geoLocation: basicInfo.geoLocation,
      monthlyRent: parseInt(basicInfo.monthlyRent),
      roomiesCount: parseInt(basicInfo.roomiesCount),
      rooms: parseInt(basicInfo.rooms),
      title: basicInfo.title,
      images,
      coverImage: basicInfo.coverImage,
    });

    let promises = [];

    conditions.forEach((condition) => {
      promises.push(
        api.updateSubCollectionDocData(
          "apartments",
          apartment.id,
          "conditions",
          condition.id,
          {
            id: condition.id,
            name: condition.name,
            value: condition.value,
          }
        )
      );
    });
    facilities.forEach((facility) => {
      promises.push(
        api.updateSubCollectionDocData(
          "apartments",
          apartment.id,
          "facilities",
          facility.id,
          {
            id: facility.id,
            name: facility.name,
            value: facility.value,
          }
        )
      );
    });
    furnitures.forEach((furniture) => {
      promises.push(
        api.updateSubCollectionDocData(
          "apartments",
          apartment.id,
          "furnitures",
          furniture.id,
          {
            id: furniture.id,
            name: furniture.name,
            value: furniture.value,
          }
        )
      );
    });
    otherInfo.forEach((info) => {
      promises.push(
        api.updateSubCollectionDocData(
          "apartments",
          apartment.id,
          "otherInfo",
          info.id,
          {
            id: info.id,
            name: info.name,
            value: info.value,
          }
        )
      );
    });

    Promise.all(promises).then(() => {
      setLoading(false);
      toggle();
      setSaved(true);
    });
  }

  return (
    <Overlay out={false}>
      {openConfirm && (
        <ConfirmBeforeActionModal
          toggle={() => setOpenConfirm(false)}
          message="尚未儲存，確認離開？"
          action={toggle}
        />
      )}
      <NewModal>
        <Header>
          <Title>編輯房源資訊</Title>
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
              loading={loading}
              action={updateApartmentData}
            />
          </BottomWrapper>
        </BodyInnerWrapper>
      </NewModal>
    </Overlay>
  );
}

EditPropertyModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  apartment: PropTypes.object.isRequired,
  setSaved: PropTypes.func.isRequired,
};

export default EditPropertyModal;
