import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import GroupMember from "../components/groups/GroupMember";
import GroupTeam from "../components/groups/GroupTeam";
import GroupPosts from "../components/groups/GroupPosts";
import api from "../utils/api";
import {
  Button1,
  FlexWrapper,
  Bold,
  Title,
  RejectButton,
  ExitButton,
} from "../components/common/Components";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import member from "../images/members.svg";
import room from "../images/room.svg";
import ConfirmBeforeActionModal from "../components/modals/ConfirmBeforeAction";
import { Modal } from "../components/modals/ModalElements";
import check from "../images/check.svg";
import exit from "../images/exit.svg";
import InviteJoinGroupModal from "../components/modals/InviteJoinGroup";
import SuccessfullySavedModal from "../components/modals/SuccessfullySaved";
import lock from "../images/lock.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "../components/layout/Footer";
import { mainColor } from "../styles/GlobalStyle";
import OwnerCard from "../components/apartments/ApartmentOwner";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  margin: 20px auto;
  flex-direction: column;
  align-items: flex-start;
  min-height: calc(100vh - 441px);
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

const stickyStyle = `
  box-shadow: 0px 2px 30px rgb(0 0 0 / 6%);
  background: #fff;
  position: sticky;
  top: 80px;
  z-index: 5;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  ${"" /* ${(props) => (props.sticky ? stickyStyle : "")}; */}
`;

