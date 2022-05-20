import React, { useEffect, useState } from "react";
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
  Button1,
  ButtonWrapper,
  ErrorMessage,
  LoadingButton,
  PrevStepButton,
  StepIndicator,
  StepName,
  StepsWrapper,
  StepWrapper,
} from "../common/Components";

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
          handleError={setWarning}
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
          handleError={setWarning}
        />
      ),
    },
  ];

  useEffect(() => {
    let mounted = true;
    if (!mounted) return;

    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/conditions")
      .then((res) => {
        setConditions(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/facilities")
      .then((res) => {
        setFacilities(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/furnitures")
      .then((res) => {
        setFurnitures(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/otherInfo")
      .then((res) => {
        setOtherInfo(res);
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

    Promise.all(promises).then((res) => {
      setLoading(false);
      toggle(false);
      setSaved(true);
    });
  }

  return (
    <Overlay out={false}>
      {openConfirm && (
        <ConfirmBeforeActionModal
          toggle={() => setOpenConfirm(false)}
          message="尚未儲存，確認離開？"
          action={() => {
            toggle(false);
          }}
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
                (loading ? (
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
                <Button1 onClick={updateApartmentData}>儲存</Button1>
              )}
            </ButtonWrapper>
          </BottomWrapper>
        </BodyInnerWrapper>
      </NewModal>
    </Overlay>
  );
}

export default EditPropertyModal;
