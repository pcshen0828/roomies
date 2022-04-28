import React from "react";
import styled from "styled-components";
import {
  Wrapper,
  Title,
  SubTitle,
  BodyWrapper,
  BodyLeft,
  BodyRight,
} from "../components/common/Components";
import MyMap from "../components/explore/Map";

const NewWrapper = styled(Wrapper)`
  margin-bottom: 30px;
`;

function Explore() {
  return (
    <>
      <NewWrapper>
        <Title>探索附近的租屋</Title>
        <SubTitle>用地圖快速瀏覽公寓周邊交通與生活機能</SubTitle>
      </NewWrapper>
      <BodyWrapper>
        <MyMap />
        {/* <BodyLeft></BodyLeft> */}
        {/* <BodyRight> */}
        {/* </BodyRight> */}
      </BodyWrapper>
    </>
  );
}

export default Explore;
