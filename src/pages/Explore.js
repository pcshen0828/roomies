import { useEffect } from "react";
import scrollToTop from "../utils/scroll";
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
import { FooterHeight, HeaderHeight } from "../styles/GlobalStyle";

const Container = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 40px;
  min-height: calc(100vh - ${HeaderHeight + FooterHeight}px);
`;

const NewWrapper = styled(Wrapper)`
  margin-bottom: 20px;
`;

function Explore() {
  useEffect(() => {
    scrollToTop();
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
