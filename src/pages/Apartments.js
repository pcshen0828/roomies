import React from "react";
import styled from "styled-components";
import Selector from "../components/apartments/ApartmentSelector";
import Card from "../components/apartments/ApartmentCard";
import { Wrapper, Title } from "../components/common/Components";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";

const NewWrapper = styled(Wrapper)`
  align-items: flex-start;
  position: relative;
`;

const NewTitle = styled(Title)`
  margin: 0px 0 30px;
`;

const Cards = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 340px);
  justify-content: space-between;
  margin: 20px auto 0;

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fill, calc((100% - 10px) / 2));
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 100%);
  }
`;

const Anchor = styled.div`
  width: 100%;
  height: 40px;
`;

function Apartments() {
  const [apartments, setApartments] = React.useState([]);
  const [allData, setAllData] = React.useState([]);
  const [paging, setPaging] = React.useState(1);
  const itemsPerPage = 6;
  const anchor = React.useRef(null);
  const firstRender = React.useRef();
  const currentPage = React.useRef(1);
  const allPages = React.useRef();
  const queryList = React.useRef([]);

  const query = api.createQuery("apartments", "status", "==", 1);

  function fetchApartments(query, callback) {
    Firebase.onSnapshot(query, (snapShot) => {
      const apartmentDocs = snapShot.docs.map((doc) => doc.data());
      let apartmentArray = [];
      apartmentDocs.forEach((apartment) => {
        let newData = { basic: apartment, conditions: [] };
        const subCollections = [
          "conditions",
          "facilities",
          "furnitures",
          "otherInfo",
        ];
        subCollections.forEach((subCollection) => {
          api
            .getAllDocsFromCollection(
              "apartments/" + apartment.id + `/${subCollection}`
            )
            .then((res) => {
              const properties = res
                .filter((property) => property.value === true)
                .map((item) => item.id);
              newData.conditions.push(...properties);
            });
        });
        apartmentArray.push(newData);
      });
      callback(apartmentArray);
    });
  }

  function calcAllPages(data) {
    return Math.ceil(data / itemsPerPage);
  }

  React.useEffect(() => {
    // 一開始 mounted 的時候監聽就好，之後都用 allData 處理畫面
    firstRender.current = true;
    fetchApartments(query, (data) => {
      if (firstRender.current) {
        setAllData(data); // 這個不會變 database
        setApartments(data); // 處理渲染邏輯
        firstRender.current = false;
        allPages.current = calcAllPages(data);
      }
    });
  }, []);

  React.useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.intersectionRatio <= 0) return;
      if (firstRender.current) return;

      // 這裡是每次觸發 observer 都會進來的地方
      // 如果有條件篩選，要保留條件的結果，不要 reset
      currentPage.current++;
      if (currentPage.current > allPages.current) return;
      setPaging(currentPage.current);
    });
    intersectionObserver.observe(anchor.current);
  }, []);

  return (
    <>
      <NewWrapper>
        <NewTitle>立即開始，搜尋理想房源</NewTitle>
        <Selector
          allData={allData}
          setApartments={setApartments}
          page={currentPage}
          setPaging={setPaging}
          allPages={allPages}
          calcAllPages={calcAllPages}
          queryList={queryList}
        />
        <Cards>
          {apartments.length
            ? apartments
                .slice(0, itemsPerPage * paging)
                .map((apartment, index) => (
                  <Card key={apartment.basic.id} detail={apartment.basic} />
                ))
            : "無符合物件"}
        </Cards>
        <Anchor ref={anchor}></Anchor>
      </NewWrapper>
    </>
  );
}

export default Apartments;
