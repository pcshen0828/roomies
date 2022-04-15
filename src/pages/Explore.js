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
import MyMap from "../components/explore/Map";
// import SearchBox from "../components/explore/SearchInput";

function Explore() {
  return (
    <>
      <Header />
      <Wrapper>
        <Title>在這裡，找到適合共居的夥伴</Title>
        <SubTitle>看看誰也在尋找附近的租屋</SubTitle>
      </Wrapper>
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
