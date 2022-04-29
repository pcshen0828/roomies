import React from "react";
import styled from "styled-components";
import CheckTeamMembersModal from "../modals/CheckTeamMembers";
import ApplyJoinModal from "../modals/ApplyToJoinTeam";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Button1 } from "../common/Components";

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

const JoinButton = styled(Button1)`
  width: 100px;
  height: 35px;
`;

const ShowStatus = styled(Button1)`
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

function TeamCard({ team, roomies }) {
  const [openMemberListModal, setOpenMemberListModal] = React.useState(false);
  const [openAppliedModal, setOpenAppliedModal] = React.useState(false);
  const { currentUser } = useAuth();

  async function joinTeam() {
    api.updateDocData("teams", team.id, {
      members: [...team.members, { uid: currentUser.uid, status: 3 }],
      userIDs: [...team.userIDs, currentUser.uid],
    });
    const host = team.members.find((member) => member.status === 0).uid;
    api.createNoticeByType(currentUser.uid, host, 0);
    setOpenAppliedModal(true);
  }
  const ifUserincludes = team.members.find(
    (member) => member.uid === currentUser.uid
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
          team={team}
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
          ) : team.members.length < roomies ? (
            <JoinButton onClick={joinTeam}>申請加入</JoinButton>
          ) : (
            <ShowStatus>已額滿</ShowStatus>
          )}
        </Bottom>
      </Wrapper>
    </>
  );
}

export default TeamCard;
