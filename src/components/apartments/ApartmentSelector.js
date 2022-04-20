import React from "react";
import styled from "styled-components";
import { FlexWrapper, SmallLabel, SmallTitle } from "../common/Components";
import SearchBox from "./SearchBox";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  margin: 20px auto;
  border: 1px solid #dadada;
  align-items: flex-start;
  flex-direction: column;
  border-radius: 5px;
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
    { en: "isRentIncludeUtilities", zh: "房租含水電雜費" },
    { en: "managementFee", zh: "管理費" },
  ],
};

let queryList = [];

function Selector({ allData, setApartments, setPaging }) {
  const toFilterData = allData;

  function ShowMatchedApartments({ e, name }) {
    const value = e.target.checked;
    if (!value) {
      queryList = queryList.filter((item) => item !== name);
    } else {
      queryList.push(name);
    }
    const filteredData = toFilterData.filter((item) =>
      queryList.every((value) => item.conditions.includes(value))
    );
    setApartments(filteredData);
  }

  const renderList = [
    { list: conditionList, name: "設施條件" },
    { list: facilityList, name: "室內設備" },
    { list: furnitureList, name: "家具" },
  ];
  return (
    <>
      <SearchBox
        apartments={toFilterData}
        setApartments={setApartments}
        setPaging={setPaging}
      />
      <Wrapper>
        {renderList.map((selector, index) => (
          <SelectItemWrapper key={index}>
            <FlexWrapper>
              <NewTitle>{selector.name}</NewTitle>
            </FlexWrapper>
            <FlexWrapper>
              {selector.list.content.map((condition, index) => (
                <InputWrapper key={index}>
                  <HiddenInput
                    type="checkbox"
                    id={condition.en}
                    onChange={(event) =>
                      ShowMatchedApartments({
                        e: event,
                        name: condition.en,
                      })
                    }
                  />
                  <NewLabel htmlFor={condition.en}>{condition.zh}</NewLabel>
                </InputWrapper>
              ))}
            </FlexWrapper>
          </SelectItemWrapper>
        ))}
      </Wrapper>
    </>
  );
}

export default Selector;
