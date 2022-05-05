import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import GroupMember from "../components/groups/GroupMember";
import GroupTeam from "../components/groups/GroupTeam";
import api from "../utils/api";
import {
  Button1,
  FlexWrapper,
  Bold,
  SlicedTitle,
  Title,
} from "../components/common/Components";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import member from "../images/members.svg";
import room from "../images/room.svg";
import ConfirmBeforeActionModal from "../components/modals/ConfirmBeforeAction";
import { Modal } from "../components/modals/ModalElements";
import check from "../images/check.svg";
import exit from "../images/exit.svg";

const Wrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  flex-direction: column;
  align-items: flex-start;
`;

const BreadCrumb = styled(FlexWrapper)`
  width: 100%;
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
  width: 100%;
  height: 300px;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;

  @media screen and (max-width: 767.98px) {
    height: 200px;
  }
`;

const GroupHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media screen and (max-width: 995.98px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NewSLicedTitle = styled(SlicedTitle)`
  max-width: 400px;
  @media screen and (max-width: 1279.98px) {
    max-width: 350px;
  }
  @media screen and (max-width: 1099.98px) {
    max-width: 250px;
  }
  @media screen and (max-width: 995.98px) {
    max-width: 100%;
  }
  @media screen and (max-width: 413.98px) {
    max-width: 300px;
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
  margin-right: 10px;
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

const ExitButton = styled(FlexWrapper)`
  background: none;
  color: #424b5a;
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;

  &:hover {
    background: #e8e8e8;
  }
`;

const GroupBody = styled(FlexWrapper)`
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: flex-start;
  @media screen and (max-width: 995.98px) {
    flex-direction: column;
  }
`;

const GroupBodyLeft = styled(FlexWrapper)`
  width: 60%;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
  position: sticky;
  top: 90px;
  @media screen and (max-width: 995.98px) {
    width: 100%;
    position: static;
    order: 2;
  }
`;

const GroupBodyRight = styled(FlexWrapper)`
  width: 38%;
  flex-direction: column;
  align-items: flex-start;
  @media screen and (max-width: 995.98px) {
    width: 100%;
    order: 1;
  }
`;

const GroupNotice = styled(FlexWrapper)`
  width: calc(100% - 40px);
  font-size: 14px;
  border-radius: 10px;
  display: flex;
  margin-bottom: 40px;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
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

function Groups() {
  const { id } = useParams();
  const [apartmentData, setApartmentData] = React.useState({});
  const [members, setMembers] = React.useState([]);
  const [groupMembers, setGroupMembers] = React.useState([]);
  const { currentUser } = useAuth();

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [confirmMessage, setConfirmMessage] = React.useState("");
  const [dropdown, setDropdown] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    async function getGroupData() {
      const query = api.createQuery("groups", "id", "==", id);
      Firebase.onSnapshot(query, (snapshot) => {
        if (!mounted) return;
        const groupData = snapshot.docs.map((doc) => doc.data())[0];
        setGroupMembers(groupData.members);
        api
          .getDataWithSingleQuery(
            "apartments",
            "id",
            "==",
            groupData.apartmentId
          )
          .then((res) => setApartmentData(res[0]));
        api
          .getDataWithSingleQuery("users", "uid", "in", groupData.members)
          .then((res) => setMembers(res));
      });
    }
    getGroupData();

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function initeNewMemberToGroup() {}

  function quitTheGroup() {
    console.log("退出");
    setDropdown(false);
  }

  return (
    <Wrapper>
      {openConfirm && (
        <ConfirmBeforeActionModal
          message={confirmMessage}
          action={quitTheGroup}
          toggle={setOpenConfirm}
        />
      )}
      <BreadCrumb>
        <BreadCrumbLink to="/">首頁</BreadCrumbLink>
        <Span>{" > "}</Span>
        <BreadCrumbLink to="/apartments">所有房源</BreadCrumbLink>
        <Span>{" > "}</Span>
        <BreadCrumbLink to={`/apartment/${apartmentData.id}`}>
          {apartmentData.title}
        </BreadCrumbLink>
        <Span>{" > "}</Span>
        <Active>社團</Active>
      </BreadCrumb>
      <Banner src={apartmentData.coverImage} />
      <GroupHeader>
        <MainSubTitles>
          <BreadCrumbLink to={`/apartment/${apartmentData.id}`}>
            <Title>{apartmentData.title}</Title>
          </BreadCrumbLink>
          <SubTitles>
            <Icon src={room} alt="" />
            <SubTitle>{`可容納房客：${
              apartmentData.roomiesCount ? apartmentData.roomiesCount : ""
            }人 / 間`}</SubTitle>
          </SubTitles>
          <SubTitles>
            <Icon src={member} alt="" />
            <SubTitle>{`${members.length}位成員`}</SubTitle>
          </SubTitles>
        </MainSubTitles>
        <Buttons>
          {members.find((member) => member.uid === currentUser.uid) && (
            <DropdownWrapper>
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
                      setConfirmMessage("確認退出？");
                      setOpenConfirm(true);
                    }}
                  >
                    <Icon src={exit} alt="" />
                    退出
                  </ExitButton>
                </DropdownMenu>
              )}
            </DropdownWrapper>
          )}
          <InviteButton onClick={() => {}}>邀請</InviteButton>
        </Buttons>
      </GroupHeader>
      <GroupBody>
        <GroupBodyLeft>
          <GroupTeam
            roomies={apartmentData.roomiesCount}
            aid={apartmentData.id}
            members={groupMembers}
            groupId={id}
            groupMemberDetail={members}
          />
        </GroupBodyLeft>
        <GroupBodyRight>
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
          <GroupMember members={members} />
        </GroupBodyRight>
      </GroupBody>
    </Wrapper>
  );
}

export default Groups;
