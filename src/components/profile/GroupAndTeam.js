import React from "react";
import styled from "styled-components";
import {
  FlexWrapper,
  Bold,
  SmallTitle,
  SlicedBold,
  SlicedLink,
  RejectButton,
  ConfirmButton,
  SmallText,
  Status,
  FlexWrap,
} from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";
import ManageTeamModal from "../modals/ManageTeam";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmBeforeActionModal from "../modals/ConfirmBeforeAction";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";
import members from "../../images/members.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const TabsWrapper = styled(FlexWrapper)`
  border-bottom: 1px solid #dadada;
  margin: 20px 0;
  width: 100%;
`;

const Tab = styled(SmallTitle)`
  cursor: pointer;
  margin: 0 10px 0 0;
  padding: 0 10px 10px 10px;
  border-bottom: ${(props) =>
    props.active ? "2px solid #424b5a" : "2px solid transparent"};
`;

const GroupsWrapper = styled(FlexWrapper)`
  flex-wrap: wrap;
  width: 100%;
`;

const GroupCard = styled(FlexWrapper)`
  width: calc(50% - 60px);
  height: 100px;
  border-radius: 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  margin: 0 10px 10px 0;
  padding: 10px 20px;

  @media screen and (max-width: 767.98px) {
    width: calc(100%);
  }
  @media screen and (max-width: 465.98px) {
    width: 180px;
  }
`;

const GroupImg = styled.div`
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 10px;
  flex-shrink: 0;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @media screen and (max-width: 767.98px) {
    width: 50px;
    height: 50px;
  }
`;

const InvitationWrapper = styled(FlexWrapper)`
  width: calc(100% - 68px);
  height: 80px;
  border-radius: 10px;
  background: #f2f5f7;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  margin-bottom: 10px;
  padding: 10px 20px;
  justify-content: space-between;
  @media screen and (max-width: 767.98px) {
    width: calc(100% - 52px);
    flex-direction: column;
    align-items: flex-start;
    font-size: 14px;
    height: 90px;
  }
  @media screen and (max-width: 465.98px) {
    width: 180px;
  }
