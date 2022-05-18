import React, { useEffect } from "react";
import styled from "styled-components";
import {
  Wrapper,
  Title,
  SubTitle,
  BodyWrapper,
  FlexWrapper,
} from "../components/common/Components";
import MyMap from "../components/explore/Map";
import Footer from "../components/layout/Footer";

const Container = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 40px;
  min-height: calc(100vh - 221px);
`;

const NewWrapper = styled(Wrapper)`
  margin-bottom: 20px;
`;

function Explore() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Container>
        <NewWrapper>
          <Title>探索附近的租屋</Title>
          <SubTitle>用地圖快速瀏覽公寓周邊交通與生活機能</SubTitle>
        </NewWrapper>
        <BodyWrapper>
          <MyMap />
        </BodyWrapper>
      </Container>
      <Footer />
    </>
  );
}

export default Explore;
