import React from "react";
import styled from "styled-components";
import { NavModalOverlay, NavModal } from "./ModalElements";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { StyledLink } from "../common/Components";

const SignoutButton = styled.button`
  width: 90px;
  height: 35px;
  margin-top: 30px;
`;

function MemberModal({ setActiveIcon }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <NavModalOverlay onClick={() => setActiveIcon("")}>
      <NavModal onClick={(e) => e.stopPropagation()}>
        <StyledLink to="/profile">會員專區</StyledLink>
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
