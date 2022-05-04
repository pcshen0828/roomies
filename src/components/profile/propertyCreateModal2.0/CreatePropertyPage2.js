import React from "react";
import styled from "styled-components";
import { SmallTitle, SmallLabel, FlexWrapper } from "../../common/Components";

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled(SmallLabel)`
  margin: 3px 10px 5px 3px;
`;

function CreatePropertyPage2({
  conditions,
  setConditions,
  facilities,
  setFacilities,
  furnitures,
  setFurnitures,
}) {
  return (
    <>
      <SmallTitle htmlFor="title">設施條件</SmallTitle>
      <CheckboxWrapper>
        {conditions.map((condition, index) => (
          <FlexWrapper key={index}>
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
          </FlexWrapper>
        ))}
      </CheckboxWrapper>
      <SmallTitle htmlFor="title">室內設備</SmallTitle>
      <CheckboxWrapper>
        {facilities.map((facility, index) => (
          <FlexWrapper key={index}>
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
          </FlexWrapper>
        ))}
      </CheckboxWrapper>
      <SmallTitle htmlFor="title">家具</SmallTitle>
      <CheckboxWrapper>
        {furnitures.map((furniture, index) => (
          <FlexWrapper key={index}>
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
          </FlexWrapper>
        ))}
      </CheckboxWrapper>
    </>
  );
}

export default CreatePropertyPage2;
