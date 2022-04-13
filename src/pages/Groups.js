import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import Header from "../components/Header";
import GroupMember from "../components/GroupMember";
import GroupTeam from "../components/GroupTeam";

const Wrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
`;

const Banner = styled.div`
  width: 100%;
  height: 350px;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 20px;
`;

const GroupHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const SubTitles = styled.div`
  display: flex;
  align-items: center;
`;

const SubTitle = styled.div`
  font-size: 14px;
  color: #a1aeb7;
  margin-left: 30px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

const ExitButton = styled.button`
  background: none;
  border: 1px solid #424b5a;
  color: #424b5a;
  width: 100px;
  margin-right: 20px;

  &:hover {
    border: 1px solid transparent;
    background: #c1b18a;
    color: #fff;
  }
`;

const GroupBody = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

function Groups() {
  const { id } = useParams();
  const [apartmentData, setApartmentData] = React.useState([]);
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function getGroupData() {
      if (!mounted) return;
      // refactor me by creating api functions
      const groupQuery = Firebase.query(
        Firebase.collection(Firebase.db, "groups"),
        Firebase.where("id", "==", id)
      );
      const groupQSnap = await Firebase.getDocs(groupQuery);
      const groupData = groupQSnap.docs.map((doc) => doc.data())[0];

      const { apartmentId } = groupData;
      const apartmentQuery = Firebase.query(
        Firebase.collection(Firebase.db, "apartments"),
        Firebase.where("id", "==", apartmentId)
      );
      const apartmentQSnap = await Firebase.getDocs(apartmentQuery);
      setApartmentData(apartmentQSnap.docs.map((doc) => doc.data())[0]);

      const users = groupData.members;
      const userQuery = Firebase.query(
        Firebase.collection(Firebase.db, "users"),
        Firebase.where("uid", "in", users)
      );
      const usersQSnap = await Firebase.getDocs(userQuery);
      setMembers(usersQSnap.docs.map((doc) => doc.data()));
    }
    getGroupData();

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Header />
      <Wrapper>
        <Banner src={apartmentData.coverImage} />
        <GroupHeader>
          <SubTitles>
            <Title>{apartmentData.title}</Title>
            <SubTitle>{`成團人數：${apartmentData.roomiesCount}人`}</SubTitle>
            <SubTitle>{`${members.length}人已加入`}</SubTitle>
          </SubTitles>
          <Buttons>
            <ExitButton>退出</ExitButton>
            <button>邀請</button>
          </Buttons>
        </GroupHeader>
        <GroupBody>
          <GroupMember members={members} />
          <GroupTeam aid={apartmentData.id} />
        </GroupBody>
      </Wrapper>
    </>
  );
}

export default Groups;
