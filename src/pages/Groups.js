import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import scrollToTop from "../utils/scroll";

import styled from "styled-components";
import { FooterHeight, HeaderHeight, mainColor } from "../styles/GlobalStyle";
import {
  Button1,
  FlexWrapper,
  Bold,
  FlexColumn,
} from "../components/common/Components";

import GroupHeader from "../components/groups/GroupHeader";
import GroupMember from "../components/groups/GroupMember";
import GroupTeam from "../components/groups/GroupTeam";
import GroupPosts from "../components/groups/GroupPosts";
import Footer from "../components/layout/Footer";
import OwnerCard from "../components/apartments/ApartmentOwner";
import ConfirmBeforeActionModal from "../components/modals/ConfirmBeforeAction";
import InviteJoinGroupModal from "../components/modals/InviteJoinGroup";
import SuccessfullySavedModal from "../components/modals/SuccessfullySaved";
import Skeleton from "react-loading-skeleton";

import lock from "../images/lock.svg";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
  background: #f0f2f5;
  border-bottom: 1px solid #424b5a4d;
  flex-direction: column;
  align-items: flex-start;
  min-height: calc(100vh - ${HeaderHeight + FooterHeight}px);
  position: relative;
`;

const BreadCrumb = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  max-width: 1200px;
  margin: 10px auto 20px;
  font-size: 14px;
  align-items: center;
  flex-wrap: wrap;

  @media screen and (max-width: 413.98px) {
    font-size: 12px;
  }
`;

const BreadCrumbLink = styled(Link)`
  color: #424b5a;
  display: block;
  margin-right: 10px;
  &:hover {
    color: #c1b18a;
  }
`;

const Span = styled.span`
  margin-right: 10px;
`;

const Active = styled.div`
  font-weight: 700;
`;

const Banner = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  height: 300px;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto 20px;
  border-radius: 10px;
  overflow: hidden;

  @media screen and (max-width: 767.98px) {
    height: 200px;
  }
`;

const HeaderBody = styled.div`
  width: 100%;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const GroupBody = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 0 auto 20px;
  justify-content: space-between;
  align-items: flex-start;
  @media screen and (max-width: 995.98px) {
    flex-direction: column;
  }
`;

const GroupBodyLeft = styled(FlexWrapper)`
  width: 58%;
  flex-direction: column;
  align-items: flex-start;

  @media screen and (max-width: 995.98px) {
    width: 100%;
    position: static;
    order: 2;
  }
`;

const GroupBodyRight = styled(FlexWrapper)`
  width: calc(40% - 2px);
  flex-direction: column;
  align-items: flex-start;
  position: sticky;
  top: 90px;
  right: 0;
  @media screen and (max-width: 995.98px) {
    width: 100%;
    order: 1;
    position: static;
    overflow-y: visible;
    display: ${(props) => (props.active ? "block" : "none")};
  }
`;

const GroupNotice = styled(FlexColumn)`
  width: calc(100% - 40px);
  font-size: 14px;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
`;

const SubtitlesSmall = styled(FlexWrapper)`
  margin-bottom: 10px;
`;

const ContentList = styled.ol`
  line-height: 150%;
  margin-top: 10px;
`;

const NotMemberWrapper = styled(FlexWrapper)`
  width: 100%;
  height: 150px;
  margin: 20px 0;
  justify-content: center;
  align-items: center;
  background: #e8e8e8;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
`;

const Reminder = styled(FlexWrapper)`
  margin: 20px 0;
  align-items: center;
`;

const TabsWrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  border-bottom: 1px solid #dadada;
  margin: 0 auto 30px;
  padding: 0 24px;
`;

const Tab = styled.div`
  padding: 10px 15px;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  border-bottom: ${(props) =>
    props.active ? `3px solid ${mainColor}` : "3px solid transparent"};

  display: ${(props) => (props.type === "other" ? "none" : "block")};
  @media screen and (max-width: 995.98px) {
    display: ${(props) => (props.type === "other" ? "block" : "block")};
  }
`;

const SkeletonWrapper = styled.div`
  width: calc(100% - 48px);
  margin: 0 auto;
`;

