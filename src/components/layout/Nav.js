import React from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";

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
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);

  function Render() {
    if (loading) {
      return null;
    }
    if (user) {
      return (
        <StyledNavLink
          to="/community"
          style={
            location.pathname === "/community" ||
            location.pathname.startsWith("/users/")
              ? activeStyle
              : {}
          }
        >
          社群
        </StyledNavLink>
      );
    }
    if (error) {
      return null;
    }
  }

  return (
    <Wrapper>
      <StyledNavLink
        to="/apartments"
        style={
          location.pathname === "/apartments" ||
          location.pathname.startsWith("/apartment/") ||
          location.pathname.startsWith("/groups/")
            ? activeStyle
            : {}
        }
      >
        所有房源
      </StyledNavLink>
      <StyledNavLink
        to="/explore"
        style={location.pathname === "/explore" ? activeStyle : {}}
      >
        探索
      </StyledNavLink>
      {Render()}
    </Wrapper>
  );
}

export default NavBar;
