import React from "react";
import styled from "styled-components";
import Header from "../components/layout/Header";
import Selector from "../components/apartments/ApartmentSelector";
import Card from "../components/apartments/ApartmentCard";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";
import {
  conditionList,
  facilityList,
  furnitureList,
} from "../utils/apartmentSubCollections";

const Cards = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
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
      console.log(apartmentArray);
      setApartments(apartmentArray);
      setAllData(apartmentArray);
    });
    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Header />
      <Selector allData={allData} setApartments={setApartments} />
      <Cards>
        {apartments.length
          ? apartments.map((apartment, index) => (
              <Card key={index} detail={apartment.basic} />
            ))
          : "查無資料"}
      </Cards>
    </>
  );
}

export default Apartments;
