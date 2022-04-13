import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Title,
  Body,
} from "./ModalElements";
import { Firebase } from "../../utils/firebase";

const Members = styled.div`
  display: flex;
  flex-direction: column;
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const MemberLink = styled(Link)``;

const MemberImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.div`
  font-weight: 700;
`;

function CheckTeamMembersModal({ toggle, members }) {
  const [teamMembers, setTeamMembers] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    console.log(members);
    // 抓 user 資料
    async function getTeamsMembers() {
      if (!mounted) return;
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "users"),
        Firebase.where(
          "uid",
          "in",
          members.map((member) => member.uid)
        )
      );
      const querySnapShot = await Firebase.getDocs(query);
      const memberData = querySnapShot.docs.map((doc) => doc.data());
      setTeamMembers(memberData);
    }
    getTeamsMembers();
    return function cleanup() {
      mounted = false;
    };
  }, []);
  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>群組成員</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <Body>
          <Members>
            {teamMembers.length
              ? teamMembers.map((teamMember, index) => (
                  <Member key={index}>
                    <MemberLink to={`/users/${teamMember.uid}`}>
                      <MemberImage src={teamMember.profileImage} />
                    </MemberLink>
                    <MemberInfo>
                      <MemberName>{teamMember.alias}</MemberName>
                      <>{teamMember.jobTitle}</>
                    </MemberInfo>
                  </Member>
                ))
              : "loading..."}
          </Members>
        </Body>
      </Modal>
    </Overlay>
  );
}

export default CheckTeamMembersModal;
