import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold, Title, MediumTitle } from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import SendMessageModal from "../modals/SendMessage";
import {
  SearchWrapper,
  SearchInput,
  SearchButton,
  Button1,
} from "../common/Components";
import search from "../../images/search.svg";
import { Firebase } from "../../utils/firebase";
import UserCard from "../Community/UserCard";
import { Link } from "react-router-dom";

const NewWrapper = styled(FlexWrapper)`
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
`;

const LeftWrapper = styled(FlexWrapper)`
  width: calc(65% - 40px);
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  padding: 30px 20px;
`;

const RightWrapper = styled(FlexWrapper)`
  width: 30%;
  flex-direction: column;
  align-items: flex-start;
`;

const BreadCrumb = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 30px auto 20px;
  font-size: 14px;
  align-items: center;
`;

const StyledLink = styled(Link)`
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

const ProfileImage = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: ${(props) => (props.url ? `url(${props.url})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 20px;
  flex-shrink: 0;
`;

const InfoWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: calc(100% - 140px);
  align-items: flex-start;
`;

const InfoInnerWrapper = styled(FlexWrapper)`
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const LightText = styled.div`
  color: #a1aeb7;
  margin-right: 10px;
`;

const Hobbytag = styled.div`
  padding: 5px 10px;
  color: #fff;
  border-radius: 5px;
  margin: 0 10px 10px 0;
  font-size: 14px;
  background: #c1b18a;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
`;

const IntroText = styled.div`
  margin-bottom: 20px;
  line-height: 180%;
`;

const ResultDisplayer = styled(FlexWrapper)`
  flex-direction: column;
  margin-top: 20px;
`;

function UserInfo({ user, role }) {
  const { currentUser } = useAuth();
  const [openMessage, setOpenMessage] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [users, setUsers] = React.useState([]);

  function sendMyMessage() {
    setOpenMessage(true);
  }

  async function searchByJobTitle(job) {
    if (!job.trim()) {
      setUsers([]);
      return;
    }
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "users"),
      Firebase.where("role", "==", 1),
      Firebase.where("jobTitle", ">=", job),
      Firebase.where("jobTitle", "<=", job + "\uf8ff")
    );
    const querySnapShot = await Firebase.getDocs(query);
    const result = querySnapShot.docs.map((doc) => doc.data());
    setUsers(result.filter((object) => user.uid !== object.uid));
  }

  return (
    <>
      {openMessage && (
        <SendMessageModal objectId={user.uid} setOpenModal={setOpenMessage} />
      )}
      <BreadCrumb>
        <StyledLink to="/">首頁</StyledLink>
        <Span>{" > "}</Span>
        <StyledLink to="/community">社群</StyledLink>
        <Span>{" > "}</Span>
        <Active>{user.uid}</Active>
      </BreadCrumb>
      <NewWrapper>
        <LeftWrapper>
          <ProfileImage url={user.profileImage} />
          <InfoWrapper>
            <MediumTitle>{user.alias}</MediumTitle>
            <InfoInnerWrapper>
              {role === 1 && <LightText>{user.jobTitle}</LightText>}
              <LightText>生理性別：{user.gender === 0 ? "女" : "男"}</LightText>
            </InfoInnerWrapper>
            {role === 1 && user.hobbies.length ? (
              <InfoInnerWrapper>
                {user.hobbies.map((hobby, index) => (
                  <Hobbytag key={index}>{hobby}</Hobbytag>
                ))}
              </InfoInnerWrapper>
            ) : (
              ""
            )}
            <IntroText>{user.selfIntro}</IntroText>
            {currentUser && currentUser.uid === user.uid ? (
              ""
            ) : (
              <Button1 onClick={sendMyMessage}>發送訊息</Button1>
            )}
          </InfoWrapper>
        </LeftWrapper>
        <RightWrapper>
          <SearchWrapper>
            <SearchInput
              placeholder="尋找從事相同行業的室友"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                searchByJobTitle(e.target.value);
              }}
            />
            <SearchButton src={search} />
          </SearchWrapper>
          {users.length ? (
            <ResultDisplayer>
              {users.map((info, index) => (
                <UserCard key={index} user={info} />
              ))}
            </ResultDisplayer>
          ) : (
            ""
          )}
        </RightWrapper>
      </NewWrapper>
    </>
  );
}

export default UserInfo;
