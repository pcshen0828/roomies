import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import scrollToTop from "../../utils/scroll";

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
  PagingList,
  PagingItem,
  BackgroundImage,
  ProfileImage,
  SkeletonWrapper,
  SkeletonWrapperGrid,
} from "../common/Components";
import ManageTeamModal from "../modals/ManageTeam";
import ConfirmBeforeActionModal from "../modals/ConfirmBeforeAction";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";
import members from "../../images/members.svg";

import Skeleton from "react-loading-skeleton";

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
    width: calc(100% - 50px);
  }
`;

const GroupImg = styled(BackgroundImage)`
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 10px;
  flex-shrink: 0;
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

const SenderProfile = styled(ProfileImage)`
  width: 60px;
  height: 60px;
  margin-right: 10px;
  flex-shrink: 0;
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
  const navigate = useNavigate();
  const location = useLocation();

  const [groups, setGroups] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saved, setSaved] = useState(false);
  const [openConfirmType, setOpenConfirmType] = useState("");

  const [actionObject, setActionObject] = useState({
    groupId: "",
    groupMembers: [],
    invitation: {},
  });

  const [paging, setPaging] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const query1 = api.createQuery(
      "groups",
      "members",
      "array-contains",
      currentUser.uid
    );
    const unsubscribe1 = Firebase.onSnapshot(query1, (snapshot) => {
      const queriedGroups = snapshot.docs.map((doc) => doc.data());
      setGroups(queriedGroups);
      const apartmentIds = queriedGroups.map((item) => item.apartmentId);
      if (!apartmentIds.length) return;
      api
        .getDataWithSingleQuery("apartments", "id", "in", apartmentIds)
        .then((queriedApartments) => {
          setApartments(queriedApartments);
        });
    });

    const query2 = api.createQuery(
      "teams",
      "userIDs",
      "array-contains",
      currentUser.uid
    );

    const unsubscribe2 = Firebase.onSnapshot(query2, (snapshot) => {
      const queriedTeams = snapshot.docs.map((doc) => doc.data());
      setTeams(queriedTeams);
    });

    const query3 = api.createQuery(
      "groupInvitations",
      "receiver",
      "==",
      currentUser.uid
    );

    const unsubscribe3 = Firebase.onSnapshot(query3, (snapshot) => {
      const queriedList = snapshot.docs.map((doc) => doc.data());
      if (queriedList.length === 0) {
        setInvitations([]);
        setLoading(false);
        return;
      }
      let newList = [];
      queriedList.forEach((item) => {
        let newObject = {
          id: item.id,
          status: item.status,
          groupId: item.groupId,
        };
        api
          .getDataWithSingleQuery("groups", "id", "==", item.groupId)
          .then((queriedGroups) => {
            const queriedGroup = queriedGroups[0];
            newObject.groupMembers = queriedGroup.members;
            return queriedGroup.apartmentId;
          })
          .then((apartmentId) => {
            api
              .getDataWithSingleQuery("apartments", "id", "==", apartmentId)
              .then((queriedApartments) => {
                newObject.apartment = queriedApartments[0];
              })
              .then(() => {
                api
                  .getDataWithSingleQuery("users", "uid", "==", item.sender)
                  .then((queriedUsers) => {
                    newObject.sender = queriedUsers[0];
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
      ? "??????"
      : status === 1
      ? "??????"
      : status === 2
      ? "?????????"
      : status === 3
      ? "?????????"
      : "";
  }

  function createPaging(num) {
    return Array.from(Array(num).keys());
  }

  function getCurrentTab() {
    return location.pathname === "/profile/groupteam/groups" ? groups : teams;
  }

  function closeConfirmModal() {
    setOpenConfirmType("");
  }

  return (
    <Wrapper>
      <Bold>????????????????????????</Bold>
      <TabsWrapper>
        <Tab
          active={location.pathname === "/profile/groupteam/groups"}
          onClick={() => {
            navigate("/profile/groupteam/groups");
            getCurrentTab();
            setPaging(1);
          }}
        >
          ???????????????
        </Tab>
        <Tab
          active={location.pathname === "/profile/groupteam/teams"}
          onClick={() => {
            navigate("/profile/groupteam/teams");
            getCurrentTab();
            setPaging(1);
          }}
        >
          ????????????
        </Tab>
      </TabsWrapper>

      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="???????????????" />
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
                  ???????????????
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
                    setOpenConfirmType("join");
                  }}
                >
                  ??????
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
                    setOpenConfirmType("reject");
                  }}
                >
                  ??????
                </RejectButton>
              </ActionButtons>
            </InvitationWrapper>
          ))
        : ""}

      {openConfirmType === "join" && (
        <ConfirmBeforeActionModal
          message="???????????????"
          action={confirmJoinGroup}
          toggle={closeConfirmModal}
        />
      )}

      {openConfirmType === "reject" && (
        <ConfirmBeforeActionModal
          message="???????????????"
          action={rejectJoinGroup}
          toggle={closeConfirmModal}
        />
      )}

      <GroupsWrapper>
        {loading ? (
          <SkeletonWrapper>
            {Array.from(Array(2).keys()).map((loader, index) => (
              <Skeleton
                key={index}
                width="calc(100% - 40px)"
                height={100}
                borderRadius={10}
                style={{ margin: "0 10px 20px 0", padding: "10px 20px" }}
              />
            ))}
          </SkeletonWrapper>
        ) : (
          location.pathname === "/profile/groupteam/groups" && (
            <>
              {apartments
                .slice((paging - 1) * itemsPerPage, paging * itemsPerPage)
                .map((group) => (
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
                ))}
            </>
          )
        )}
      </GroupsWrapper>

      <TeamsWrapper>
        {loading ? (
          <SkeletonWrapperGrid>
            {Array.from(Array(2).keys()).map((loader, index) => (
              <Skeleton
                key={index}
                width="calc(100% - 40px)"
                height={100}
                borderRadius={10}
                style={{ margin: "0 10px 20px 0", padding: "10px 20px" }}
              />
            ))}
          </SkeletonWrapperGrid>
        ) : (
          location.pathname === "/profile/groupteam/teams" && (
            <>
              {teams
                .slice((paging - 1) * itemsPerPage, paging * itemsPerPage)
                .map((team) => (
                  <TeamCard key={team.id}>
                    <FlexWrap>
                      <SlicedBold>{team.name}</SlicedBold>
                      <FlexWrapper>
                        <Icon src={members} alt="" />???
                        <SmallText>
                          {team.members.length}
                          <Option> ?????????</Option>
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
                              team.members.find(
                                (member) => member.status === 3
                              )) ||
                            getUserStatus(team.members) === "?????????" ||
                            (apartments.length &&
                              apartments.find(
                                (item) => item.id === team.apartmentID
                              )?.roomiesCount === team.members?.length &&
                              team.members
                                .filter((member) => member.status !== 0)
                                .every((member) => member.status === 1) &&
                              team.members.find((member) => member.status === 0)
                                ?.uid === currentUser.uid)
                          }
                        />
                        ??????
                      </ConfirmButton>
                    </ActionButtons>
                    {teamId === team.id && (
                      <ManageTeamModal
                        successfullySaved={() => setSaved(true)}
                        team={team}
                        group={apartments.find(
                          (item) => item.id === team.apartmentID
                        )}
                        toggle={() => setTeamId("")}
                      />
                    )}
                  </TeamCard>
                ))}
            </>
          )
        )}
      </TeamsWrapper>
      {!loading && (
        <PagingList>
          {getCurrentTab().length
            ? createPaging(
                Math.ceil(getCurrentTab().length / itemsPerPage)
              ).map((number, index) => (
                <PagingItem
                  key={index}
                  onClick={() => {
                    setPaging(number + 1);
                    scrollToTop();
                  }}
                  active={paging === number + 1}
                >
                  {number + 1}
                </PagingItem>
              ))
            : ""}
        </PagingList>
      )}
    </Wrapper>
  );
}

export default GroupAndTeam;
