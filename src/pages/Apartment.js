import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ApartmentDetail from "../components/ApartmentDetail";

function Apartment({ uid }) {
  return (
    <>
      <Header />
      <ApartmentDetail uid={uid}></ApartmentDetail>
    </>
  );
}

export default Apartment;
