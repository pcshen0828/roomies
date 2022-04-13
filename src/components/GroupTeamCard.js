import React from "react";
import styled from "styled-components";
import CheckTeamMembersModal from "./modals/CheckTeamMembers";
import ApplyJoinModal from "./modals/ApplyToJoinTeam";
import userContext from "../context/userContext";
import { Firebase } from "../utils/firebase";

const Wrapper = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid #dadada;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
`;

const Top = styled.div`
  width: 100%;
  height: 55%;
  background: #dadada;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const TeamName = styled.div`
  cursor: pointer;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid #424b5a;
  }
`;

const Bottom = styled.div`
  width: 100%;
  height: 45%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const JoinButton = styled.button`
  width: 100px;
  height: 35px;
`;

const ShowStatus = styled.button`
  width: 100px;
  height: 35px;
  background: #dadada;
  color: #424b5a;
  cursor: default;

  &:hover {
    background: #dadada;
    color: #424b5a;
  }
`;

function TeamCard({ team }) {
  const [openMemberListModal, setOpenMemberListModal] = React.useState(false);
  const [openAppliedModal, setOpenAppliedModal] = React.useState(false);
  const context = React.useContext(userContext);

  async function joinTeam() {
    Firebase.updateDoc(Firebase.doc(Firebase.db, "teams", team.id), {
      members: [...team.members, { uid: context.id, status: 3 }],
    });
    setOpenAppliedModal(true);
  }
  const ifUserincludes = team.members.find(
    (member) => member.uid === context.id
  );
  const userStatus = ifUserincludes ? ifUserincludes.status : 4;

  return (
    <>
      {openAppliedModal && <ApplyJoinModal toggle={setOpenAppliedModal} />}
      {openMemberListModal && (
        <CheckTeamMembersModal
          toggle={setOpenMemberListModal}
          members={team.members}
          teamId={team.id}
        />
      )}
      <Wrapper>
        <Top>
          <TeamName onClick={() => setOpenMemberListModal(true)}>
            {team.name}
          </TeamName>
          <div>{team.members.length}</div>
        </Top>
        <Bottom>
          {userStatus === 0 || userStatus === 1 ? (
            <ShowStatus>已加入</ShowStatus>
          ) : userStatus === 2 ? (
            <ShowStatus>邀請中</ShowStatus>
          ) : userStatus === 3 ? (
            <ShowStatus>待核准</ShowStatus>
          ) : (
            <JoinButton onClick={joinTeam}>申請加入</JoinButton>
          )}
        </Bottom>
      </Wrapper>
    </>
  );
}

export default TeamCard;
