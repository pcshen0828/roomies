import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  font-size: 25px;
  width: 40px;
  border-radius: 50%;
`;

const Status = styled(FlexWrapper)`
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
  groupId,
}) {
  const [queryName, setQueryName] = useState("");
  const [queriedUsers, setQueriedUsers] = useState([]);
  const [defaultResponse, setDefaultResponse] = useState("");
  const [inviteList, setInviteList] = useState([]);
  const { currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);

  const [pendingList, setPendingList] = useState([]);

  useEffect(() => {
    api
      .getDataWithSingleQuery("groupInvitations", "groupId", "==", groupId)
      .then((list) => {
        setPendingList(list.map((invitation) => invitation.receiver));
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
        groupId,
        status: 0,
      });
      api.createNoticeByType(currentUser.uid, user, 8);
    });
    toggle();
    setSaved();
  }

  function cancelInvite(uid) {
    setInviteList((prev) => prev.filter((item) => item.uid !== uid));
  }

  return (
    <Overlay out={false}>
      {openConfirm && (
        <ConfirmBeforeActionModal
          message="確認邀請？"
          action={inviteNewMember}
          toggle={() => setOpenConfirm(false)}
        />
      )}
      <NewModal>
        <Header>
          <Title>邀請新用戶加入此租屋社團</Title>
          <CloseButton onClick={toggle}>×</CloseButton>
        </Header>
        <NewBody>
          <SearchAndInviteToGroup
            groupMembers={groupMembers}
            currentUser={currentUser}
            inviteList={inviteList}
            cancelInvite={cancelInvite}
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
            if (!inviteList.length) return;
            setOpenConfirm(true);
          }}
        >
          邀請
        </Button>
      </NewModal>
    </Overlay>
  );
}

InviteJoinGroupModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  groupMembers: PropTypes.array.isRequired,
  setSaved: PropTypes.func.isRequired,
  groupId: PropTypes.string.isRequired,
};
