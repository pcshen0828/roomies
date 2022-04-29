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
import { Bold, SmallLabel, Input, FlexWrapper } from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";
import BookScheduleModal from "./BookSchedule";
import PopupNoticeModal from "./PopupNotice";

const NewModal = styled(Modal)`
  width: 70%;
`;

const NewBody = styled(Body)`
  height: 380px;
`;

const MemberWrapper = styled(FlexWrapper)`
  margin: 20px 10px;
`;

const Alias = styled(Bold)`
  width: 70%;
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const MemberStatus = styled(FlexWrapper)`
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #dadada;
  width: 60px;
  justify-content: center;
`;

const ApproveButton = styled(FlexWrapper)`
  width: 60px;
  padding: 5px 10px;
  border-radius: 5px;
  background: #dadada;
  cursor: pointer;
  justify-content: center;
`;

const Buttons = styled(FlexWrapper)`
  align-self: end;
  margin-top: -20px;
`;

function ManageTeamModal({ team, group, toggle }) {
  const { currentUser } = useAuth();
  const [openSchedule, setOpenSchedule] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);
  const [otherMembers, setOtherMembers] = React.useState([]);
  const [name, setName] = React.useState(team.name);
  const host = team.members.find((user) => user.status === 0).uid;
  const selfStatus = team.members.find(
    (user) => user.uid === currentUser.uid
  ).status;

  React.useEffect(() => {
    let mounted = true;
    api
      .getDataWithSingleQuery(
        "users",
        "uid",
        "in",
        team.members.map((user) => user.uid)
      )
      .then((res) => {
        if (!mounted) return;
        setOtherMembers(res);
      });

    return function cleanup() {
      mounted = false;
    };
  }, [currentUser]);

  function approveJoinTeam(user, status) {
    const time = Firebase.Timestamp.fromDate(new Date());
    team.members.find((member) => member.uid === user.uid).status = 1;
    api.updateDocData("teams", team.id, {
      members: team.members,
      updateTime: time,
    });
    if (status === 2) {
      // （被邀請者）確認加入群組
      api.createNoticeByType(currentUser.uid, host, 1);
    }
    if (status === 3) {
      // （團主）核准加入群組
      api.createNoticeByType(currentUser.uid, user.uid, 3);
    }
  }

  function updateTeamName() {
    const time = Firebase.Timestamp.fromDate(new Date());
    api
      .updateDocData("teams", team.id, {
        name,
        updateTime: time,
      })
      .then(() => {
        setOpenPopup(true);
        // toggle("");
      });
  }

  function openBookScheduleModal() {
    setOpenSchedule(true);
  }

  return (
    <>
      {openSchedule && (
        <BookScheduleModal
          host={currentUser}
          team={team}
          apartment={group}
          toggle={setOpenSchedule}
          toggleParent={toggle}
        />
      )}
      {openPopup && (
        <PopupNoticeModal message="儲存成功" toggle={setOpenPopup} />
      )}
      <Overlay>
        <NewModal>
          <Header>
            <Title>
              管理群組｜人數 {team.members.length} / {group.roomiesCount}
            </Title>
            <CloseButton onClick={() => toggle("")}>×</CloseButton>
          </Header>
          <NewBody>
            <SmallLabel>群組名稱</SmallLabel>
            <Input
              value={name}
              readOnly={selfStatus !== 0}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <SmallLabel>房源名稱</SmallLabel>
            <Input value={group.title} readOnly />
            <SmallLabel>團主</SmallLabel>
            <MemberWrapper>
              <ProfileImage
                src={
                  selfStatus !== 0
                    ? otherMembers.length &&
                      otherMembers.find((user) => user.uid === host)
                        .profileImage
                    : currentUser.profileImage
                }
              />
              <Alias>
                {selfStatus !== 0
                  ? otherMembers.length &&
                    otherMembers.find((user) => user.uid === host).alias
                  : currentUser.alias}
              </Alias>
            </MemberWrapper>
            <SmallLabel>成員</SmallLabel>
            {otherMembers
              .filter((member) => member.uid !== host)
              .map((user) => (
                <MemberWrapper key={user.uid}>
                  <ProfileImage src={user.profileImage} />
                  <Alias>{user.alias}</Alias>
                  {team.members.find((member) => member.uid === user.uid)
                    .status === 1 ? (
                    <MemberStatus>已加入</MemberStatus>
                  ) : team.members.find((member) => member.uid === user.uid)
                      .status === 2 && user.uid !== currentUser.uid ? (
                    <MemberStatus>已邀請</MemberStatus>
                  ) : team.members.find((member) => member.uid === user.uid)
                      .status === 2 && user.uid === currentUser.uid ? (
                    <ApproveButton onClick={() => approveJoinTeam(user, 2)}>
                      加入
                    </ApproveButton>
                  ) : team.members.find((member) => member.uid === user.uid)
                      .status === 3 && host !== currentUser.uid ? (
                    <MemberStatus>待核准</MemberStatus>
                  ) : team.members.find((member) => member.uid === user.uid)
                      .status === 3 && host === currentUser.uid ? (
                    <ApproveButton onClick={() => approveJoinTeam(user, 3)}>
                      核准
                    </ApproveButton>
                  ) : (
                    ""
                  )}
                </MemberWrapper>
              ))}
          </NewBody>
          <Buttons>
            {team.members.length === group.roomiesCount &&
              selfStatus === 0 &&
              team.members
                .filter((member) => member.status !== 0)
                .every((member) => member.status === 1) && (
                <Button onClick={openBookScheduleModal}>預約看房</Button>
              )}
            <Button
              onClick={() => {
                updateTeamName();
              }}
            >
              儲存
            </Button>
          </Buttons>
        </NewModal>
      </Overlay>
    </>
  );
}

export default ManageTeamModal;
