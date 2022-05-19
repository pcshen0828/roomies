import React from "react";
import styled from "styled-components";
import { mainColor, subColor } from "../../styles/GlobalStyle";

const Card = styled.div`
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 5px 10px;
  margin: 0px 10px 10px 0;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);

  background: ${(props) => (props.active ? subColor : "#fff")};
  color: ${(props) => (props.active ? "#fff" : mainColor)};
  &:hover {
    background: ${subColor};
    color: #fff;
    border: 1px solid #fff;
  }
`;

function HobbyCard({ name, selected, setSelected, setLoading, dispatch }) {
  function searchByHobby(hobby) {
    setLoading(true);
    dispatch({ type: "filterByHobby", payload: hobby });
    setLoading(false);
  }

  return (
    <Card
      active={selected === name}
      onClick={() => {
        searchByHobby(name);
        setSelected(name);
      }}
    >
      {name}
    </Card>
  );
}

export default HobbyCard;
