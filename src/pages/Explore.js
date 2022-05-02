import React from "react";
import styled from "styled-components";
import {
  Wrapper,
  Title,
  SubTitle,
  BodyWrapper,
  FlexWrapper,
} from "../components/common/Components";
import MyMap from "../components/explore/Map";

const Container = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 40px;
`;

const NewWrapper = styled(Wrapper)`
  margin-bottom: 20px;
`;

function Explore() {
  return (
    <Container>
      <NewWrapper>
        <Title>探索附近的租屋</Title>
        <SubTitle>用地圖快速瀏覽公寓周邊交通與生活機能</SubTitle>
      </NewWrapper>
      <BodyWrapper>
        <MyMap />
      </BodyWrapper>
    </Container>
  );
}

export default Explore;
