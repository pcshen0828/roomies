import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./Nav";
import LoggedIn from "./LoggenIn";
import NotLoggedIn from "./NotLoggedIn";
import userContext from "../../context/userContext";
import { FlexWrapper } from "../common/Components";

const Wrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #ccc;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const InnerWrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IndexLink = styled(Link)`
  color: #424b5a;
`;

function Header() {
  const context = React.useContext(userContext);
  return (
    <Wrapper>
      <InnerWrapper>
        <FlexWrapper>
          <IndexLink to="/">logo</IndexLink>
          <NavBar />
        </FlexWrapper>
        {!context.id ? <LoggedIn /> : <NotLoggedIn />}
      </InnerWrapper>
    </Wrapper>
  );
}

export default Header;
