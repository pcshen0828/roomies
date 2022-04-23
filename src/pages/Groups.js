import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import GroupMember from "../components/groups/GroupMember";
import GroupTeam from "../components/groups/GroupTeam";
import api from "../utils/api";
import { StyledLink } from "../components/common/Components";
import { Firebase } from "../utils/firebase";

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
  const [groupMembers, setGroupMembers] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function getGroupData() {
      const query = api.createQuery("groups", "id", "==", id);
      Firebase.onSnapshot(query, (snapshot) => {
        if (!mounted) return;
        const groupData = snapshot.docs.map((doc) => doc.data())[0];
        setGroupMembers(groupData.members);
        api
          .getDataWithSingleQuery(
            "apartments",
            "id",
            "==",
            groupData.apartmentId
          )
          .then((res) => setApartmentData(res[0]));
        api
          .getDataWithSingleQuery("users", "uid", "in", groupData.members)
          .then((res) => setMembers(res));
      });
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
            <StyledLink to={`/apartment/${apartmentData.id}`}>
              <Title>{apartmentData.title}</Title>
            </StyledLink>
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
          <GroupTeam
            roomies={apartmentData.roomiesCount}
            aid={apartmentData.id}
            members={groupMembers}
            groupId={id}
          />
        </GroupBody>
      </Wrapper>
    </>
  );
}

export default Groups;
