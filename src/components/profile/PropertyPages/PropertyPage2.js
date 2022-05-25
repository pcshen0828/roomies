import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { mainColor, subColor } from "../../../styles/GlobalStyle";
import {
  SmallTitle,
  SmallLabel,
  FlexWrapper,
  Required,
  HiddenInput,
} from "../../common/Components";

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

function Page2({
  conditions,
  setConditions,
  facilities,
  setFacilities,
  furnitures,
  setFurnitures,
}) {
  return (
    <>
      <SmallTitle>
        設施條件<Required>*</Required>
      </SmallTitle>
      <CheckboxWrapper>
        {conditions.map((condition, index) => (
          <FlexWrapper key={index}>
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
          </FlexWrapper>
        ))}
      </CheckboxWrapper>
      <SmallTitle>
        室內設備<Required>*</Required>
      </SmallTitle>
      <CheckboxWrapper>
        {facilities.map((facility, index) => (
          <FlexWrapper key={index}>
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
          </FlexWrapper>
        ))}
      </CheckboxWrapper>
      <SmallTitle>
        家具<Required>*</Required>
      </SmallTitle>
      <CheckboxWrapper>
        {furnitures.map((furniture, index) => (
          <FlexWrapper key={index}>
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
          </FlexWrapper>
        ))}
      </CheckboxWrapper>
    </>
  );
}

Page2.propTypes = {
  conditions: PropTypes.array.isRequired,
  setConditions: PropTypes.func.isRequired,
  facilities: PropTypes.array.isRequired,
  setFacilities: PropTypes.func.isRequired,
  furnitures: PropTypes.array.isRequired,
  setFurnitures: PropTypes.func.isRequired,
};

export default Page2;
