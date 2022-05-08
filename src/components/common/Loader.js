import React from "react";
import styled, { keyframes } from "styled-components";
import { subColor } from "../../styles/GlobalStyle";
import { FlexWrapper } from "./Components";

const spin = keyframes`
0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
}
100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
}`;

const LoaderWrapper = styled(FlexWrapper)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #fff;
  transition: opacity 0.5s, visibility 0.5s;
`;

const Spinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
`;

const SpinnerChild = styled.div`
  position: absolute;
  border: 4px solid ${subColor};
  opacity: 1;
  border-radius: 50%;
  animation: ${spin} 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  animation-delay: -0.5s;
`;

export default function Loader() {
  return (
    <LoaderWrapper>
      <Spinner>
        <SpinnerChild />
      </Spinner>
    </LoaderWrapper>
  );
}
