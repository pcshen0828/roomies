import React from "react";
import styled from "styled-components";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";

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

function HobbyCard({ name, setUsers, selected, setSelected }) {
  async function searchByHobby(hobby) {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "users"),
      Firebase.where("role", "==", 1),
      Firebase.where("hobbies", "array-contains", hobby)
    );
    const querySnapShot = await Firebase.getDocs(query);
    const result = querySnapShot.docs.map((doc) => doc.data());
    setUsers(result);
  }

  return (
    <Card
      active={selected === name}
      onClick={() => {
        console.log(name);
        searchByHobby(name);
        setSelected(name);
      }}
    >
      {name}
    </Card>
  );
}

export default HobbyCard;
