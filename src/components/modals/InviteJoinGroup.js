import React from "react";
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
import { Button1, SmallTitle } from "../common/Components";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";
import SearchAndInviteToGroup from "../groups/SearchInviteUsersToGroup";

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

const QueriedUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin-bottom: 20px;
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
  font-size: 25px;
  width: 40px;
  border-radius: 50%;
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

export default function InviteJoinGroupModal({
  toggle,
  groupMembers,
  setSaved,
}) {
  const [queryName, setQueryName] = React.useState("");
  const [queriedUsers, setQueriedUsers] = React.useState([]);
  const [defaultResponse, setDefaultResponse] = React.useState("");
  const [inviteList, setInviteList] = React.useState([]);
  const { currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const [pendingList, setPendingList] = React.useState([]);

  React.useEffect(() => {
    api.getAllDocsFromCollection("groupInvitations").then((res) => {
      setPendingList(res.map((list) => list.receiver));
    });
  }, []);

  async function inviteNewMember() {
    const newList = inviteList.map(({ name, ...rest }) => {
      return rest;
    });
    const uids = newList.map((user) => user.uid);

    uids.forEach((user) => {
      const newDocRef = api.createNewDocRef("groupInvitations");
      const time = Firebase.Timestamp.fromDate(new Date());
      api.setNewDoc(newDocRef, {
        id: newDocRef.id,
        createTime: time,
        sender: currentUser.uid,
        receiver: user,
        status: 0,
      });
      api.createNoticeByType(currentUser.uid, user, 8);
    });
    toggle(false);
    setSaved(true);
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
          <Title>邀請新成員</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SearchAndInviteToGroup
            groupMembers={groupMembers}
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
                <FlexWrapper>
                  <UserImage src={user.profileImage} />
                  <UserInfo>
                    <SmallTitle>{user.alias}</SmallTitle>
                    <SmallText>{user.jobTitle}</SmallText>
                  </UserInfo>
                </FlexWrapper>
                {groupMembers.includes(user.uid) ? (
                  <Status>成員</Status>
                ) : pendingList.includes(user.uid) ? (
                  <Status>邀請中</Status>
                ) : (
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
                    +
                  </InviteButton>
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
