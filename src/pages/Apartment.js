import React from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import ApartmentDetail from "../components/apartments/ApartmentDetail";
import { FlexWrapper } from "../components/common/Components";
import api from "../utils/api";

const BreadCrumb = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 30px auto 20px;
  font-size: 14px;
  align-items: center;
  flex-wrap: wrap;
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
  const [details, setDetails] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    api.getDataWithSingleQuery("apartments", "id", "==", id).then((res) => {
      if (!mounted) return;
      setDetails(res);
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <>
      <BreadCrumb>
        <StyledLink to="/">首頁</StyledLink>
        <Span>{" > "}</Span>
        <StyledLink to="/apartments">所有房源</StyledLink>
        <Span>{" > "}</Span>
        <Active>{details.length ? details[0].title : "..."}</Active>
      </BreadCrumb>
      <ApartmentDetail details={details}></ApartmentDetail>
    </>
  );
}

export default Apartment;
