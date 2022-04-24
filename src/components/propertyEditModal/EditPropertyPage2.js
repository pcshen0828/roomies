import React from "react";
import styled from "styled-components";
import {
  SmallTitle,
  SmallLabel,
  FlexWrapper,
  LoadingButton,
  PagingList,
  Button1,
} from "../common/Components";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled(SmallLabel)`
  margin: 3px 10px 5px 3px;
`;

function EditPropertyPage2({ apartment, paging, setPaging }) {
  const [isLoading, setIsLoading] = React.useState(false);

  // 以下與 sub-collections 相關
  const [conditions, setConditions] = React.useState([]);
  const [facilities, setFacilities] = React.useState([]);
  const [furnitures, setFurnitures] = React.useState([]);

  React.useEffect(() => {
    console.log(apartment);
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/conditions")
      .then((res) => {
        console.log(res);
        setConditions(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/facilities")
      .then((res) => {
        console.log(res);
        setFacilities(res);
      });
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/furnitures")
      .then((res) => {
        console.log(res);
        setFurnitures(res);
      });
  }, [apartment]);

  function updateApartmentInfo() {
    setIsLoading(true);
    conditions.forEach((condition) => {
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
      );
    });
    facilities.forEach((facility) => {
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
      );
    });
    furnitures.forEach((furniture) => {
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
      );
    });
    const time = Firebase.Timestamp.fromDate(new Date());
    api.updateDocData("apartments", apartment.id, {
      ...apartment,
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
        {paging > 1 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <Button1
              onClick={() => setPaging((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              上一頁
            </Button1>
          ))}
        {paging < 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <Button1 onClick={updateApartmentInfo}>儲存並繼續</Button1>
          ))}
        {paging === 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <Button1>儲存並完成</Button1>
          ))}
      </PagingList>
    </>
  );
}

export default EditPropertyPage2;
