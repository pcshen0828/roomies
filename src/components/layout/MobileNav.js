import React from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FlexWrapper, Title } from "../common/Components";
import { Overlay } from "../modals/ModalElements";

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

  @media screen and (max-width: 767.98px) {
    margin: 0;
    width: calc(100% - 40px);
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;
    &:hover {
      background: #f2f5f7;
      border-bottom: 1px solid #e8e8e8;
    }
  }
`;

const activeStyle = {
  borderBottom: "2px solid #c1b18a",
};

const MobileWrapper = styled(Overlay)`
  top: 80px;
`;

const MobileModal = styled(FlexWrapper)`
  width: 250px;
  padding: 60px 0 60px;
  flex-direction: column;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  background: #fff;
  position: absolute;
  top: 5px;
  left: 0;
  display: none;
  @media screen and (max-width: 767.98px) {
    display: flex;
    align-items: flex-start;
    overflow: hodden;
  }
`;

const Logo = styled(Title)`
  position: absolute;
  left: 20px;
  top: 20px;
`;

const CloseButton = styled.div`
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
`;

function MobileNavBar({ toggle }) {
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
    <MobileWrapper onClick={() => toggle(false)}>
      <MobileModal onClick={(e) => e.stopPropagation()}>
        <Logo>Logo</Logo>
        <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        <StyledNavLink
          to="/"
          style={location.pathname === "/" ? activeStyle : {}}
        >
          首頁
        </StyledNavLink>
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
      </MobileModal>
    </MobileWrapper>
  );
}

export default MobileNavBar;
