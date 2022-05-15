import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold, Button1, TitleSub } from "../common/Components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
`;

const Card = styled(FlexWrapper)`
  flex-direction: column;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  height: 250px;
  border-radius: 20px;
  margin: 0 20px 20px 0;
  padding: 10px 20px 20px;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const CardCover = styled.div`
  width: 100%;
  height: 50%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${(props) =>
    props.src
      ? `url(${props.src})`
      : "linear-gradient(180deg, rgba(193, 177, 138, 0.5) 0%, rgba(66, 75, 90, 0.5) 100%)"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
`;

const InnerWrapper = styled(FlexWrapper)`
  flex-direction: column;
  justify-content: space-between;
  width: 160px;
  height: 200px;
  z-index: 1;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  flex-shrink: 0;
  margin: 20px 0 5px;
  border: 2px solid #e8e8e8;
`;

const UserInfo = styled(FlexWrapper)`
  flex-direction: column;
  margin: -5px 0 10px;
`;

const NewButton = styled(FlexWrapper)`
  width: 120px;
  height: 38px;
  border: 1px solid #;
`;

function UserCard({ user }) {
  return (
    <Card>
      <CardCover src={user.coverImage} />
      <InnerWrapper>
        <StyledLink to={`/users/${user.uid}`} title="查看個人頁面">
          <ProfileImage src={user.profileImage} />
        </StyledLink>
        <TitleSub>{user.alias}</TitleSub>
        <UserInfo>{user.jobTitle}</UserInfo>
      </InnerWrapper>
    </Card>
  );
}

export default UserCard;
