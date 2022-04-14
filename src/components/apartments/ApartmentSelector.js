import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  border: 1px solid #ccc;
  height: 100px;
`;

function Selector() {
  return <Wrapper>selector</Wrapper>;
}

export default Selector;
