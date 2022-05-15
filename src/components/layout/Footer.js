import React from "react";
import styled from "styled-components";
import { FlexWrapper } from "../common/Components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  background: #c1b18a;
  background-origin: border-box;
  border-top: 1px solid #dadada;
  padding: 20px 0 0px;
`;

const InnerWrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  justify-content: space-between;
  @media screen and (max-width: 767.98px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const ContactWrapper = styled(FlexWrapper)`
  width: 100%;
  font-size: 14px;
  padding: 10px 0;
`;

const CopyrightWrapper = styled(FlexWrapper)`
  width: 100%;
  font-size: 14px;
  padding: 10px 0;
  justify-content: flex-end;
`;

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <Wrapper>
      <InnerWrapper>
        <ContactWrapper>Contact me: michelleshen0828@gmail.com</ContactWrapper>
        <CopyrightWrapper>
          寓見 Roomies &copy; {year} All rights reserved.
        </CopyrightWrapper>
      </InnerWrapper>
    </Wrapper>
  );
}
