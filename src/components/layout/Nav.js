import { NavLink, useLocation } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import styled from "styled-components";
import Skeleton from "react-loading-skeleton";

const Wrapper = styled.div`
  display: flex;
  @media screen and (max-width: 767.98px) {
    display: none;
  }
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

function NavBar() {
  const location = useLocation();
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);

  function generalNav() {
    return (
      <>
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
          地圖探索
        </StyledNavLink>
      </>
    );
  }

  function Render() {
    if (loading) {
      return (
        <Skeleton
          width={60}
          inline={true}
          count={3}
          style={{ marginLeft: "30px" }}
        />
      );
    }
    if (user) {
      return (
        <>
          {generalNav()}
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
        </>
      );
    }
    if (error) {
      return null;
    }
    return generalNav();
  }

  return <Wrapper>{Render()}</Wrapper>;
}

export default NavBar;
