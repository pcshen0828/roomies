import React from "react";
import styled from "styled-components";
import { mainColor, subColor } from "../../../styles/GlobalStyle";
import { SmallTitle, SmallLabel, FlexWrapper } from "../../common/Components";

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled(SmallLabel)`
  font-weight: 400;
  margin: 3px 5px 5px 3px;
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
  background: ${(props) => (props.checked ? subColor : "#e8e8e8")};
  color: ${(props) => (props.checked ? "#fff" : mainColor)};
`;

const HiddenInput = styled.input`
  display: none;
`;

function EditPropertyPage2({
  conditions,
  setConditions,
  facilities,
  setFacilities,
  furnitures,
  setFurnitures,
  handleError,
}) {
  return (
    <>
      <SmallTitle htmlFor="title">設施條件</SmallTitle>
      <CheckboxWrapper>
        {conditions.map((condition, index) => (
          <React.Fragment key={index}>
            <HiddenInput
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
            <CheckboxLabel htmlFor={condition.id} checked={condition.value}>
              {condition.name}
            </CheckboxLabel>
          </React.Fragment>
        ))}
      </CheckboxWrapper>
      <SmallTitle htmlFor="title">室內設備</SmallTitle>
      <CheckboxWrapper>
        {facilities.map((facility, index) => (
          <React.Fragment key={index}>
            <HiddenInput
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
            <CheckboxLabel htmlFor={facility.id} checked={facility.value}>
              {facility.name}
            </CheckboxLabel>
          </React.Fragment>
        ))}
      </CheckboxWrapper>
      <SmallTitle htmlFor="title">家具</SmallTitle>
      <CheckboxWrapper>
        {furnitures.map((furniture, index) => (
          <React.Fragment key={index}>
            <HiddenInput
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
            <CheckboxLabel htmlFor={furniture.id} checked={furniture.value}>
              {furniture.name}
            </CheckboxLabel>
          </React.Fragment>
        ))}
      </CheckboxWrapper>
    </>
  );
}

export default EditPropertyPage2;
