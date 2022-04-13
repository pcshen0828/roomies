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
import userContext from "../../context/userContext";

const Members = styled.div`
  display: flex;
  flex-direction: column;
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 10px 20px;
  justify-content: space-between;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
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

const MemberStatus = styled.div`
  width: 100px;
  height: 35px;
  border: 1px solid #dadada;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
`;

const ActionButton = styled.button`
  width: 90px;
  height: 35px;
  margin-right: 10px;
`;

function CheckTeamMembersModal({ toggle, members, teamId }) {
  const [teamMembers, setTeamMembers] = React.useState([]);
  const context = React.useContext(userContext);

  // fix me
  // 如果使用者是團主的話，可以核准申請中的團員加入
  // 如果使用者被邀請中的話，可以同意加入
  // 如果使用者待核准的話，可以取消申請

  React.useEffect(() => {
    let mounted = true;
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

  function checkMemberStatus(id, statusCode) {
    return members.find((member) => member.uid === id).status === statusCode;
  }
  const condition = members.find((member) => member.uid === context.id);
  const checkUserInTeamStatus = condition ? condition.status : "";

  function addToTeam(id) {
    //  change user's status to 1
    members.find((member) => member.uid === id).status = 1;
    Firebase.updateDoc(Firebase.doc(Firebase.db, "teams", teamId), {
      members,
    });
  }

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
                    <FlexWrapper>
                      <MemberLink to={`/users/${teamMember.uid}`}>
                        <MemberImage src={teamMember.profileImage} />
                      </MemberLink>
                      <MemberInfo>
                        <MemberName>{teamMember.alias}</MemberName>
                        <>{teamMember.jobTitle}</>
                      </MemberInfo>
                    </FlexWrapper>
                    <FlexWrapper>
                      {checkUserInTeamStatus === 0 &&
                      checkMemberStatus(teamMember.uid, 3) ? (
                        <ActionButton onClick={() => addToTeam(teamMember.uid)}>
                          核准
                        </ActionButton>
                      ) : checkUserInTeamStatus === 2 &&
                        checkMemberStatus(teamMember.uid, 2) ? (
                        <ActionButton onClick={() => addToTeam(teamMember.uid)}>
                          加入
                        </ActionButton>
                      ) : (
                        ""
                      )}
                      <MemberStatus>
                        {checkMemberStatus(teamMember.uid, 0)
                          ? "團主"
                          : checkMemberStatus(teamMember.uid, 1)
                          ? "成員"
                          : checkMemberStatus(teamMember.uid, 2)
                          ? "邀請中"
                          : checkMemberStatus(teamMember.uid, 3)
                          ? "待核准"
                          : ""}
                      </MemberStatus>
                    </FlexWrapper>
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
