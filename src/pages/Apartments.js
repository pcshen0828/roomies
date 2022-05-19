import React, { useEffect, useReducer, useRef, useState } from "react";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";
import defaultScroll from "../utils/defaultScroll";

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

const initialState = {
  allData: [],
  filtered: [],
  queryList: [],
  currentPage: 1,
  allPages: 1,
  itemsPerPage: 6,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "update":
      return {
        ...state,
        allData: payload,
        filtered: payload,
        allPages: Math.ceil(payload.length / state.itemsPerPage),
      };

    case "search":
      return {
        ...state,
        filtered: state.allData.filter((item) =>
          item.basic.title.includes(payload)
        ),
        allPages: Math.ceil(state.filtered / state.itemsPerPage),
        currentPage: 1,
        queryList: [],
      };

    case "cancelInputCheck":
      return {
        ...state,
        queryList: payload,
        filtered: state.allData.filter((item) =>
          payload.every((value) => item.conditions.includes(value))
        ),
        allPages: Math.ceil(state.filtered / state.itemsPerPage),
        currentPage: 1,
      };

    case "addInputCheck":
      return {
        ...state,
        queryList: payload,
        filtered: state.allData.filter((item) =>
          payload.every((value) => item.conditions.includes(value))
        ),
        allPages: Math.ceil(state.filtered / state.itemsPerPage),
        currentPage: 1,
      };

    case "reset":
      return {
        ...state,
        filtered: state.allData,
        queryList: [],
        currentPage: 1,
        allPages: Math.ceil(state.allData.length / state.itemsPerPage),
      };

    case "updateCurrentPage":
      return { ...state, currentPage: state.currentPage + payload };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

function Apartments() {
  const [loading, setLoading] = useState(true);
  const [filterData, dispatch] = useReducer(reducer, initialState);

  const anchor = useRef(null);
  const filterAnchor = useRef(null);
  const firstRender = useRef();

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

  useEffect(() => {
    firstRender.current = true;
    fetchApartments(query, (data) => {
      if (firstRender.current) {
        dispatch({ type: "update", payload: data });
        setLoading(false);
        firstRender.current = false;
      }
    });
  }, []);

  useEffect(() => {
    defaultScroll();
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.intersectionRatio <= 0) return;
      if (firstRender.current) return;

      dispatch({ type: "updateCurrentPage", payload: 1 });
      if (filterData.currentPage > filterData.allPages) return;
    });

    intersectionObserver.observe(anchor.current);
  }, []);

  return (
    <>
      <NewWrapper>
        <NewTitle>立即開始，搜尋理想房源</NewTitle>
        <Selector
          anchor={filterAnchor}
          filterData={filterData}
          dispatch={dispatch}
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
            {filterData.filtered.length
              ? filterData.filtered
                  .slice(0, filterData.itemsPerPage * filterData.currentPage)
                  .map((apartment) => (
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
