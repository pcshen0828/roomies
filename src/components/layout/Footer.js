import React from "react";
import styled from "styled-components";
import { FlexWrapper } from "../common/Components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  background: #c1b18a;
  postion: sticky;
  bottom: 0;
  left: 0;
  border-top: 1px solid #dadada;
  padding: 20px 0 10px;
`;

const InnerWrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  height: 200px;
  margin: 20px auto;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const LinksContainer = styled(FlexWrapper)`
  align-items: flex-start;
  margin-bottom: 20px;
`;

const LinksWrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 60px;
`;

const StyledLink = styled(Link)`
  display: block;
  padding: 5px 10px 3px 0;
  color: #424b5a;
  font-size: 14px;
  margin-bottom: 10px;
  ${"" /* border-bottom: 1px solid transparent; */}

  &:hover {
    color: #fff;
    ${"" /* border-bottom: 1px solid #fff; */}
  }
`;

const CopyrightWrapper = styled(FlexWrapper)`
  width: 100%;
  font-size: 14px;
  padding: 10px 0 10px;
  justify-content: flex-end;
`;

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <Wrapper>
      <InnerWrapper>
        <LinksContainer>
          <LinksWrapper>
            <StyledLink to="/">關於</StyledLink>
            <StyledLink to="/">聯繫我們</StyledLink>
            <StyledLink to="/">最新消息</StyledLink>
            <StyledLink to="/">常見問題</StyledLink>
          </LinksWrapper>
          <LinksWrapper>
            <StyledLink to="/apartments">所有房源</StyledLink>
            <StyledLink to="/explore">探索</StyledLink>
          </LinksWrapper>
        </LinksContainer>
        <CopyrightWrapper>
          寓見 Roomies &copy; {year} All rights reserved.
        </CopyrightWrapper>
      </InnerWrapper>
    </Wrapper>
  );
}
