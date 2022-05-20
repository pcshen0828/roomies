import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import { Button1, ExitButton, FlexWrapper, Title } from "../common/Components";
import CheckTeamMembersModal from "../modals/CheckTeamMembers";
import ApplyJoinModal from "../modals/ApplyToJoinTeam";
import InviteJoinTeamModal from "../modals/InviteJoinTeam";
import ConfirmBeforeActionModal from "../modals/ConfirmBeforeAction";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";

import member from "../../images/members.svg";
import exit from "../../images/exit.svg";

const defaultCardStyle = `
  border-radius: 10px;
  align-items: center;
  margin-bottom: 20px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
`;

const Wrapper = styled(FlexWrapper)`
  ${defaultCardStyle}
  width: 99.5%;
  height: ${(props) => (props.isOwner ? "180px" : "200px")};
  flex-direction: column;
  justify-content: ${(props) => (props.isOwner ? "center" : "flex-start")};
  align-items: flex-start;
  border-radius: 10px;
  padding: ${(props) => (props.isOwner ? "0" : "30px 0 10px")};
  @media screen and (max-width: 995.98px) {
    height: 180px;
  }
`;

const Top = styled(FlexWrapper)`
  width: 90%;
  height: ${(props) => (props.isOwner ? "100%" : "55%")};
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
  height: 38px;
`;

const ShowStatus = styled(Button1)`
  width: 100px;
  height: 38px;
  background: #e8e8e8;
  color: #424b5a;
  cursor: ${(props) => (props.pointer ? "pointer" : "default")};
  position: relative;

  &:hover {
    background: ${(props) => (props.pointer ? "#dadada" : "#e8e8e8")};
    color: #424b5a;
  }
`;

const InviteButton = styled(Button1)`
  width: 130px;
  height: 38px;
  margin-left: 10px;
`;

const QuitTeamModal = styled(FlexWrapper)`
  width: 200px;
  padding: 10px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  position: absolute;
  top: 40px;
  left: 0;
`;

const Dropdown = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 3px;
  font-size: 20px;
  padding-bottom: 3px;
`;

const DropDownWrapper = styled(FlexWrapper)`
  justify-content: center;
`;

function TeamCard({ team, roomies, groupMemberDetail, isOwner }) {
  const { currentUser } = useAuth();
  const [openModalType, setOpenModalType] = useState("");
  const [openQuit, setOpenQuit] = useState(false);
  const [quitted, setQuitted] = useState(false);

  async function joinTeam() {
    api.updateDocData("teams", team.id, {
      members: [...team.members, { uid: currentUser.uid, status: 3 }],
      userIDs: [...team.userIDs, currentUser.uid],
    });
    const host = team.members.find((member) => member.status === 0).uid;
    api.createNoticeByType(currentUser.uid, host, 0);
    setOpenModalType("applied");
  }
  const ifUserincludes = team.members.find(
    (member) => member.uid === currentUser.uid
  );
  const userStatus = ifUserincludes ? ifUserincludes.status : 4;

  function quitTeam() {
    api.updateDocData("teams", team.id, {
      members: [
        ...team.members.filter((member) => member.uid !== currentUser.uid),
      ],
      userIDs: [...team.userIDs.filter((uid) => uid !== currentUser.uid)],
    });
    const host = team.members.find((member) => member.status === 0).uid;
    api.createNoticeByType(currentUser.uid, host, 11);
    setQuitted(true);
  }

  function closeModal() {
    setOpenModalType("");
  }

  return (
    <>
      {quitted && (
        <SuccessfullySavedModal message="成功退出" toggle={setQuitted} />
      )}
      {openModalType === "applied" && <ApplyJoinModal toggle={closeModal} />}
      {openModalType === "memberList" && (
        <CheckTeamMembersModal
          toggle={() => {
            setOpenModalType("");
          }}
          members={team.members}
          teamId={team.id}
          team={team}
        />
      )}
      {openModalType === "invite" && (
        <InviteJoinTeamModal
          toggle={closeModal}
          team={team}
          groupMemberDetail={groupMemberDetail}
        />
      )}
      {openModalType === "confirmJoin" && (
        <ConfirmBeforeActionModal
          message="確認申請加入？"
          action={joinTeam}
          toggle={closeModal}
        />
      )}
      {openModalType === "confirmQuit" && (
        <ConfirmBeforeActionModal
          message="確認退出此隊伍？"
          action={quitTeam}
          toggle={closeModal}
        />
      )}
      <Wrapper
        isOwner={isOwner}
        onClick={() => {
          setOpenQuit(false);
        }}
      >
        <Top>
          <Title>{team.name}</Title>
          <TeamName onClick={() => setOpenModalType("memberList")}>
            查看成員
          </TeamName>
          <FlexWrapper>
            <Icon alt="" src={member} />
            <div>{team.members.length}人</div>
          </FlexWrapper>
        </Top>
        {isOwner ? (
          ""
        ) : (
          <Bottom>
            {userStatus === 0 || userStatus === 1 ? (
              <ShowStatus
                pointer={userStatus === 1}
                onClick={(e) => {
                  if (userStatus === 0) return;
                  e.stopPropagation();
                  setOpenQuit(true);
                }}
              >
                <DropDownWrapper>
                  已加入
                  {userStatus === 1 && <Dropdown>▾</Dropdown>}
                </DropDownWrapper>
                {userStatus === 1 && openQuit && (
                  <QuitTeamModal>
                    <ExitButton
                      onClick={() => {
                        setOpenModalType("confirmQuit");
                      }}
                    >
                      <Icon src={exit} />
                      退出
                    </ExitButton>
                  </QuitTeamModal>
                )}
              </ShowStatus>
            ) : userStatus === 2 ? (
              <ShowStatus>邀請中</ShowStatus>
            ) : userStatus === 3 ? (
              <ShowStatus>待核准</ShowStatus>
            ) : team.members.length < roomies ? (
              <JoinButton
                onClick={() => {
                  setOpenModalType("confirmJoin");
                }}
              >
                申請加入
              </JoinButton>
            ) : (
              <ShowStatus>已額滿</ShowStatus>
            )}
            {userStatus === 0 && team.members.length < roomies && (
              <InviteButton
                onClick={() => {
                  setOpenModalType("invite");
                }}
              >
                邀請社團成員
              </InviteButton>
            )}
          </Bottom>
        )}
      </Wrapper>
    </>
  );
}

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  roomies: PropTypes.number.isRequired,
  groupMemberDetail: PropTypes.array.isRequired,
  isOwner: PropTypes.bool.isRequired,
};

export default TeamCard;
