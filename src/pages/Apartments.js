import React from "react";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";

import styled from "styled-components";
import { Wrapper, Title } from "../components/common/Components";
import Selector from "../components/apartments/ApartmentSelector";
import Card from "../components/apartments/ApartmentCard";
import Footer from "../components/layout/Footer";
import Skeleton from "react-loading-skeleton";

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
  margin: -10px auto 0;

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fill, calc((100% - 10px) / 2));
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 100%);
  }
`;

const Anchor = styled.div`
  width: 100%;
  height: ${(props) => (props.role === "filter" ? "20px" : "40px")};
`;

function Apartments() {
  const [loading, setLoading] = React.useState(true);
  const [apartments, setApartments] = React.useState([]);
  const [allData, setAllData] = React.useState([]);
  const [paging, setPaging] = React.useState(1);
  const itemsPerPage = 6;
  const anchor = React.useRef(null);
  const firstRender = React.useRef();
  const currentPage = React.useRef(1);
  const allPages = React.useRef();
  const queryList = React.useRef([]);
  const filterAnchor = React.useRef(null);

  const query = Firebase.query(
    Firebase.collection(Firebase.db, "apartments"),
    Firebase.where("status", "==", 1),
    Firebase.orderBy("createTime", "desc")
  );
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
    firstRender.current = true;
    fetchApartments(query, (data) => {
      if (firstRender.current) {
        setAllData(data);
        setApartments(data);
        setLoading(false);
        firstRender.current = false;
        allPages.current = calcAllPages(data);
      }
    });
  }, []);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.intersectionRatio <= 0) return;
      if (firstRender.current) return;

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
          anchor={filterAnchor}
        />
        <Anchor role="filter" ref={filterAnchor}></Anchor>
        {loading ? (
          <Cards>
            {Array.from(Array(6).keys()).map((loader, index) => (
              <Skeleton
                key={index}
                height={350}
                borderRadius={20}
                style={{ marginBottom: "20px" }}
              />
            ))}
          </Cards>
        ) : (
          <Cards>
            {apartments.length
              ? apartments
                  .slice(0, itemsPerPage * paging)
                  .map((apartment, index) => (
                    <Card key={apartment.basic.id} detail={apartment.basic} />
                  ))
              : "無符合物件"}
          </Cards>
        )}
        <Anchor ref={anchor}></Anchor>
      </NewWrapper>
      <Footer />
    </>
  );
}

export default Apartments;
