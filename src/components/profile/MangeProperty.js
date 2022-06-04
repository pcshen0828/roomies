import { useEffect, useState } from "react";
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
import {
  ErrorMessage,
  BodyInnerWrapper,
  BottomWrapper,
} from "../common/Components";

import EditStepsIndicator from "./EditStepsIndicator";
import PropertyPagePrevNext from "./propertyPagePrevNext";
import Page1 from "./PropertyPages/PropertyPage1";
import Page2 from "./PropertyPages/PropertyPage2";
import Page3 from "./PropertyPages/PropertyPage3";
import Page4 from "./PropertyPages/PropertyPage4";
import ConfirmBeforeQuitModal from "../modals/ConfirmBeforeQuit";

import { v4 as uuidv4 } from "uuid";
import {
  conditionList,
  facilityList,
  furnitureList,
  otherInfoList,
} from "../../utils/apartmentSubCollections";
import ConfirmBeforeActionModal from "../modals/ConfirmBeforeAction";
import Loader from "../common/Loader";

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

let newApartmentId = uuidv4();

function ManagePropertyModal({
  type,
  toggle,
  setSaved,
  currentUser,
  apartment,
}) {
  const [paging, setPaging] = useState(1);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const navigate = useNavigate();
  const defaultCover =
    "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/apartments%2Fdefault%2Fimgplaceholder.png?alt=media&token=603bce20-3d5b-489f-9ffa-98ee2a3f8aba";

  function getInitialBasicInfo() {
    if (type === "create") {
      return {
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
      };
    }
    if (type === "edit") {
      return {
        ...apartment,
        coverFile: null,
        coverFileRef: null,
        query: apartment.address,
      };
    }
  }

  const [basicInfo, setBasicInfo] = useState(getInitialBasicInfo());
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
        <Page1
          key={1}
          apartmentId={type === "create" ? newApartmentId : basicInfo.id}
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
        <Page2
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
        <Page3
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
        <Page4
          key={4}
          apartmentId={type === "create" ? newApartmentId : apartment.id}
          images={images}
          setImages={setImages}
        />
      ),
    },
  ];

  useEffect(() => {
    let mounted = true;
    if (!mounted) return;

    setIsLoading(true);

    if (type === "create") {
      setConditions(conditionList);
      setFacilities(facilityList);
      setFurnitures(furnitureList);
      setOtherInfo(otherInfoList);
      setIsLoading(false);
    }

    if (type === "edit") {
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
      setIsLoading(false);
    }

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function uploadApartmentData() {
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

    const { title, address, geoLocation, coverImage } = basicInfo;
    const time = Firebase.Timestamp.fromDate(new Date());
    let promises = [];

    const sharedInfo = {
      updateTime: time,
      address,
      geoLocation,
      monthlyRent: parseInt(basicInfo.monthlyRent),
      roomiesCount: parseInt(basicInfo.roomiesCount),
      rooms: parseInt(basicInfo.rooms),
      title,
      images,
      coverImage,
    };

    const subCollections = [
      { name: "conditions", content: conditions },
      { name: "facilities", content: facilities },
      { name: "furnitures", content: furnitures },
      { name: "otherInfo", content: otherInfo },
    ];

    if (type === "create") {
      const newApartmentRef = api.createNewDocRefWithDocID(
        "apartments",
        newApartmentId
      );

      api.setNewDoc(newApartmentRef, {
        id: newApartmentId,
        createTime: time,
        status: 0,
        owner: currentUser.uid,

        ...sharedInfo,
      });

      const newGroupRef = api.createNewDocRef("groups");
      api.setNewDoc(newGroupRef, {
        id: newGroupRef.id,
        newApartmentId,
        members: [],
      });

      subCollections.forEach((subCollection) => {
        subCollection.content.forEach((item) => {
          const newDocRef = Firebase.doc(
            Firebase.db,
            `apartments/${newApartmentId}/${subCollection.name}/${item.id}`
          );
          promises.push(
            api.setNewDoc(newDocRef, {
              id: item.id,
              name: item.name,
              value: item.value,
            })
          );
        });
      });
    }

    if (type === "edit") {
      api.updateDocData("apartments", apartment.id, sharedInfo);

      subCollections.forEach((subCollection) => {
        subCollection.content.forEach((item) => {
          promises.push(
            api.updateSubCollectionDocData(
              "apartments",
              apartment.id,
              subCollection.name,
              item.id,
              {
                id: item.id,
                name: item.name,
                value: item.value,
              }
            )
          );
        });
      });
    }

    Promise.all(promises).then(() => {
      setIsLoading(false);
      toggle();
      if (type === "create") {
        navigate("/profile/apartments/inactive");
      }
      setSaved(true);
      newApartmentId = uuidv4();
    });
  }

  return (
    <>
      {openConfirm &&
        (type === "create" ? (
          <ConfirmBeforeQuitModal
            toggle={() => {
              setOpenConfirm(false);
            }}
            quit={toggle}
            apartmentId={newApartmentId}
            file={basicInfo.coverFile}
          />
        ) : (
          <ConfirmBeforeActionModal
            toggle={() => setOpenConfirm(false)}
            message="尚未儲存，確認離開？"
            action={toggle}
          />
        ))}
      <Overlay out={false}>
        <NewModal>
          <Header>
            <Title>{type === "create" ? "上架房源" : "編輯房源資訊"}</Title>
            <CloseButton
              onClick={() => {
                setOpenConfirm(true);
              }}
            >
              ×
            </CloseButton>
          </Header>
          {isLoading ? (
            <Loader />
          ) : (
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
                  action={uploadApartmentData}
                />
              </BottomWrapper>
            </BodyInnerWrapper>
          )}
        </NewModal>
      </Overlay>
    </>
  );
}

ManagePropertyModal.propTypes = {
  type: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  setSaved: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  apartment: PropTypes.object.isRequired,
};

export default ManagePropertyModal;
