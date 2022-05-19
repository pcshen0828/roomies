import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import defaultScroll from "../utils/defaultScroll";
import styled from "styled-components";
import { Wrapper, Button1, Title } from "../components/common/Components";
import Footer from "../components/layout/Footer";
import lost from "../images/lost.png";

const NewWrapper = styled(Wrapper)`
  min-height: calc(100vh - 261px);
  align-items: flex-start;
  justify-content: center;
  position: relative;
`;
const Reminder = styled.div`
  margin-bottom: 20px;
  z-index: 1;
`;

const Image = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 65%;
  height: 100%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.6;
`;

function PageNotFound() {
  useEffect(() => {
    defaultScroll();
  }, []);
  return (
    <>
      <NewWrapper>
        <Image src={lost} />
        <Title>404 Page Not Found</Title>
        <Reminder>看來你點進了不存在的頁面喔！</Reminder>
        <Link to="/">
          <Button1>回到首頁</Button1>
        </Link>
      </NewWrapper>
      <Footer />
    </>
  );
}

export default PageNotFound;
