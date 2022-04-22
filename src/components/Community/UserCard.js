import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold } from "../common/Components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
`;

const Card = styled(FlexWrapper)`
  flex-direction: column;
  border: 1px solid #dadada;
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
        <button>查看個人頁面</button>
      </StyledLink>
    </Card>
  );
}

export default UserCard;
