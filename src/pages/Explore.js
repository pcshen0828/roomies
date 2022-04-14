import React from "react";
import styled from "styled-components";
import Header from "../components/layout/Header";
import {
  Wrapper,
  Title,
  SubTitle,
  BodyWrapper,
  BodyLeft,
  BodyRight,
} from "../components/common/Components";
import ExploreMap from "../components/explore/ExploreMap";

function Explore() {
  return (
    <>
      <Header />
      <Wrapper>
        <Title>在這裡，找到適合共居的夥伴</Title>
        <SubTitle>看看誰也在尋找附近的租屋</SubTitle>
      </Wrapper>
      <BodyWrapper>
        <BodyLeft>left</BodyLeft>
        <BodyRight>
          <ExploreMap />
        </BodyRight>
      </BodyWrapper>
    </>
  );
}

export default Explore;
