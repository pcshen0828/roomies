import React from "react";
import styled from "styled-components";
import { NavModalOverlay, NavModal } from "./ModalElements";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { StyledLink, Button1, Bold } from "../common/Components";

const SignoutButton = styled(Button1)`
  width: 90px;
  height: 35px;
  margin-top: 30px;
`;

function MemberModal({ setActiveIcon }) {
  const { signOut, currentUser } = useAuth();
  const navigate = useNavigate();
  return (
    <NavModalOverlay out={false} onClick={() => setActiveIcon("")}>
      <NavModal onClick={(e) => e.stopPropagation()}>
        <Bold>會員</Bold>
        <>{currentUser.email}</>
        <StyledLink to="/profile/info/edit" onClick={() => setActiveIcon("")}>
          會員專區
        </StyledLink>
        <SignoutButton
          onClick={() => {
            signOut().then(navigate("/"));
          }}
        >
          登出
        </SignoutButton>
      </NavModal>
    </NavModalOverlay>
  );
}

export default MemberModal;
