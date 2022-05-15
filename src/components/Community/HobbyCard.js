import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 5px 10px;
  margin: 0px 10px 10px 0;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);

  background: ${(props) => (props.active ? "#c1b18a" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#424b5a")};
  &:hover {
    background: #c1b18a;
    color: #fff;
    border: 1px solid #fff;
  }
`;

function HobbyCard({
  name,
  setUsers,
  selected,
  setSelected,
  setLoading,
  allUsers,
  page,
  setPaging,
  allPages,
  calcAllPages,
}) {
  function searchByHobby(hobby) {
    setLoading(true);
    setPaging(1);
    const filteredData = allUsers.filter((user) =>
      user.hobbies.includes(hobby)
    );
    allPages.current = calcAllPages(filteredData);
    setUsers(filteredData);
    setLoading(false);
  }

  return (
    <Card
      active={selected === name}
      onClick={() => {
        page.current = 1;
        searchByHobby(name);
        setSelected(name);
      }}
    >
      {name}
    </Card>
  );
}

export default HobbyCard;
