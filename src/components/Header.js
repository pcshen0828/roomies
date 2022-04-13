import styled from "styled-components";
import NavBar from "./Nav";
import { Link } from "react-router-dom";

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
  align-items: center;
`;

const IndexLink = styled(Link)`
  color: #424b5a;
`;

function Header() {
  return (
    <Wrapper>
      <InnerWrapper>
        <IndexLink to="/">logo</IndexLink>
        <NavBar />
      </InnerWrapper>
    </Wrapper>
  );
}

export default Header;