`;

const InnerWrapper = styled(FlexWrapper)`
  @media screen and (max-width: 767.98px) {
    font-size: 14px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SenderProfile = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @media screen and (max-width: 767.98px) {
    display: none;
  }
`;

const ActionButtons = styled(FlexWrapper)``;

const TeamsWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: 100%;
`;

const TeamCard = styled(FlexWrapper)`
  width: calc(100% - 40px);
  height: 100px;
  border-radius: 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  margin: 0 10px 10px 0;
  padding: 10px 20px;
  justify-content: space-between;
  @media screen and (max-width: 575.98px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-evenly;
  }
`;

const Option = styled.span`
  @media screen and (max-width: 575.98px) {
    display: none;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 10px;
`;

const UnreadNot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff0606;
  position: absolute;
  top: -2px;
  right: -2px;
  display: ${(props) => (props.show ? "block" : "none")};
`;

function GroupAndTeam() {
  const { currentUser } = useAuth();
  const [groups, setGroups] = React.useState([]);
  const [apartments, setApartments] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [teamId, setTeamId] = React.useState("");
  const [invitations, setInvitations] = React.useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  const [saved, setSaved] = React.useState(false);
  const [openConfirmJoin, setOpenConfirmJoin] = React.useState(false);
  const [openConfirmReject, setOpenConfirmReject] = React.useState(false);
  const [actionObject, setActionObject] = React.useState({
    groupId: "",
    groupMembers: [],
    invitation: {},
  });

  React.useEffect(() => {
    const query1 = api.createQuery(
      "groups",
      "members",
      "array-contains",
      currentUser.uid
    );
    const unsubscribe1 = Firebase.onSnapshot(query1, (snapshot) => {
      const res = snapshot.docs.map((doc) => doc.data());
      setGroups(res);
      const apartmentIds = res.map((item) => item.apartmentId);
      if (!apartmentIds.length) return;
      api
        .getDataWithSingleQuery("apartments", "id", "in", apartmentIds)
        .then((res) => {
          setApartments(res);
        });
    });

    const query2 = api.createQuery(
      "teams",
      "userIDs",
      "array-contains",
      currentUser.uid
    );

    const unsubscribe2 = Firebase.onSnapshot(query2, (snapshot) => {
      const res = snapshot.docs.map((doc) => doc.data());
      setTeams(res);
    });

    const query3 = api.createQuery(
      "groupInvitations",
      "receiver",
      "==",
      currentUser.uid
    );

    const unsubscribe3 = Firebase.onSnapshot(query3, (snapshot) => {
      const res = snapshot.docs.map((doc) => doc.data());
      if (res.length === 0) {
        setInvitations([]);
        setLoading(false);
        return;
      }
      let newList = [];
      res.forEach((item) => {
        let newObject = {
          id: item.id,
          status: item.status,
          groupId: item.groupId,
        };
        api
          .getDataWithSingleQuery("groups", "id", "==", item.groupId)
          .then((res) => {
            newObject.groupMembers = res[0].members;
            return res[0].apartmentId;
          })
          .then((res) => {
            api
              .getDataWithSingleQuery("apartments", "id", "==", res)
              .then((res) => {
                newObject.apartment = res[0];
              })
              .then(() => {
                api
                  .getDataWithSingleQuery("users", "uid", "==", item.sender)
                  .then((res) => {
                    newObject.sender = res[0];
                    newList.push(newObject);
                    setInvitations(newList);
                    setLoading(false);
                  });
              });
          });
      });
    });

    return function cleanup() {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    };
  }, []);

  function confirmJoinGroup() {
    api.updateDocData("groups", actionObject.groupId, {
      members: [...actionObject.groupMembers, currentUser.uid],
    });
    api.createNoticeByType(currentUser.uid, actionObject.invitation.sender, 9);
    Firebase.deleteDoc(
      Firebase.doc(Firebase.db, "groupInvitations", actionObject.invitation.id)
    );
  }

  function rejectJoinGroup() {
    Firebase.deleteDoc(
      Firebase.doc(Firebase.db, "groupInvitations", actionObject.invitation.id)
    );
    api.createNoticeByType(currentUser.uid, actionObject.invitation.sender, 10);
  }

  function getUserStatus(userbase) {
    const status = userbase.find(
      (member) => member.uid === currentUser.uid
    ).status;
    return status === 0
      ? "團主"
      : status === 1
      ? "成員"
      : status === 2
      ? "邀請中"
      : status === 3
      ? "待核准"
      : "";
  }

  return (
    <Wrapper>
      <Bold>社團 / 群組管理</Bold>
      <TabsWrapper>
        <Tab
          active={location.pathname === "/profile/groupteam/groups"}
          onClick={() => {
            navigate("/profile/groupteam/groups");
          }}
        >
          社團
        </Tab>
        <Tab
          active={location.pathname === "/profile/groupteam/teams"}
          onClick={() => {
            navigate("/profile/groupteam/teams");
          }}
        >
          群組
        </Tab>
      </TabsWrapper>

      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="儲存成功！" />
      )}

      {location.pathname === "/profile/groupteam/groups" && invitations.length
        ? invitations.map((invitation) => (
            <InvitationWrapper key={invitation.id}>
              <InnerWrapper>
                <FlexWrapper>
                  <SenderProfile src={invitation.sender.profileImage} />
                  <SlicedLink to={`/users/${invitation.sender.uid}`}>
                    <Bold>{invitation.sender.alias}</Bold>
                  </SlicedLink>
                  邀請你加入
                </FlexWrapper>
                <SlicedLink to={`/groups/${invitation.groupId}`}>
                  {invitation.apartment.title}
                </SlicedLink>
              </InnerWrapper>
              <ActionButtons>
                <ConfirmButton
                  onClick={() => {
                    setActionObject({
                      groupId: invitation.groupId,
                      groupMembers: invitation.groupMembers,
                      invitation: {
                        id: invitation.id,
                        sender: invitation.sender.uid,
                      },
                    });
                    setOpenConfirmJoin(true);
                  }}
                >
                  確認
                </ConfirmButton>
                <RejectButton
                  onClick={() => {
                    setActionObject({
                      groupId: invitation.groupId,
                      groupMembers: invitation.groupMembers,
                      invitation: {
                        id: invitation.id,
                        sender: invitation.sender.uid,
                      },
                    });
                    setOpenConfirmReject(true);
                  }}
                >
                  拒絕
                </RejectButton>
              </ActionButtons>
            </InvitationWrapper>
          ))
        : ""}

      {openConfirmJoin && (
        <ConfirmBeforeActionModal
          message="確認加入？"
          action={confirmJoinGroup}
          toggle={setOpenConfirmJoin}
        />
      )}

      {openConfirmReject && (
        <ConfirmBeforeActionModal
          message="確認拒絕？"
          action={rejectJoinGroup}
          toggle={setOpenConfirmReject}
        />
      )}

      <GroupsWrapper>
        {loading ? (
          <div style={{ width: "100%" }}>
            {Array.from(Array(2).keys()).map((loader, index) => (
              <Skeleton
                key={index}
                width="calc(100% - 40px)"
                height={100}
                borderRadius={10}
                style={{ margin: "0 10px 20px 0", padding: "10px 20px" }}
              />
            ))}
          </div>
        ) : (
          location.pathname === "/profile/groupteam/groups" &&
          apartments.map((group) => (
            <GroupCard key={group.id}>
              <GroupImg src={group.coverImage} />
              <SlicedLink
                to={`/groups/${
                  groups &&
                  groups.find((item) => item.apartmentId === group.id).id
                }`}
              >
                {group.title}
              </SlicedLink>
            </GroupCard>
          ))
        )}
      </GroupsWrapper>

      <TeamsWrapper>
        {loading ? (
          <div style={{ width: "100%", display: "grid" }}>
            {Array.from(Array(2).keys()).map((loader, index) => (
              <Skeleton
                key={index}
                width="calc(100% - 40px)"
                height={100}
                borderRadius={10}
                style={{ margin: "0 10px 20px 0", padding: "10px 20px" }}
              />
            ))}
          </div>
        ) : (
          location.pathname === "/profile/groupteam/teams" &&
          teams.map((team) => (
            <TeamCard key={team.id}>
              <FlexWrap>
                <SlicedBold>{team.name}</SlicedBold>
                <FlexWrapper>
                  <Icon src={members} alt="" />・
                  <SmallText>
                    {team.members.length}
                    <Option> 位成員</Option>
                  </SmallText>
                </FlexWrapper>
                <Status>{getUserStatus(team.members)}</Status>
              </FlexWrap>
              <ActionButtons>
                <ConfirmButton onClick={() => setTeamId(team.id)}>
                  <UnreadNot
                    show={
                      (team.members.find((member) => member.status === 0)
                        ?.uid === currentUser.uid &&
                        team.members.find((member) => member.status === 3)) ||
                      getUserStatus(team.members) === "邀請中" ||
                      (apartments.length &&
                        apartments.find((item) => item.id === team.apartmentID)
                          ?.roomiesCount === team.members?.length &&
                        team.members
                          .filter((member) => member.status !== 0)
                          .every((member) => member.status === 1) &&
                        team.members.find((member) => member.status === 0)
                          ?.uid === currentUser.uid)
                    }
                  />
                  查看
                </ConfirmButton>
              </ActionButtons>
              {teamId === team.id && (
                <ManageTeamModal
                  setSaved={setSaved}
                  team={team}
                  group={apartments.find(
                    (item) => item.id === team.apartmentID
                  )}
                  toggle={setTeamId}
                />
              )}
            </TeamCard>
          ))
        )}
      </TeamsWrapper>
    </Wrapper>
  );
}

export default GroupAndTeam;
