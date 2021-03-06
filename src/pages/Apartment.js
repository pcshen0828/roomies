import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../utils/api";
import scrollToTop from "../utils/scroll";

import styled from "styled-components";
import { FlexWrapper } from "../components/common/Components";
import ApartmentDetail from "../components/apartments/ApartmentDetail";
import Footer from "../components/layout/Footer";
import Skeleton from "react-loading-skeleton";

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
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scrollToTop();
    let mounted = true;
    api
      .getDataWithSingleQuery("apartments", "id", "==", id)
      .then((queriedApartments) => {
        if (!mounted) return;
        setDetails(queriedApartments[0]);
        setLoading(false);
      });

    return function cleanup() {
      mounted = false;
    };
  }, [id]);

  return (
    <>
      <BreadCrumb>
        {loading ? (
          <Skeleton width={40} count={1} style={{ marginRight: "10px" }} />
        ) : (
          <StyledLink to="/">首頁</StyledLink>
        )}
        <Span>{" > "}</Span>
        {loading ? (
          <Skeleton width={60} count={1} style={{ marginRight: "10px" }} />
        ) : (
          <StyledLink to="/apartments">所有房源</StyledLink>
        )}
        <Span>{" > "}</Span>
        {loading ? (
          <Skeleton width={200} count={1} />
        ) : (
          <Active>{details ? details.title : "..."}</Active>
        )}
      </BreadCrumb>
      <ApartmentDetail details={details} loading={loading}></ApartmentDetail>
      <Footer />
    </>
  );
}

export default Apartment;
