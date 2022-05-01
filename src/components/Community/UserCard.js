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
  height: 200px;
  border-radius: 10px;
  margin: 0 20px 20px 0;
  padding: 20px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const UserInfo = styled(FlexWrapper)`
  flex-direction: column;
`;

function UserCard({ user }) {
  return (
    <Card>
      <ProfileImage src={user.profileImage} />
      <Bold>{user.alias}</Bold>
      <StyledLink to={`/users/${user.uid}`}>
        <Button1>查看個人頁面</Button1>
      </StyledLink>
    </Card>
  );
}

export default UserCard;