function Groups() {
  const { id } = useParams();
  const [apartmentData, setApartmentData] = useState({});
  const [owner, setOwner] = useState({});
  const [members, setMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const { currentUser } = useAuth();
  const [invitation, setInvitation] = useState([]);

  const [openModalType, setOpenModalType] = useState("");
  const [dropdown, setDropdown] = useState(false);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const anchor = useRef(null);
  const [tab, setTab] = useState("news");
  const [postStatus, setPostStatus] = useState("");

  useEffect(() => {
    let mounted = true;
    scrollToTop();

    const query1 = api.createQuery("groups", "id", "==", id);
    Firebase.onSnapshot(query1, (snapshot) => {
      if (!mounted) return;
      const groupData = snapshot.docs.map((doc) => doc.data())[0];
      if (!groupData) return;
      api
        .getDataWithSingleQuery("apartments", "id", "==", groupData.apartmentId)
        .then((queriedApartments) => {
          const queriedApartment = queriedApartments[0];
          setApartmentData(queriedApartment);
          setOwner(queriedApartment.owner);
          setLoading(false);
        });
      api
        .getDataWithSingleQuery(
          "users",
          "uid",
          "in",
          groupData.members?.length ? groupData.members : [1]
        )
        .then((queriedUsers) => {
          setMembers(queriedUsers);
        });
      setGroupMembers(groupData.members);
    });

    const query2 = Firebase.query(
      Firebase.collection(Firebase.db, "groupInvitations"),
      Firebase.where("groupId", "==", id)
    );

    Firebase.onSnapshot(query2, (snapshot) => {
      const invitations = snapshot.docs.map((doc) => doc.data());
      if (!mounted) return;
      setInvitation(
        invitations.find(
          (data) => data.receiver === (currentUser && currentUser.uid)
        )
      );
    });

    return function cleanup() {
      mounted = false;
    };
  }, [currentUser, id]);

  function quitTheGroup() {
    const userID = currentUser.uid;
    api.updateDocData("groups", id, {
      members: [...groupMembers.filter((memberID) => memberID !== userID)],
    });
    setDropdown(false);
  }

  function confirmJoinGroup() {
    api.updateDocData("groups", id, {
      members: [...groupMembers, currentUser.uid],
    });
    api.createNoticeByType(currentUser.uid, invitation.sender, 9);
    Firebase.deleteDoc(
      Firebase.doc(Firebase.db, "groupInvitations", invitation.id)
    );
  }

  function joinGroup() {
    api.updateDocData("groups", id, {
      members: [...groupMembers, currentUser.uid],
    });
  }

  function rejectJoinGroup() {
    Firebase.deleteDoc(
      Firebase.doc(Firebase.db, "groupInvitations", invitation.id)
    );
    api.createNoticeByType(currentUser.uid, invitation.sender, 10);
  }

  const postStatusSwitchCase = [
    {
      type: "posted",
      message: "??????????????????",
    },
    {
      type: "updated",
      message: "??????????????????",
    },
    {
      type: "deleted",
      message: "??????????????????",
    },
  ];

  const openModalSwitchCase = [
    {
      type: "quit",
      message: "???????????????",
      action: quitTheGroup,
    },
    {
      type: "confirmJoin",
      message: "???????????????",
      action: confirmJoinGroup,
    },
    {
      type: "join",
      message: "???????????????",
      action: joinGroup,
    },
    {
      type: "reject",
      message: "???????????????",
      action: rejectJoinGroup,
    },
  ];

  const tabs = [
    {
      id: "news",
      name: "????????????",
    },
    {
      id: "teams",
      name: "????????????",
    },
    {
      id: "other",
      name: "??????",
    },
  ];

  function toggleDropDown() {
    setDropdown((prev) => !prev);
  }

  return (
    <>
      <Wrapper
        onClick={() => {
          setDropdown(false);
        }}
      >
        {saved && (
          <SuccessfullySavedModal toggle={setSaved} message="??????????????????" />
        )}

        {postStatusSwitchCase.map(
          (status) =>
            postStatus === status.type && (
              <SuccessfullySavedModal
                key={status.type}
                toggle={setPostStatus}
                message={status.message}
              />
            )
        )}

        {openModalType === "invite" && (
          <InviteJoinGroupModal
            groupId={id}
            toggle={() => setOpenModalType(false)}
            groupMembers={groupMembers}
            setSaved={() => setSaved(true)}
          />
        )}

        {openModalSwitchCase.map(
          (status) =>
            openModalType === status.type && (
              <ConfirmBeforeActionModal
                key={status.type}
                message={status.message}
                action={status.action}
                toggle={() => setOpenModalType("")}
              />
            )
        )}

        <BreadCrumb>
          {loading ? (
            <Skeleton width={40} count={1} style={{ marginRight: "10px" }} />
          ) : (
            <BreadCrumbLink to="/">??????</BreadCrumbLink>
          )}
          <Span>{" > "}</Span>
          {loading ? (
            <Skeleton width={60} count={1} style={{ marginRight: "10px" }} />
          ) : (
            <BreadCrumbLink to="/apartments">????????????</BreadCrumbLink>
          )}
          <Span>{" > "}</Span>
          {loading ? (
            <Skeleton width={200} count={1} style={{ marginRight: "10px" }} />
          ) : (
            <BreadCrumbLink to={`/apartment/${apartmentData.id}`}>
              {apartmentData.title}
            </BreadCrumbLink>
          )}
          <Span>{" > "}</Span>
          {loading ? <Skeleton width={40} count={1} /> : <Active>??????</Active>}
        </BreadCrumb>

        {loading ? (
          <SkeletonWrapper>
            <Skeleton
              width="100%"
              height={300}
              borderRadius={10}
              style={{ marginBottom: "20px" }}
            />{" "}
          </SkeletonWrapper>
        ) : (
          <Banner src={apartmentData.coverImage} ref={anchor} />
        )}

        <HeaderBody>
          {loading ? (
            <SkeletonWrapper>
              <Skeleton
                width="100%"
                height={100}
                borderRadius={10}
                style={{ marginBottom: "20px" }}
              />{" "}
            </SkeletonWrapper>
          ) : (
            <GroupHeader
              currentUser={currentUser}
              apartmentData={apartmentData}
              members={members}
              invitation={invitation}
              dropdown={dropdown}
              toggle={toggleDropDown}
              setOpenModalType={setOpenModalType}
            />
          )}

          <TabsWrapper>
            {tabs.map((option) => (
              <Tab
                key={option.id}
                onClick={() => {
                  setTab(option.id);
                }}
                active={tab === option.id}
                type={option.id === "other" ? "other" : ""}
              >
                {option.name}
              </Tab>
            ))}
          </TabsWrapper>

          {loading ? (
            <SkeletonWrapper>
              <Skeleton
                width="100%"
                height={30}
                count={5}
                borderRadius={10}
                style={{ marginBottom: "20px" }}
              />{" "}
            </SkeletonWrapper>
          ) : apartmentData.owner === currentUser?.uid ||
            members.find((member) => member.uid === currentUser.uid) ? (
            <GroupBody>
              <GroupBodyLeft>
                {tab === "news" && (
                  <GroupPosts
                    currentUser={currentUser}
                    groupID={id}
                    setPostStatus={setPostStatus}
                  />
                )}
                {tab === "teams" && (
                  <GroupTeam
                    roomies={apartmentData.roomiesCount}
                    aid={apartmentData.id}
                    members={groupMembers}
                    groupId={id}
                    groupMemberDetail={members}
                    isOwner={apartmentData.owner === currentUser?.uid}
                    currentUser={currentUser}
                  />
                )}
              </GroupBodyLeft>

              {(matchMedia("(min-width: 996px)").matches ||
                tab === "other") && (
                <GroupBodyRight active={tab === "other"}>
                  <SubtitlesSmall>
                    <Bold>????????????</Bold>
                  </SubtitlesSmall>
                  <GroupNotice>
                    <Bold>????????????</Bold>
                    <ContentList>
                      <li>??????????????????????????????????????????</li>
                      <li>???????????????????????????????????????</li>
                      <li>???????????????????????????????????????????????????</li>
                      <li>???????????????????????????</li>
                    </ContentList>
                    <Bold>????????????</Bold>
                    <ContentList>
                      <li>????????????????????????????????????????????????????????????</li>
                      <li>?????????????????????????????????????????????????????????</li>
                      <li>
                        ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                      </li>
                    </ContentList>
                  </GroupNotice>
                  <SubtitlesSmall>
                    <Bold>????????????</Bold>
                  </SubtitlesSmall>
                  <OwnerCard
                    owner={owner}
                    currentUser={currentUser}
                    page="group"
                  />
                  <GroupMember members={members} />
                </GroupBodyRight>
              )}
            </GroupBody>
          ) : (
            <NotMemberWrapper>
              <Reminder>
                <Icon src={lock} alt="" />
                ???????????????????????????????????????
              </Reminder>
              {!invitation && (
                <Button1
                  onClick={() => {
                    setOpenModalType("join");
                  }}
                >
                  ??????
                </Button1>
              )}
            </NotMemberWrapper>
          )}
        </HeaderBody>
      </Wrapper>
      <Footer />
    </>
  );
}

export default Groups;
