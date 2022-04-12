import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import Header from "../components/Header";

const Wrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  border: 1px solid #000;
`;

function Groups() {
  const { id } = useParams();
  const [apartmentData, setApartmentData] = React.useState([]);
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    // 1. get group data
    async function getGroupData() {
      const groupQuery = Firebase.query(
        Firebase.collection(Firebase.db, "groups"),
        Firebase.where("id", "==", id)
      );
      const groupQSnap = await Firebase.getDocs(groupQuery);
      const groupData = groupQSnap.docs.map((doc) => doc.data())[0];

      // 2. get apartment data
      const { apartmentId } = groupData;
      const apartmentQuery = Firebase.query(
        Firebase.collection(Firebase.db, "apartments"),
        Firebase.where("id", "==", apartmentId)
      );
      const apartmentQSnap = await Firebase.getDocs(apartmentQuery);
      setApartmentData(apartmentQSnap.docs.map((doc) => doc.data()));

      // 3. get user data (executed by component)
      const users = groupData.members;
      console.log(users);
      const userQuery = Firebase.query(
        Firebase.collection(Firebase.db, "users"),
        Firebase.where("uid", "in", users)
      );
      const usersQSnap = await Firebase.getDocs(userQuery);
      setMembers(usersQSnap.docs.map((doc) => doc.data()));
    }
    getGroupData();
  }, []);

  return (
    <>
      <Header />
      <Wrapper></Wrapper>
    </>
  );
}

export default Groups;
