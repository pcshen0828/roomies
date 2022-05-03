import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Wrapper, Button1 } from "../components/common/Components";

const NewWrapper = styled(Wrapper)`
  height: calc(100vh - 80px - 371px);
`;
const Reminder = styled.div`
  margin-bottom: 20px;
`;

function PageNotFound() {
  return (
    <NewWrapper>
      <Reminder>看來你點進了不存在的頁面喔！</Reminder>
      <Link to="/">
        <Button1>回到首頁</Button1>
      </Link>
    </NewWrapper>
  );
}

export default PageNotFound;
