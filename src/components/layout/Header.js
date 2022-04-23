import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./Nav";
import LoggedIn from "./LoggedIn";
import NotLoggedIn from "./NotLoggedIn";
import { FlexWrapper } from "../common/Components";
import { useAuth } from "../../context/AuthContext";

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
  const { currentUser } = useAuth();
  return (
    <Wrapper>
      <InnerWrapper>
        <FlexWrapper>
          <IndexLink to="/">logo</IndexLink>
          <NavBar />
        </FlexWrapper>
        {(currentUser ? currentUser.uid : "") ? <LoggedIn /> : <NotLoggedIn />}
      </InnerWrapper>
    </Wrapper>
  );
}

export default Header;
