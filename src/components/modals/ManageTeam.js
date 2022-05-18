import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import {
  Bold,
  SmallLabel,
  Input,
  FlexWrapper,
  Status,
  SlicedBold,
} from "../common/Components";
import BookScheduleModal from "./BookSchedule";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";

const NewModal = styled(Modal)`
  width: 80%;
  min-width: 350px;
  max-width: 700px;
`;

const NewBody = styled(Body)`
  height: 380px;
  padding: 10px;
  overflow-y: auto;
`;

const MemberWrapper = styled(FlexWrapper)`
  margin: 20px 10px;
  @media screen and (max-width: 767.98px) {
    font-size: 14px;
  }
`;

const NewTitle = styled(SlicedBold)`
  max-width: 300px;
  @media screen and (max-width: 767.98px) {
    max-width: 100px;
  }
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
  flex-shrink: 0;
  @media screen and (max-width: 767.98px) {
    width: 50px;
    height: 50px;
  }
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
  padding: 6px 10px;
  border-radius: 5px;
  background: #e8e8e8;
  cursor: pointer;
  justify-content: center;
  &:hover {
    background: #dadada;
  }
`;

const Buttons = styled(FlexWrapper)`
  align-self: end;
  margin-top: -20px;
`;

function ManageTeamModal({ team, group, toggle, setSaved }) {
  const { currentUser } = useAuth();
  const [openSchedule, setOpenSchedule] = React.useState(false);

  const [openConfirmJoin, setOpenConfirmJoin] = React.useState(false);
  const [openConfirmApprove, setOpenConfirmApprove] = React.useState(false);
  const [targetUser, setTargetUser] = React.useState("");

  const [otherMembers, setOtherMembers] = React.useState([]);
  const [name, setName] = React.useState(team.name);
  const host = team.members.find((user) => user.status === 0).uid;
  const selfStatus = team.members.find(
    (user) => user.uid === currentUser.uid
  ).status;

  const [bookingStatus, setBookingStatus] = React.useState();
  // const [isPending, setIsPending] = React.useState();
  // const [isAllowedToBook, setIsAllowedToBook] = React.useState();
  // const [hasBooked, setHasBooked] = React.useState();

  const navigate = useNavigate();

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

    function checkBookingQualification() {
      api
        .getDataWithSingleQuery("schedules", "team", "==", team.id)
        .then((res) => {
          const unExpiredEvents = res.filter(
            (schedule) =>
              schedule.status === 1 &&
              new Date(schedule.end).getTime() >= new Date().getTime()
          );
          const pendingEvents = res.filter(
            (schedule) =>
              schedule.status === 0 &&
              new Date(schedule.end).getTime() >= new Date().getTime()
          );
          setBookingStatus(
            unExpiredEvents.length
              ? "booked"
              : pendingEvents.length
              ? "pending"
              : team.members.length === group?.roomiesCount &&
                selfStatus === 0 &&
                team.members
                  .filter((member) => member.status !== 0)
                  .every((member) => member.status === 1)
              ? "available"
              : ""
          );
        });
    }
    checkBookingQualification();

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
      api.createNoticeByType(currentUser.uid, host, 1);
    }
    if (status === 3) {
      api.createNoticeByType(currentUser.uid, user.uid, 3);
    }
    toggle("");
    setSaved(true);
  }

  function updateTeamName() {
    const time = Firebase.Timestamp.fromDate(new Date());
    api
      .updateDocData("teams", team.id, {
        name,
        updateTime: time,
      })
      .then(() => {
        toggle("");
        setSaved(true);
      });
  }

  function openBookScheduleModal() {
    setOpenSchedule(true);
  }

  function getUserStatus(userbase, userID) {
    const status = userbase.find((member) => member.uid === userID).status;
    return status;
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
          setSaved={setSaved}
        />
      )}

      {openConfirmJoin && (
        <ConfirmBeforeActionModal
          message="確認加入？"
          action={() => {
            approveJoinTeam(targetUser, 2);
          }}
          toggle={setOpenConfirmJoin}
        />
      )}

      {openConfirmApprove && (
        <ConfirmBeforeActionModal
          message="確認核准加入？"
          action={() => {
            approveJoinTeam(targetUser, 3);
          }}
          toggle={setOpenConfirmApprove}
        />
      )}

      <Overlay out={false}>
        <NewModal>
          <Header>
            <FlexWrapper>
              <NewTitle>{team.name}</NewTitle>｜{team.members.length}
              位成員
              <Status>{group?.roomiesCount}人成團</Status>
            </FlexWrapper>
            <CloseButton onClick={() => toggle("")}>×</CloseButton>
          </Header>
          <NewBody>
            <SmallLabel>隊伍名稱</SmallLabel>
            <Input
              value={name}
              readOnly={selfStatus !== 0}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <SmallLabel>房源名稱</SmallLabel>
            <Input value={group?.title} readOnly />
            <SmallLabel>團主</SmallLabel>
            <MemberWrapper>
              <ProfileImage
                src={
                  selfStatus !== 0
                    ? otherMembers.length &&
                      otherMembers.find((user) => user.uid === host)
                        ?.profileImage
                    : currentUser.profileImage
                }
              />
              <Alias>
                {selfStatus !== 0
                  ? otherMembers.length &&
                    otherMembers.find((user) => user.uid === host)?.alias
                  : currentUser.alias}
              </Alias>
            </MemberWrapper>
            <SmallLabel>成員</SmallLabel>
            {otherMembers
              .filter((member) => member.uid !== host)
              .map((user) => (
                <MemberWrapper key={user.uid}>
                  <Link to={`/users/${user.uid}`}>
                    <ProfileImage src={user.profileImage} />
                  </Link>
                  <Alias>{user.alias}</Alias>
                  {getUserStatus(team.members, user.uid) === 1 ? (
                    <MemberStatus>已加入</MemberStatus>
                  ) : getUserStatus(team.members, user.uid) === 2 &&
                    user.uid !== currentUser.uid ? (
                    <MemberStatus>已邀請</MemberStatus>
                  ) : getUserStatus(team.members, user.uid) === 2 &&
                    user.uid === currentUser.uid ? (
                    <ApproveButton
                      onClick={() => {
                        setTargetUser(user);
                        setOpenConfirmJoin(true);
                      }}
                    >
                      加入
                    </ApproveButton>
                  ) : getUserStatus(team.members, user.uid) === 3 &&
                    host !== currentUser.uid ? (
                    <MemberStatus>待核准</MemberStatus>
                  ) : getUserStatus(team.members, user.uid) === 3 &&
                    host === currentUser.uid ? (
                    <ApproveButton
                      onClick={() => {
                        setTargetUser(user);
                        setOpenConfirmApprove(true);
                      }}
                    >
                      核准
                    </ApproveButton>
                  ) : (
                    ""
                  )}
                </MemberWrapper>
              ))}
          </NewBody>
          <Buttons>
            {bookingStatus === "booked" ? (
              <Button
                onClick={() => {
                  navigate("/profile/schedule/booked");
                }}
              >
                查看行程
              </Button>
            ) : bookingStatus === "pending" ? (
              <Button
                onClick={() => {
                  navigate("/profile/schedule/pending");
                }}
              >
                查看行程
              </Button>
            ) : bookingStatus === "available" ? (
              <Button onClick={openBookScheduleModal}>預約看房</Button>
            ) : (
              ""
            )}

            {selfStatus === 0 ? (
              <Button
                onClick={() => {
                  updateTeamName();
                }}
              >
                儲存
              </Button>
            ) : (
              <Button
                onClick={() => {
                  toggle("");
                }}
              >
                關閉
              </Button>
            )}
          </Buttons>
        </NewModal>
      </Overlay>
    </>
  );
}

export default ManageTeamModal;
