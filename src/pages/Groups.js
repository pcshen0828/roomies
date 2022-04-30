import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import GroupMember from "../components/groups/GroupMember";
import GroupTeam from "../components/groups/GroupTeam";
import api from "../utils/api";
import {
  StyledLink,
  Button1,
  FlexWrapper,
  Bold,
} from "../components/common/Components";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import member from "../images/members.svg";
import room from "../images/room.svg";

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
  margin: 10px auto;
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

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-right: 30px;
  @media screen and (max-width: 767.98px) {
    margin-bottom: 10px;
  }
`;

const MainSubTitles = styled(FlexWrapper)`
  align-items: center;
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
    align-items: flex-start;
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

const ExitButton = styled(Button1)`
  background: none;
  border: 1px solid #424b5a;
  color: #424b5a;
  width: 100px;
  margin-right: 20px;

  &:hover {
    border: 1px solid transparent;
    background: #c1b18a;
    color: #fff;
  }
`;

const HasJoined = styled(FlexWrapper)`
  width: 128px;
  height: 42px;
  background: #e8e8e8;
  border-radius: 5px;
  color: #424b5a;
  justify-content: center;
  margin-right: 10px;
`;

const GroupBody = styled(FlexWrapper)`
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: flex-start;
  height: 1000px;
`;

const GroupBodyLeft = styled(FlexWrapper)`
  width: 60%;
  flex-direction: column;
  border: 1px solid red;
  align-items: flex-start;
  position: sticky;
  top: 80px;
  height: 500px;
  overflow-y: scroll;
`;

const GroupBodyRight = styled(FlexWrapper)`
  width: 38%;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid red;
  height: 500px;
  overflow-y: scroll;
  position: sticky;
  top: 80px;
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

  return (
    <Wrapper>
      <BreadCrumb>
        <BreadCrumbLink to="/">首頁</BreadCrumbLink>
        <Span>{" > "}</Span>
        <BreadCrumbLink to="/apartments">所有房源</BreadCrumbLink>
        <Span>{" > "}</Span>
        <BreadCrumbLink to={`/apartment/${apartmentData.id}`}>
          {apartmentData.id}
        </BreadCrumbLink>
        <Span>{" > "}</Span>
        <Active>社團</Active>
      </BreadCrumb>
      <Banner src={apartmentData.coverImage} />
      <GroupHeader>
        <MainSubTitles>
          <StyledLink to={`/apartment/${apartmentData.id}`}>
            <Title>{apartmentData.title}</Title>
          </StyledLink>
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
            <HasJoined>☑︎已加入</HasJoined>
          )}
          {/* <ExitButton>退出</ExitButton> */}
          <Button1>邀請</Button1>
        </Buttons>
      </GroupHeader>
      <GroupBody>
        <GroupBodyLeft>
          <GroupTeam
            roomies={apartmentData.roomiesCount}
            aid={apartmentData.id}
            members={groupMembers}
            groupId={id}
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
