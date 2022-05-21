import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";

import styled from "styled-components";
import {
  FlexWrapper,
  Title,
  MediumTitle,
  FlexColumn,
  SearchWrapper,
  SearchInput,
  SearchButton,
  Button1,
  ProfileImage,
} from "../common/Components";
import UserCard from "../community/UserCard";
import SendMessageModal from "../modals/SendMessage";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";
import search from "../../images/search.svg";

const NewWrapper = styled(FlexColumn)`
  align-items: flex-start;
  margin-top: 20px;
  margin-bottom: 40px;
  position: relative;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);

  @media screen and (max-width: 995.98px) {
    flex-direction: column;
  }
`;

const BreadCrumb = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 30px auto 10px;
  font-size: 14px;
  align-items: center;
  @media screen and (max-width: 995.98px) {
    flex-wrap: wrap;
  }
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

const UserWrapper = styled(FlexWrapper)`
  width: calc(100% - 60px);
  margin: 110px auto 0;
  z-index: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 10px;
  padding: 30px 30px;
  @media screen and (max-width: 995.98px) {
    margin-bottom: 20px;
    justify-content: flex-start;
  }
`;

const CoverImage = styled.div`
  position: absolute;
  height: 200px;
  width: 100%;
  background: ${(props) =>
    props.src
      ? `url(${props.src})`
      : "linear-gradient(180deg, rgba(193, 177, 138, 0.5) 0%, rgba(66, 75, 90, 0.5) 100%)"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px 10px 0 0;
  @media screen and (max-width: 995.98px) {
    height: 180px;
  }
`;

const TopFlexWrapper = styled(FlexWrapper)`
  align-items: flex-start;
  width: 100%;
  @media screen and (max-width: 995.98px) {
    flex-direction: column;
  }
`;

const Profile = styled(ProfileImage)`
  width: 120px;
  height: 120px;
  margin-right: 20px;
  flex-shrink: 0;
  @media screen and (max-width: 995.98px) {
    width: 90px;
    height: 90px;
  }
`;

const InfoWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: calc(100% - 140px);
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  width: auto;
  border-radius: 10px;
  padding: 10px 20px;
  @media screen and (max-width: 995.98px) {
    padding: 10px 20px 0 0;
  }
`;

const InfoInnerWrapper = styled(FlexWrapper)`
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const LightText = styled.div`
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
  margin: 20px 0;
  line-height: 180%;
  @media screen and (max-width: 995.98px) {
  }
`;

const ExploreWrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  @media screen and (max-width: 995.98px) {
  }
`;

const ResultDisplayer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 390px);
  justify-content: space-between;
  margin: 20px auto 0;

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fill, calc((100% - 10px) / 2));
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 100%);
  }
`;

const KeywordResults = styled(FlexWrapper)`
  margin: 10px 0 0;
  align-items: center;
  flex-wrap: wrap;
`;

const Keyword = styled.div`
  padding: 5px 10px;
  border-radius: 5px;
  background: #e8e8e8;
  margin: 0 10px 10px 0;
`;

const ResultText = styled.div`
  margin: 0 0 10px 0;
`;

function UserInfo({ user, role }) {
  const { currentUser } = useAuth();
  const [openMessage, setOpenMessage] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [saved, setSaved] = useState(false);

  function sendMyMessage() {
    setOpenMessage(true);
  }

  async function searchByJobTitle(job) {
    if (!job.trim()) {
      setUsers([]);
      setJobs([]);
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
    setJobs(
      result
        .filter((object) => user.uid !== object.uid)
        .map((user) => user.jobTitle)
    );
  }

  return (
    <>
      {openMessage && (
        <SendMessageModal
          objectId={user.uid}
          toggle={() => setOpenMessage(false)}
          successfullySaved={() => setSaved(true)}
          receiver="otherUser"
        />
      )}
      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="訊息已發送！" />
      )}
      <BreadCrumb>
        <StyledLink to="/">首頁</StyledLink>
        <Span>{" > "}</Span>
        <StyledLink to="/community">社群</StyledLink>
        <Span>{" > "}</Span>
        <Active>{user.alias}</Active>
      </BreadCrumb>
      <NewWrapper>
        <CoverImage src={user.coverImage} />
        <UserWrapper>
          <TopFlexWrapper>
            <Profile src={user.profileImage} />
            <InfoWrapper>
              <MediumTitle>{user.alias}</MediumTitle>
              <InfoInnerWrapper>
                {role === 1 && <LightText>{user.jobTitle}</LightText>}
                <LightText>
                  生理性別：{user.gender === 0 ? "女" : "男"}
                </LightText>
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
            </InfoWrapper>
          </TopFlexWrapper>
          <IntroText>{user.selfIntro}</IntroText>
          {currentUser && currentUser.uid === user.uid ? (
            ""
          ) : (
            <Button1 onClick={sendMyMessage}>發送訊息</Button1>
          )}
        </UserWrapper>
      </NewWrapper>

      <ExploreWrapper>
        <Title>透過職業搜尋</Title>
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
        <KeywordResults>
          {jobs.length ? (
            <>
              <ResultText>搜尋結果：</ResultText>
              {jobs
                .filter((job, index) => jobs.indexOf(job) === index)
                .map((job, index) => (
                  <Keyword key={job}>{job}</Keyword>
                ))}
            </>
          ) : (
            ""
          )}
        </KeywordResults>
        <ResultDisplayer>
          {users.length ? (
            <>
              {users.map((info, index) => (
                <UserCard key={index} user={info} />
              ))}
            </>
          ) : (
            ""
          )}
        </ResultDisplayer>
      </ExploreWrapper>
    </>
  );
}

UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
  role: PropTypes.number.isRequired,
};

export default UserInfo;
