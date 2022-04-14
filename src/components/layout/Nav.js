import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
`;

const StyledNavLink = styled(NavLink)`
  color: #000;
  display: flex;
  align-items: center;
  margin-left: 30px;
`;

function NavBar() {
  return (
    <Wrapper>
      <StyledNavLink to="/about">關於</StyledNavLink>
      <StyledNavLink to="/apartments">所有房源</StyledNavLink>
      <StyledNavLink to="/explore">探索</StyledNavLink>
    </Wrapper>
  );
}

export default NavBar;
