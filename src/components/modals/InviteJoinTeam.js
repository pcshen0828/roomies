import { useState } from "react";
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
  const [queryName, setQueryName] = useState("");
  const [queriedUsers, setQueriedUsers] = useState([]);
  const [defaultResponse, setDefaultResponse] = useState("");
  const [inviteList, setInviteList] = useState([]);
  const { currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);

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
    toggle();
  }

  return (
    <Overlay out={false}>
      {openConfirm && (
        <ConfirmBeforeActionModal
          message="???????????????"
          action={inviteNewMember}
          toggle={() => setOpenConfirm(false)}
        />
      )}
      <NewModal>
        <Header>
          <Title>???????????????????????????</Title>
          <CloseButton onClick={() => toggle()}>??</CloseButton>
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
                    ??????
                  </InviteButton>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 1 ? (
                  <Status>??????</Status>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 2 ? (
                  <Status>?????????</Status>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 3 ? (
                  <Status>?????????</Status>
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
          ??????
        </Button>
      </NewModal>
    </Overlay>
  );
}

InviteJoinTeamModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  groupMemberDetail: PropTypes.array.isRequired,
};
