import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
`;

const StyledNavLink = styled(NavLink)`
  color: #424b5a;
  display: flex;
  align-items: center;
  margin-left: 30px;
  border-bottom: 2px solid transparent;
  font-weight: 700;

  &:hover {
    border-bottom: 2px solid #c1b18a;
  }
`;

const activeStyle = {
  borderBottom: "2px solid #c1b18a",
};

function NavBar() {
  const location = useLocation();

  return (
    <Wrapper>
      <StyledNavLink
        to="/about"
        style={location.pathname === "/about" ? activeStyle : {}}
      >
        關於
      </StyledNavLink>
      <StyledNavLink
        to="/apartments"
        style={location.pathname === "/apartments" ? activeStyle : {}}
      >
        所有房源
      </StyledNavLink>
      <StyledNavLink
        to="/explore"
        style={location.pathname === "/explore" ? activeStyle : {}}
      >
        探索
      </StyledNavLink>
    </Wrapper>
  );
}

export default NavBar;