const GroupHeader = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 15px 24px;

  @media screen and (max-width: 995.98px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NewTitle = styled(Title)`
  font-size: ${(props) => (props.sticky ? "16px" : "20px")};
  margin-bottom: ${(props) => (props.sticky ? "0" : "10px")};
  @media screen and (max-width: 1279.98px) {
    font-size: ${(props) => (props.sticky ? "16px" : "18px")};
  }
`;

const MainSubTitles = styled(FlexWrapper)`
  align-items: center;
  @media screen and (max-width: 995.98px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

const SubTitles = styled(FlexWrapper)`
  align-items: center;
`;

const SubTitle = styled.div`
  color: #a1aeb7;
  margin-right: 30px;
  @media screen and (max-width: 1279.98px) {
    font-size: 14px;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 995.98px) {
    margin-top: 10px;
  }
`;

const InviteButton = styled(Button1)`
  width: 90px;
  @media screen and (max-width: 575.98px) {
    width: 90px;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const HasJoined = styled(FlexWrapper)`
  width: 128px;
  height: 42px;
  background: #e8e8e8;
  border-radius: 5px;
  color: #424b5a;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
`;

const Dropdown = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 3px;
  font-size: 20px;
  padding-bottom: 3px;
`;

const DropdownMenu = styled(Modal)`
  width: 200px;
  border-radius: 5px;
  position: absolute;
  z-index: 10;
  top: 50px;
  left: 0;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  align-items: flex-start;
  padding: 10px;
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
  ${"" /* z-index: 2; */}

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

const GroupNotice = styled(FlexWrapper)`
  width: calc(100% - 40px);
  font-size: 14px;
  border-radius: 10px;
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
`;

const SubtitlesSmall = styled.div`
  display: flex;
  align-items: center;
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
  border-bottom: 1px solid #e8e8e8;
  margin: 0 auto 30px;
  padding: 0 24px;
`;

const Tab = styled.div`
  padding: 10px 15px;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  border-bottom: ${(props) =>
    props.active ? `3px solid ${mainColor}` : "3px solid transparent"};
  &:hover {
    background: #e8e8e8;
  }
  display: ${(props) => (props.type === "other" ? "none" : "block")};
  @media screen and (max-width: 995.98px) {
    display: ${(props) => (props.type === "other" ? "block" : "block")};
  }
`;

function Groups() {
  const { id } = useParams();
  const [apartmentData, setApartmentData] = React.useState({});
  const [owner, setOwner] = React.useState({});
  const [members, setMembers] = React.useState([]);
  const [groupMembers, setGroupMembers] = React.useState([]);
  const { currentUser } = useAuth();
  const [isInvited, setIsInvited] = React.useState();
  const [invitation, setInvitation] = React.useState([]);

  const [openConfirmQuit, setOpenConfirmQuit] = React.useState(false);
  const [openConfirmJoin, setOpenConfirmJoin] = React.useState(false);
  const [openJoin, setOpenJoin] = React.useState(false);
  const [openConfirmReject, setOpenConfirmReject] = React.useState(false);
  const [dropdown, setDropdown] = React.useState(false);

  const [openInviteModal, setOpenInviteModal] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const anchor = React.useRef(null);
  const [sticky, setSticky] = React.useState(false);
  const [tab, setTab] = React.useState("news");
  const [posted, setPosted] = React.useState(false);
  const [updated, setUpdated] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    window.scrollTo({ top: 0, behavior: "smooth" });

    const query1 = api.createQuery("groups", "id", "==", id);
    Firebase.onSnapshot(query1, (snapshot) => {
      if (!mounted) return;
      const groupData = snapshot.docs.map((doc) => doc.data())[0];
      if (!groupData) return;
      api
        .getDataWithSingleQuery("apartments", "id", "==", groupData.apartmentId)
        .then((res) => {
          setApartmentData(res[0]);
          setOwner(res[0].owner);
          setLoading(false);
        });
      api
        .getDataWithSingleQuery(
          "users",
          "uid",
          "in",
          groupData.members?.length ? groupData.members : [1]
        )
        .then((res) => {
          setMembers(res);
        });
      setGroupMembers(groupData.members);
    });

    const query2 = Firebase.query(
      Firebase.collection(Firebase.db, "groupInvitations"),
      Firebase.where("groupId", "==", id)
    );

    Firebase.onSnapshot(query2, (snapshot) => {
      const res = snapshot.docs.map((doc) => doc.data());
      if (!mounted) return;
      setInvitation(
        res.find((data) => data.receiver === (currentUser && currentUser.uid))
      );
      setIsInvited(
        res.filter((data) => data.receiver === (currentUser && currentUser.uid))
          .length
      );
    });

    return function cleanup() {
      mounted = false;
    };
  }, [currentUser, id]);

  React.useEffect(() => {
    let mounted = true;
    if (loading) return;
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!mounted) return;
      if (entry.intersectionRatio <= 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    });
    intersectionObserver.observe(anchor.current);

    return function cleanup() {
      mounted = false;
    };
  }, [loading]);

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

  return (
    <>
      <Wrapper
        onClick={() => {
          setDropdown(false);
        }}
      >
        {saved && (
          <SuccessfullySavedModal
            out={false}
            toggle={setSaved}
            message="邀請已送出！"
          />
        )}
        {posted && (
          <SuccessfullySavedModal
            out={false}
            toggle={setPosted}
            message="貼文已發佈！"
          />
        )}
        {updated && (
          <SuccessfullySavedModal
            out={false}
            toggle={setUpdated}
            message="貼文已更新！"
          />
        )}
        {deleted && (
          <SuccessfullySavedModal message="貼文已刪除！" toggle={setDeleted} />
        )}
        {openInviteModal && (
          <InviteJoinGroupModal
            groupId={id}
            toggle={setOpenInviteModal}
            groupMembers={groupMembers}
            setSaved={setSaved}
          />
        )}
        {openConfirmQuit && (
          <ConfirmBeforeActionModal
            message="確認退出？"
            action={quitTheGroup}
            toggle={setOpenConfirmQuit}
          />
        )}
        {openConfirmJoin && (
          <ConfirmBeforeActionModal
            message="確認加入？"
            action={confirmJoinGroup}
            toggle={setOpenConfirmJoin}
          />
        )}
        {openJoin && (
          <ConfirmBeforeActionModal
            message="確認加入？"
            action={joinGroup}
            toggle={setOpenJoin}
          />
        )}
        {openConfirmReject && (
          <ConfirmBeforeActionModal
            message="確認拒絕？"
            action={rejectJoinGroup}
            toggle={setOpenConfirmReject}
          />
        )}

        <BreadCrumb>
          {loading ? (
            <Skeleton width={40} count={1} style={{ marginRight: "10px" }} />
          ) : (
            <BreadCrumbLink to="/">首頁</BreadCrumbLink>
          )}
          <Span>{" > "}</Span>
          {loading ? (
            <Skeleton width={60} count={1} style={{ marginRight: "10px" }} />
          ) : (
            <BreadCrumbLink to="/apartments">所有房源</BreadCrumbLink>
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
          {loading ? <Skeleton width={40} count={1} /> : <Active>社團</Active>}
        </BreadCrumb>

        {loading ? (
          <div style={{ width: "calc(100% - 48px)", margin: "0 auto" }}>
            <Skeleton
              width="100%"
              height={300}
              borderRadius={10}
              style={{ marginBottom: "20px" }}
            />{" "}
          </div>
        ) : (
          <Banner src={apartmentData.coverImage} ref={anchor} />
        )}

        <HeaderBody>
          {loading ? (
            <div style={{ width: "calc(100% - 48px)", margin: "0 auto" }}>
              <Skeleton
                width="100%"
                height={100}
                borderRadius={10}
                style={{ marginBottom: "20px" }}
              />{" "}
            </div>
          ) : (
            <HeaderWrapper sticky={sticky}>
              <GroupHeader>
                <MainSubTitles>
                  <BreadCrumbLink to={`/apartment/${apartmentData.id}`}>
                    <NewTitle sticky={sticky}>{apartmentData.title}</NewTitle>
                  </BreadCrumbLink>
                  <SubTitles>
                    <Icon src={room} alt="" />
                    <SubTitle>{`可住人數：${
                      apartmentData.roomiesCount
                        ? apartmentData.roomiesCount
                        : ""
                    }人 / 間`}</SubTitle>
                  </SubTitles>
                  <SubTitles>
                    <Icon src={member} alt="" />
                    <SubTitle>
                      {members.length
                        ? `${members.length}位成員已加入`
                        : "尚無成員"}
                    </SubTitle>
                  </SubTitles>
                </MainSubTitles>
                {isInvited &&
                !members.find((member) => member.uid === currentUser.uid) ? (
                  <Buttons>
                    <Button1
                      onClick={() => {
                        setOpenConfirmJoin(true);
                      }}
                    >
                      確認加入
                    </Button1>
                    <RejectButton
                      onClick={() => {
                        setOpenConfirmReject(true);
                      }}
                    >
                      拒絕
                    </RejectButton>
                  </Buttons>
                ) : (
                  ""
                )}
                {members.find((member) => member.uid === currentUser.uid) ? (
                  <Buttons>
                    <DropdownWrapper onClick={(e) => e.stopPropagation()}>
                      <HasJoined
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}
                      >
                        <Icon src={check} alt="" />
                        已加入
                        <Dropdown>▾</Dropdown>
                      </HasJoined>
                      {dropdown && (
                        <DropdownMenu>
                          <ExitButton
                            onClick={() => {
                              setOpenConfirmQuit(true);
                            }}
                          >
                            <Icon src={exit} alt="" />
                            退出
                          </ExitButton>
                        </DropdownMenu>
                      )}
                    </DropdownWrapper>
                    <InviteButton
                      onClick={() => {
                        setOpenInviteModal(true);
                      }}
                    >
                      邀請
                    </InviteButton>
                  </Buttons>
                ) : (
                  ""
                )}
              </GroupHeader>
            </HeaderWrapper>
          )}

          <TabsWrapper>
            <Tab
              onClick={() => {
                setTab("news");
              }}
              active={tab === "news"}
            >
              最新動態
            </Tab>
            <Tab
              onClick={() => {
                setTab("teams");
              }}
              active={tab === "teams"}
            >
              組隊看房
            </Tab>
            <Tab
              type="other"
              onClick={() => {
                setTab("other");
              }}
              active={tab === "other"}
            >
              關於
            </Tab>
          </TabsWrapper>

          {loading ? (
            <div style={{ width: "calc(100% - 48px)", margin: "0 auto" }}>
              <Skeleton
                width="100%"
                height={30}
                count={5}
                borderRadius={10}
                style={{ marginBottom: "20px" }}
              />{" "}
            </div>
          ) : apartmentData.owner === currentUser?.uid ||
            members.find((member) => member.uid === currentUser.uid) ? (
            <GroupBody>
              <GroupBodyLeft>
                {tab === "news" && (
                  <GroupPosts
                    currentUser={currentUser}
                    groupID={id}
                    setPosted={setPosted}
                    setUpdated={setUpdated}
                    setDeleted={setDeleted}
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
                  />
                )}
              </GroupBodyLeft>

              {(matchMedia("(min-width: 996px)").matches ||
                tab === "other") && (
                <GroupBodyRight active={tab === "other"}>
                  <SubtitlesSmall>
                    <Bold>社團守則</Bold>
                  </SubtitlesSmall>
                  <GroupNotice>
                    <Bold>租屋流程</Bold>
                    <ContentList>
                      <li>加入房源社團，尋找合租的室友</li>
                      <li>人數到齊後，與屋主預約看房</li>
                      <li>確認租屋設備、租金、押金等一切細節</li>
                      <li>與屋主簽訂租屋契約</li>
                    </ContentList>
                    <Bold>租屋須知</Bold>
                    <ContentList>
                      <li>在社團中與他人互動，請保持禮貌，互相尊重</li>
                      <li>與屋主預約看房請遵守約定，切勿無故未到</li>
                      <li>
                        若同時加入多筆房源社團，確認選定一處租屋後，請確實告知其他房源的合租夥伴，讓大家都能順利找到租屋
                      </li>
                    </ContentList>
                  </GroupNotice>
                  <SubtitlesSmall>
                    <Bold>聯絡屋主</Bold>
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
                成為社團成員才能預覽內容喔
              </Reminder>
              {!isInvited && (
                <Button1
                  onClick={() => {
                    setOpenJoin(true);
                  }}
                >
                  加入
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
