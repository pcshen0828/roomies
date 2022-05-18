import React from "react";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import {
  Button1,
  FlexColumn,
  FlexWrapper,
  SmallTitle,
} from "../common/Components";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";
import SearchAndInviteToTeam from "../groups/SearchInviteUsersToTeam";

const NewBody = styled(Body)`
  height: 280px;
  padding: 10px;
`;

const NewModal = styled(Modal)`
  max-width: 600px;
  @media screen and (max-width: 575.98px) {
    width: 90%;
  }
`;

const SmallText = styled.div`
  font-size: 14px;
`;

const QueriedUser = styled(FlexWrapper)`
  justify-content: space-between;
  width: 90%;
  margin-bottom: 20px;
`;

const NewFlexWrapper = styled(FlexWrapper)`
  margin-right: 10px;
`;

const UserImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled(FlexColumn)``;

const InviteButton = styled(Button1)`
  width: 90px;
  height: 35px;
`;

const Status = styled(FlexWrapper)`
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 35px;
  background: #e8e8e8;
  border-radius: 5px;
  margin: 0;
`;

export default function InviteJoinTeamModal({
  toggle,
  team,
  groupMemberDetail,
}) {
  const [queryName, setQueryName] = React.useState("");
  const [queriedUsers, setQueriedUsers] = React.useState([]);
  const [defaultResponse, setDefaultResponse] = React.useState("");
  const [inviteList, setInviteList] = React.useState([]);
  const { currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = React.useState(false);

  async function inviteNewMember() {
    const time = Firebase.Timestamp.fromDate(new Date());
    const newList = inviteList.map(({ name, ...rest }) => {
      return rest;
    });
    const uids = newList.map((user) => user.uid);
    api.updateDocData("teams", team.id, {
      members: [...team.members, ...newList],
      userIDs: [...team.userIDs, ...uids],
      updateTime: time,
    });

    uids.forEach((uid) => {
      api.createNoticeByType(currentUser.uid, uid, 4);
    });
    toggle(false);
  }

  return (
    <Overlay out={false}>
      {openConfirm && (
        <ConfirmBeforeActionModal
          message="確認邀請？"
          action={inviteNewMember}
          toggle={setOpenConfirm}
        />
      )}
      <NewModal>
        <Header>
          <Title>邀請新成員加入隊伍</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SearchAndInviteToTeam
            groupMemberDetail={groupMemberDetail}
            currentUser={currentUser}
            inviteList={inviteList}
            setInviteList={setInviteList}
            setQueriedUsers={setQueriedUsers}
            queryName={queryName}
            setQueryName={setQueryName}
            setDefaultResponse={setDefaultResponse}
          />
          {queriedUsers.length ? (
            queriedUsers.map((user, index) => (
              <QueriedUser key={index}>
                <NewFlexWrapper>
                  <UserImage src={user.profileImage} />
                  <UserInfo>
                    <SmallTitle>{user.alias}</SmallTitle>
                    <SmallText>{user.jobTitle}</SmallText>
                  </UserInfo>
                </NewFlexWrapper>
                {!team.members
                  .map((member) => member.uid)
                  .includes(user.uid) ? (
                  <InviteButton
                    onClick={() => {
                      setInviteList((prev) => [
                        ...prev,
                        { uid: user.uid, name: user.alias, status: 2 },
                      ]);
                      setQueryName("");
                      setQueriedUsers([]);
                    }}
                  >
                    新增
                  </InviteButton>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 1 ? (
                  <Status>成員</Status>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 2 ? (
                  <Status>邀請中</Status>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 3 ? (
                  <Status>待核准</Status>
                ) : (
                  ""
                )}
              </QueriedUser>
            ))
          ) : (
            <SmallText>{defaultResponse}</SmallText>
          )}
        </NewBody>
        <Button
          onClick={() => {
            setOpenConfirm(true);
          }}
        >
          邀請
        </Button>
      </NewModal>
    </Overlay>
  );
}
