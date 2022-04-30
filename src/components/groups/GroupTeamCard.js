import React from "react";
import styled from "styled-components";
import CheckTeamMembersModal from "../modals/CheckTeamMembers";
import ApplyJoinModal from "../modals/ApplyToJoinTeam";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Bold, Button1, FlexWrapper, Title } from "../common/Components";
import member from "../../images/members.svg";
import InviteJoinTeamModal from "../modals/InviteJoinTeam";

const defaultCardStyle = `
  border-radius: 10px;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
`;

// #c1b18a

const Wrapper = styled(FlexWrapper)`
  ${defaultCardStyle}
  width: 99.5%;
  height: 200px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  ${"" /* border: 1px solid #e8e8e8; */}
  padding: 30px 0 10px;
  @media screen and (max-width: 995.98px) {
    height: 180px;
  }
`;

const Top = styled(FlexWrapper)`
  width: 90%;
  height: 55%;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  margin-left: 10%;
`;

const TeamName = styled.div`
  cursor: pointer;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid #424b5a;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const Bottom = styled(FlexWrapper)`
  width: 90%;
  height: 45%;
  justify-content: flex-start;
  margin-left: 10%;
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

const InviteButton = styled(Button1)`
  width: 100px;
  height: 35px;
  margin-left: 10px;
`;

function TeamCard({ team, roomies, groupMemberDetail }) {
  const [openMemberListModal, setOpenMemberListModal] = React.useState(false);
  const [openAppliedModal, setOpenAppliedModal] = React.useState(false);
  const [openInviteModal, setOpenInviteModal] = React.useState(false);
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
      {openInviteModal && (
        <InviteJoinTeamModal
          toggle={setOpenInviteModal}
          team={team}
          groupMemberDetail={groupMemberDetail}
        />
      )}
      <Wrapper>
        <Top>
          <Title>{team.name}</Title>
          <TeamName onClick={() => setOpenMemberListModal(true)}>
            查看成員
          </TeamName>
          <FlexWrapper>
            <Icon alt="" src={member} />
            <div>{team.members.length}人</div>
          </FlexWrapper>
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
          {userStatus === 0 && team.members.length < roomies && (
            <InviteButton
              onClick={() => {
                setOpenInviteModal(true);
              }}
            >
              邀請
            </InviteButton>
          )}
        </Bottom>
      </Wrapper>
    </>
  );
}

export default TeamCard;
