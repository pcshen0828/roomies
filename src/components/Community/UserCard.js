import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold, Button1 } from "../common/Components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
`;

const Card = styled(FlexWrapper)`
  flex-direction: column;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  width: 200px;
  height: 240px;
  border-radius: 10px;
  margin: 0 20px 20px 0;
  padding: 20px;
  justify-content: center;
`;

const InnerWrapper = styled(FlexWrapper)`
  flex-direction: column;
  justify-content: space-between;
  width: 160px;
  height: 200px;
`;

const ProfileImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const UserInfo = styled(FlexWrapper)`
  flex-direction: column;
  margin-bottom: 10px;
  font-size: 14px;
`;

function UserCard({ user }) {
  return (
    <Card>
      <InnerWrapper>
        <ProfileImage src={user.profileImage} />
        <Bold>{user.alias}</Bold>
        <UserInfo>{user.jobTitle}</UserInfo>
        <StyledLink to={`/users/${user.uid}`}>
          <Button1>查看個人頁面</Button1>
        </StyledLink>
      </InnerWrapper>
    </Card>
  );
}

export default UserCard;
