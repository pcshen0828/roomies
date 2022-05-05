import React from "react";
import styled from "styled-components";
import {
  Bold,
  Button1,
  FlexWrapper,
  SmallLabel,
  SmallTitle,
} from "../common/Components";
import SearchBox from "./SearchBox";

const Toggler = styled.div`
  width: 100%;
  height: 30px;
  position: sticky;
  top: 80px;
  padding: 20px 0;
  left: 0;
  z-index: 10;
  text-align: center;
  cursor: pointer;
  background: #fff;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  ${
    "" /* display: none;

  @media screen and (max-width: 1279.98px) {
    display: block;
  } */
  }
`;

const CloseButton = styled(Button1)`
  width: 90px;
  height: 35px;
  align-self: center;
`;

const Container = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: sticky;
  top: 80px;
  padding: 20px 0;
  left: 0;
  z-index: 10;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-radius: 0 0 10px 10px;
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
const HiddenInput = styled.input`
  ${"" /* display: none; */}
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

function Selector({
  allData,
  setApartments,
  page,
  setPaging,
  allPages,
  calcAllPages,
  queryList,
}) {
  const [isClose, setIsClose] = React.useState(false);
  // const [prevScrollPos, setPrevScrollPos] = React.useState(0);
  // const [visible, setVisible] = React.useState(true);
  const toFilterData = allData;

  function ShowMatchedApartments({ e, name }) {
    const value = e.target.checked;
    if (!value) {
      queryList.current = queryList.current.filter((item) => item !== name);
    } else {
      queryList.current.push(name);
    }
    const filteredData = toFilterData.filter((item) =>
      queryList.current.every((value) => item.conditions.includes(value))
    );
    setPaging(1);
    allPages.current = calcAllPages(filteredData);
    setApartments(filteredData);
  }

  const renderList = [
    { list: conditionList, name: "設施條件" },
    { list: facilityList, name: "室內設備" },
    { list: furnitureList, name: "家具" },
  ];

  // function handleScroll() {
  //   const currentScrollPos = window.pageYOffset;
  //   setVisible(
  //     (prevScrollPos > currentScrollPos &&
  //       prevScrollPos - currentScrollPos > 90) ||
  //       currentScrollPos < 90
  //   );
  //   setPrevScrollPos(currentScrollPos);
  // }

  // React.useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  function displayAllApartments() {
    queryList.current = [];
    setApartments(allData);
    setPaging(1);
    page.current = 1;
  }

  function RenderSelector() {
    return (
      <>
        <SearchBox
          apartments={toFilterData}
          setApartments={setApartments}
          page={page}
          setPaging={setPaging}
          allPages={allPages}
          calcAllPages={calcAllPages}
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
                      <HiddenInput
                        type="checkbox"
                        id={condition.en}
                        checked={queryList.current.includes(condition.en)}
                        onChange={(event) => {
                          page.current = 1;
                          ShowMatchedApartments({
                            e: event,
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
      {isClose ? (
        <Toggler
          onClick={() => {
            setIsClose(false);
          }}
        >
          展開篩選條件
        </Toggler>
      ) : (
        <Container>
          {RenderSelector()}
          <CloseButton
            onClick={() => {
              setIsClose(true);
            }}
          >
            收起
          </CloseButton>
        </Container>
      )}
    </>
  );
}

export default Selector;
