import React from "react";
import styled from "styled-components";
import Header from "../components/layout/Header";
import Selector from "../components/apartments/ApartmentSelector";
import Card from "../components/apartments/ApartmentCard";
import {
  Wrapper,
  PagingList,
  PagingItem,
  Title,
} from "../components/common/Components";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";

const NewWrapper = styled(Wrapper)`
  align-items: flex-start;
`;

const NewTitle = styled(Title)`
  margin: 0px 0 30px;
`;

const Cards = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 340px);
  justify-content: space-between;
  margin: 20px auto;

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fill, calc((100% - 10px) / 2));
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 100%);
    margin-bottom: 20px;
  }
`;

function Apartments() {
  const [apartments, setApartments] = React.useState([]);
  const [allData, setAllData] = React.useState([]);
  const query = api.createQuery("apartments", "status", "==", 1);
  const [paging, setPaging] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      const apartmentDocs = querySnapShot.docs.map((doc) => doc.data());
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
      setApartments(apartmentArray);
      setAllData(apartmentArray);
    });
    return function cleanup() {
      unsubscribe();
    };
  }, []);

  function createPaging(num) {
    return Array.from(Array(num).keys());
  }

  return (
    <>
      <Header />
      <NewWrapper>
        <NewTitle>立即開始，搜尋理想房源</NewTitle>
        <Selector
          allData={allData}
          setApartments={setApartments}
          setPaging={setPaging}
        />
        <Cards>
          {apartments.length
            ? apartments
                .slice(itemsPerPage * (paging - 1), itemsPerPage * paging)
                .map((apartment, index) => (
                  <Card key={apartment.basic.id} detail={apartment.basic} />
                ))
            : "無符合物件"}
        </Cards>
        <PagingList>
          {apartments.length
            ? createPaging(Math.ceil(apartments.length / itemsPerPage)).map(
                (number, index) => (
                  <PagingItem
                    key={index}
                    onClick={() => setPaging(number + 1)}
                    active={paging === number + 1}
                  >
                    {number + 1}
                  </PagingItem>
                )
              )
            : ""}
        </PagingList>
      </NewWrapper>
    </>
  );
}

export default Apartments;
