import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Selector from "../components/ApartmentSelector";
import Card from "../components/ApartmentCard";
import { Firebase } from "../utils/firebase";

const Cards = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 320px);
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
  const query = Firebase.query(Firebase.collection(Firebase.db, "apartments"));
  React.useEffect(() => {
    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      setApartments(querySnapShot.docs.map((doc) => doc.data()));
    });

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Header />
      <Selector />
      <Cards>
        {apartments.length
          ? apartments.map((a, index) => <Card key={index} detail={a} />)
          : "目前沒有房源"}
      </Cards>
    </>
  );
}

export default Apartments;
