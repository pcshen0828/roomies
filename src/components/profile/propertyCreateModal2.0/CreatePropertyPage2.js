import React from "react";
import styled from "styled-components";
import {
  SmallTitle,
  SmallLabel,
  FlexWrapper,
  LoadingButton,
  PagingList,
  Button1,
} from "../../common/Components";
import api from "../../../utils/api";
import { Firebase } from "../../../utils/firebase";

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled(SmallLabel)`
  margin: 3px 10px 5px 3px;
`;

function CreatePropertyPage2({ id, paging, setPaging, apartment }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const [conditions, setConditions] = React.useState([]);
  const [facilities, setFacilities] = React.useState([]);
  const [furnitures, setFurnitures] = React.useState([]);

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

  React.useEffect(() => {
    conditionList.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        "apartments",
        id,
        "conditions",
        item.docName
      );
      api.setNewDoc(newDocRef, {
        ...item.content,
      });
    });
    facilityList.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        "apartments",
        id,
        "facilities",
        item.docName
      );
      api.setNewDoc(newDocRef, {
        ...item.content,
      });
    });
    furnitureList.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        "apartments",
        id,
        "furnitures",
        item.docName
      );
      api.setNewDoc(newDocRef, {
        ...item.content,
      });
    });
  }, []);

  React.useEffect(() => {
    let mounted = true;
    api
      .getAllDocsFromCollection("apartments/" + id + "/conditions")
      .then((res) => {
        console.log(res);
        if (!mounted) return;
        setConditions(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + id + "/facilities")
      .then((res) => {
        console.log(res);
        if (!mounted) return;
        setFacilities(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + id + "/furnitures")
      .then((res) => {
        console.log(res);
        if (!mounted) return;
        setFurnitures(res);
      });

    return function cleanup() {
      mounted = false;
    };
  }, [apartment]);

  function updateApartmentInfo() {
    setIsLoading(true);
    conditions.forEach((condition) => {
      api.updateSubCollectionDocData(
        "apartments",
        id,
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
        id,
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
        id,
        "furnitures",
        furniture.id,
        {
          id: furniture.id,
          name: furniture.name,
          value: furniture.value,
        }
      );
    });
    const time = Firebase.Timestamp.fromDate(new Date());
    api.updateDocData("apartments", id, {
      updateTime: time,
    });
    setIsLoading(false);
    setPaging((prev) => (prev < 4 ? prev + 1 : 4));
  }

  return (
    <>
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
            <CheckboxLabel htmlFor={facility.id}>{facility.name}</CheckboxLabel>
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
      <PagingList>
        {paging < 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <Button1 onClick={updateApartmentInfo}>儲存並繼續</Button1>
          ))}
      </PagingList>
    </>
  );
}

export default CreatePropertyPage2;
