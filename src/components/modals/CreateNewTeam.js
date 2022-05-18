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
import { Button1 } from "../common/Components";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";
import SearchAndInviteToTeam from "../groups/SearchInviteUsersToTeam";

const NewBody = styled(Body)`
  border: none;
  display: flex;
  flex-direction: column;
  height: 300px;
`;

const SmallTitle = styled(Title)`
  font-size: 14px;
  margin-bottom: 10px;
`;

const SmallText = styled.div`
  font-size: 14px;
`;

const Input = styled.input`
  width: 90%;
  height: 30px;
  border: 1px solid #dadada;
  margin-bottom: 20px;
  padding-left: 10px;
  color: #424b5a;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

const QueriedUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  margin-bottom: 10px;
`;

const FlexWrapper = styled.div`
  display: flex;
  margin-right: 10px;
`;

const UserImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const InviteButton = styled(Button1)`
  width: 90px;
  height: 35px;
`;

function NewTeamModal({
  toggle,
  aid,
  members,
  groupId,
  groupMemberDetail,
  setSaved,
}) {
  const [teamName, setTeamName] = React.useState("");
  const [queriedUsers, setQueriedUsers] = React.useState([]);
  const [queryName, setQueryName] = React.useState("");
  const [defaultResponse, setDefaultResponse] = React.useState("");
  const [inviteList, setInviteList] = React.useState([]);
  const { currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = React.useState(false);

  async function createTeam() {
    if (!teamName.trim()) return;
    const newTeamRef = api.createNewDocRef("teams");
    const time = Firebase.Timestamp.fromDate(new Date());
    const newList = inviteList.map(({ name, ...rest }) => {
      return rest;
    });
    const uids = newList.map((user) => user.uid);
    newList.push({ uid: currentUser.uid, status: 0 });
    api.setNewDoc(newTeamRef, {
      id: newTeamRef.id,
      apartmentID: aid,
      name: teamName,
      members: newList,
      userIDs: [...uids, currentUser.uid],
      createTime: time,
      updateTime: time,
    });
    const newToGroupList = newList
      .filter((user) => !members.includes(user.uid))
      .map((user) => user.uid);
    if (newToGroupList.length) {
      api.updateDocData("groups", groupId, {
        members: [...members, ...newToGroupList],
      });
    }
    uids.forEach((uid) => {
      api.createNoticeByType(currentUser.uid, uid, 4);
    });
    setSaved(true);
    toggle(false);
  }

  return (
    <Overlay out={false}>
      {openConfirm && (
        <ConfirmBeforeActionModal
          message="確認建立租屋隊伍？"
          action={createTeam}
          toggle={setOpenConfirm}
        />
      )}
      <Modal>
        <Header>
          <Title>建立租屋隊伍</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle>隊伍名稱</SmallTitle>
          <Input
            placeholder="請輸入隊伍名稱"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
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
          {queriedUsers.length
            ? queriedUsers.map((user, index) => (
                <QueriedUser key={index}>
                  <FlexWrapper>
                    <UserImage src={user.profileImage} />
                    <UserInfo>
                      <SmallTitle>{user.alias}</SmallTitle>
                      <SmallText>{user.jobTitle}</SmallText>
                    </UserInfo>
                  </FlexWrapper>
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
                    邀請
                  </InviteButton>
                </QueriedUser>
              ))
            : defaultResponse}
        </NewBody>
        <Button
          onClick={() => {
            setOpenConfirm(true);
          }}
        >
          確認建立
        </Button>
      </Modal>
    </Overlay>
  );
}

export default NewTeamModal;
