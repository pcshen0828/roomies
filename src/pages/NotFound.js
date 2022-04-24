import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/layout/Header";
import { Wrapper, Button1 } from "../components/common/Components";
const Reminder = styled.div`
  margin-bottom: 20px;
`;

function PageNotFound() {
  return (
    <>
      <Header />
      <Wrapper>
        <Reminder>看來你點進了不存在的頁面喔！</Reminder>
        <Link to="/">
          <Button1>回到首頁</Button1>
        </Link>
      </Wrapper>
    </>
  );
}

export default PageNotFound;
