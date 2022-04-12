import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ApartmentDetail from "../components/ApartmentDetail";

function Apartment() {
  return (
    <>
      <Header />
      <ApartmentDetail></ApartmentDetail>
    </>
  );
}

export default Apartment;