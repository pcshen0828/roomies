import React from "react";
import { Link } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import styled from "styled-components";
import { subColor } from "../../styles/GlobalStyle";
import { FlexWrapper } from "../common/Components";
import NavBar from "./Nav";
import MobileNavBar from "./MobileNav";
import LoggedIn from "./LoggedIn";
import NotLoggedIn from "./NotLoggedIn";
import menu from "../../images/menu.svg";

import Skeleton from "react-loading-skeleton";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  height: 80px;
  justify-content: center;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 100;
`;
const InnerWrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  justify-content: space-between;
`;

const IndexLink = styled(Link)`
  color: #424b5a;
  font-size: 20px;
  padding-bottom: 3px;
  letter-spacing: 5px;
  display: flex;
  align-items: center;
  &:hover {
    color: ${subColor};
  }
  @media screen and (max-width: 767.98px) {
    display: none;
  }
`;

const Menu = styled.img`
  width: 28px;
  height: 28px;
  display: none;
  @media screen and (max-width: 767.98px) {
    display: block;
    position: absolute;
    left: 20px;
    top: 25px;
    cursor: pointer;
  }
`;

const Logo = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 1px;
`;

function Header() {
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [toggleMenu, setToggleMenu] = React.useState(false);

  function Render() {
    if (loading) {
      return (
        <Skeleton
          width={30}
          height={30}
          inline={true}
          count={3}
          style={{ marginLeft: "20px" }}
          circle={true}
        />
      );
    }
    if (user) {
      return <LoggedIn />;
    }
    if (error) {
      return null;
    }
    return <NotLoggedIn />;
  }
  return (
    <Wrapper>
      <InnerWrapper>
        <FlexWrapper>
          <Menu src={menu} onClick={() => setToggleMenu(true)} />
          <IndexLink to="/">{/* <Logo src={logo} /> */}Roomies</IndexLink>
          <NavBar />
          {toggleMenu && <MobileNavBar toggle={setToggleMenu} />}
        </FlexWrapper>
        {Render()}
      </InnerWrapper>
    </Wrapper>
  );
}

// 寓見
export default Header;
