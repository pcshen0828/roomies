import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

const Wrapper = styled.div``;

function Groups() {
  const { id } = useParams();
  const [groupData, setGroupData] = React.useState([]);

  return (
    <>
      <Header />
      groups
    </>
  );
}

export default Groups;
