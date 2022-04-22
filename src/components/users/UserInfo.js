import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold, Title, MediumTitle } from "../common/Components";
import { useAuth } from "../../context/AuthContext";

const NewWrapper = styled(FlexWrapper)`
  ${"" /* border: 1px solid red; */}
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
`;

const LeftWrapper = styled(FlexWrapper)`
  width: 65%;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid blue;
`;

const RightWrapper = styled(FlexWrapper)`
  width: 30%;
  border: 1px solid blue;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${(props) => (props.url ? `url(${props.url})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 30px;
`;

const InfoWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: calc(100% - 140px);
  align-items: flex-start;
`;

const InfoInnerWrapper = styled(FlexWrapper)`
  margin-bottom: 20px;
`;

const LightText = styled.div`
  color: #a1aeb7;
  margin-right: 10px;
`;

const Hobbytag = styled.div`
  padding: 5px 10px;
  border: 1px solid #c1b18a;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 14px;
`;

const IntroText = styled.div`
  margin-bottom: 20px;
  line-height: 180%;
`;

function UserInfo({ user, role }) {
  const { currentUser } = useAuth();

  return (
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
            <button onClick={() => {}}>發送訊息</button>
          )}
        </InfoWrapper>
      </LeftWrapper>
      <RightWrapper>search feature</RightWrapper>
    </NewWrapper>
  );
}

export default UserInfo;
