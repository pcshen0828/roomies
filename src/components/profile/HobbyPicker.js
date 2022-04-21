import React from "react";
import styled from "styled-components";
import { FlexWrapper } from "../common/Components";

const HobbyList = styled.div`
  width: calc(90% + 12px);
  height: 150px;
  overflow-y: scroll;
  border: 1px solid #dadada;
  margin: -20px 0 20px;
  display: flex;
  flex-direction: column;
`;

const HobbyItem = styled(FlexWrapper)`
  width: 100%;
  height: 25px;
  padding: 5px 10px;
  font-size: 14px;
  color: #a1aeb7;
  cursor: pointer;
  &:hover {
    background: #e8e8e8;
  }
`;

function HobbyPicker({ hobbyList, toggle, setHobbies, setHobbyList }) {
  return (
    <HobbyList>
      {hobbyList.map((item, index) => (
        <HobbyItem
          key={index}
          onClick={() => {
            setHobbies((prev) => [...prev, item]);
            setHobbyList((prev) => prev.filter((name) => name !== item));
            toggle(false);
          }}
        >
          {item}
        </HobbyItem>
      ))}
    </HobbyList>
  );
}

export default HobbyPicker;
