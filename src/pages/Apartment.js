import React from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import ApartmentDetail from "../components/apartments/ApartmentDetail";
import { FlexWrapper } from "../components/common/Components";

const BreadCrumb = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 30px auto 20px;
  font-size: 14px;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
  margin-right: 10px;
  &:hover {
    color: #c1b18a;
  }
`;

const Span = styled.span`
  margin-right: 10px;
`;

const Active = styled.div`
  font-weight: 700;
`;

function Apartment() {
  const { id } = useParams();

  return (
    <>
      <Header />
      <BreadCrumb>
        <StyledLink to="/">首頁</StyledLink>
        <Span>{" > "}</Span>
        <StyledLink to="/apartments">所有房源</StyledLink>
        <Span>{" > "}</Span>
        <Active>{id}</Active>
      </BreadCrumb>
      <ApartmentDetail></ApartmentDetail>
    </>
  );
}

export default Apartment;
