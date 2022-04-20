import React from "react";
import styled from "styled-components";
import { FlexWrapper, SmallLabel, SmallTitle } from "../common/Components";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";

const Wrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  border: 1px solid #ccc;
  align-items: flex-start;
  flex-direction: column;
`;

const SelectItemWrapper = styled(FlexWrapper)`
  width: calc(100% - 40px);
  height: 60px;
  padding: 0 20px;
  justify-content: flex-start;

  @media screen and (max-width: 1279.98px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
  }
`;

const NewTitle = styled(SmallTitle)`
  margin: 0;
  width: 80px;
  @media screen and (max-width: 1279.98px) {
    margin-bottom: 10px;
  }
`;

const NewLabel = styled(SmallLabel)`
  margin: 0;
`;

const InputWrapper = styled(FlexWrapper)`
  margin-right: 10px;
`;
const HiddenInput = styled.input`
  ${"" /* display: none; */}
`;

const conditionList = {
  id: "conditions",
  content: [
    { en: "balcony", zh: "陽台" },
    { en: "elevator", zh: "電梯" },
    { en: "garbageManagement", zh: "垃圾集中管理" },
    { en: "guard", zh: "大樓管理員" },
    { en: "parking", zh: "停車位" },
    { en: "pet", zh: "可養寵物" },
  ],
};
const facilityList = {
  id: "facilities",
  content: [
    { en: "airCon", zh: "冷氣" },
    { en: "fridge", zh: "冰箱" },
    { en: "kitchen", zh: "廚房" },
    { en: "laundry", zh: "洗衣機" },
    { en: "naturalGas", zh: "天然氣" },
    { en: "waterHeater", zh: "熱水器" },
    { en: "payCable", zh: "第四台" },
    { en: "wifi", zh: "Wi-Fi" },
  ],
};
const furnitureList = {
  id: "furnitures",
  content: [
    { en: "bed", zh: "床" },
    { en: "chair", zh: "椅子" },
    { en: "closet", zh: "衣櫥" },
    { en: "sofa", zh: "沙發" },
    { en: "table", zh: "桌子" },
  ],
};
const otherInfoList = {
  id: "otherInfo",
  content: [
    // { en: "floor", zh: "所在樓層" },
    { en: "isRentIncludeUtilities", zh: "房租含水電雜費" },
    { en: "managementFee", zh: "管理費" },
    // { en: "minLeaseTerm", zh: "最短租期" },
    // { en: "squareFeet", zh: "坪數" },
  ],
};

function Selector({ apartments, setApartments }) {
  const [checkboxQueryList, setCheckboxQueryList] = React.useState([]);

  async function ShowMatchedApartments({ e, docID, subCollectionName }) {
    const value = e.target.checked;
    console.log(value, docID, subCollectionName);
  }

  return (
    <Wrapper>
      <SelectItemWrapper>
        <FlexWrapper>
          <NewTitle>設施條件</NewTitle>
        </FlexWrapper>
        <FlexWrapper>
          {conditionList.content.map((condition, index) => (
            <InputWrapper key={index}>
              <HiddenInput
                type="checkbox"
                id={condition.en}
                onChange={(event) =>
                  ShowMatchedApartments({
                    e: event,
                    docID: condition.en,
                    subCollectionName: conditionList.id,
                  })
                }
              />
              <NewLabel htmlFor={condition.en}>{condition.zh}</NewLabel>
            </InputWrapper>
          ))}
        </FlexWrapper>
      </SelectItemWrapper>
      <SelectItemWrapper>
        <FlexWrapper>
          <NewTitle>室內設備</NewTitle>
        </FlexWrapper>
        <FlexWrapper>
          {facilityList.content.map((condition, index) => (
            <InputWrapper key={index}>
              <HiddenInput
                type="checkbox"
                id={condition.en}
                onChange={(event) =>
                  ShowMatchedApartments({
                    e: event,
                    docID: condition.en,
                    subCollectionName: facilityList.id,
                  })
                }
              />
              <NewLabel htmlFor={condition.en}>{condition.zh}</NewLabel>
            </InputWrapper>
          ))}
        </FlexWrapper>
      </SelectItemWrapper>
      <SelectItemWrapper>
        <FlexWrapper>
          <NewTitle>家具</NewTitle>
        </FlexWrapper>
        <FlexWrapper>
          {furnitureList.content.map((condition, index) => (
            <InputWrapper key={index}>
              <HiddenInput
                type="checkbox"
                id={condition.en}
                onChange={(event) =>
                  ShowMatchedApartments({
                    e: event,
                    docID: condition.en,
                    subCollectionName: furnitureList.id,
                  })
                }
              />
              <NewLabel htmlFor={condition.en}>{condition.zh}</NewLabel>
            </InputWrapper>
          ))}
        </FlexWrapper>
      </SelectItemWrapper>
      <SelectItemWrapper>
        <FlexWrapper>
          <NewTitle>其他資訊</NewTitle>
        </FlexWrapper>
        <FlexWrapper>
          {otherInfoList.content.map((condition, index) => (
            <InputWrapper key={index}>
              <HiddenInput
                type="checkbox"
                id={condition.en}
                onChange={(event) =>
                  ShowMatchedApartments({
                    e: event,
                    docID: condition.en,
                    subCollectionName: otherInfoList.id,
                  })
                }
              />
              <NewLabel htmlFor={condition.en}>{condition.zh}</NewLabel>
            </InputWrapper>
          ))}
        </FlexWrapper>
      </SelectItemWrapper>
    </Wrapper>
  );
}

export default Selector;
