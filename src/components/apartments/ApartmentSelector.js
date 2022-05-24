import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import {
  Bold,
  Button1,
  FlexWrapper,
  SmallLabel,
  SmallTitle,
} from "../common/Components";
import SearchBox from "./SearchBox";

const fadeIn = keyframes`
  0%   { 
    opacity: 0; 
    visibility: hidden;
  }
  100% { 
    opacity: 1; 
    visibility: visible;
  }
`;

const Toggler = styled.div`
  width: 100%;
  height: 30px;
  margin-bottom: 30px;
  position: sticky;
  top: 79.5px;
  padding: 20px 0;
  left: 0;
  z-index: 10;
  text-align: center;
  cursor: pointer;
  background: #fff;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const CloseButton = styled(Button1)`
  width: 90px;
  height: 35px;
  align-self: center;
`;

const Container = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
  width: 100%;
  position: sticky;
  top: 80px;
  padding: 20px 0 10px;
  left: 0;
  z-index: 10;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-radius: 0 0 10px 10px;
  animation: ${fadeIn} 0.8s ease;
  display: ${(props) => (props.close ? "none" : "flex")};
`;

const Wrapper = styled(FlexWrapper)`
  width: 95%;
  margin: 20px auto;
  border: 1px solid #dadada;
  align-items: flex-start;
  flex-direction: column;
  border-radius: 5px;
  position: relative;
  padding: 20px 0 10px;
`;

const ColumnWrapper = styled(FlexWrapper)`
  flex-direction: column;
  margin-bottom: 0px;
  align-items: flex-start;
`;

const SelectorWrapper = styled(FlexWrapper)`
  flex-wrap: wrap;
`;

const SelectItemWrapper = styled(FlexWrapper)`
  width: calc(100% - 40px);
  padding: 0 20px;
  justify-content: flex-start;

  @media screen and (max-width: 1279.98px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
  }
`;

const NewTitle = styled(SmallTitle)`
  margin: 0 0 10px 0;
  width: 80px;
`;

const NewLabel = styled(SmallLabel)`
  margin: 0;
`;

const InputWrapper = styled(FlexWrapper)`
  margin-right: 10px;
  margin-bottom: 15px;
`;

const ClearAll = styled(Bold)`
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #c1b18a;
  }
`;

const ShowAll = styled(Bold)`
  position: absolute;
  top: 10px;
  right: 110px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #c1b18a;
  }
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

function Selector({ filterData, dispatch }) {
  const [isClose, setIsClose] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  function showMatchedApartments({ value, name }) {
    dispatch({
      type: value ? "check" : "cancelCheck",
      payload: value
        ? [...filterData.queryList, name]
        : filterData.queryList.filter((item) => item !== name),
    });
  }

  const renderList = [
    { list: conditionList, name: "設施條件" },
    { list: facilityList, name: "室內設備" },
    { list: furnitureList, name: "家具" },
  ];

  function displayAllApartments() {
    dispatch({ type: "reset" });
    setSearchQuery("");
  }

  function RenderSelector() {
    return (
      <>
        <SearchBox
          dispatch={dispatch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Wrapper>
          <ClearAll onClick={displayAllApartments}>×清空條件</ClearAll>
          <ShowAll onClick={displayAllApartments}>顯示所有房源</ShowAll>
          {renderList.map((selector, index) => (
            <SelectItemWrapper key={index}>
              <ColumnWrapper>
                <NewTitle>{selector.name}</NewTitle>
                <SelectorWrapper>
                  {selector.list.content.map((condition, index) => (
                    <InputWrapper key={index}>
                      <input
                        type="checkbox"
                        id={condition.en}
                        checked={filterData.queryList.includes(condition.en)}
                        onChange={(e) => {
                          showMatchedApartments({
                            value: e.target.checked,
                            name: condition.en,
                          });
                        }}
                      />
                      <NewLabel htmlFor={condition.en}>{condition.zh}</NewLabel>
                    </InputWrapper>
                  ))}
                </SelectorWrapper>
              </ColumnWrapper>
            </SelectItemWrapper>
          ))}
        </Wrapper>
      </>
    );
  }
  return (
    <>
      <Toggler
        show={isClose}
        onClick={() => {
          setIsClose(false);
        }}
      >
        展開篩選條件
      </Toggler>
      <Container close={isClose}>
        {RenderSelector()}
        <CloseButton
          onClick={() => {
            setIsClose(true);
          }}
        >
          收起
        </CloseButton>
      </Container>
    </>
  );
}

Selector.propTypes = {
  filterData: PropTypes.object,
  dispatch: PropTypes.func,
};

export default Selector;
