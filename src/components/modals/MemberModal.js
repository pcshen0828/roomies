import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import styled from "styled-components";
import { mainColor } from "../../styles/GlobalStyle";
import { Button1, Bold, FlexColumn } from "../common/Components";
import { NavModalOverlay, NavModal } from "./ModalElements";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";

const NewLink = styled(Link)`
  display: flex;
  align-items: center;
  margin: 10px 0 20px;
  color: ${mainColor};
  width: 100%;
  border-radius: 10px;
  height: 80px;
  cursor: pointer;
  &:hover {
    background: #f2f5f7;
  }
`;

const ProfileImg = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: 0 10px;
`;

const NewFlexColumn = styled(FlexColumn)`
  align-items: flex-start;
`;

const SignoutButton = styled(Button1)`
  width: 90px;
  height: 35px;
`;

function MemberModal({ setActiveIcon }) {
  const { signOut, currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();
  return (
    <NavModalOverlay out={false} onClick={() => setActiveIcon("")}>
      {openConfirm && (
        <ConfirmBeforeActionModal
          message="確認登出？"
          action={() => {
            signOut().then(navigate("/"));
          }}
          toggle={setActiveIcon}
        />
      )}
      <NavModal onClick={(e) => e.stopPropagation()}>
        <Bold>{currentUser?.role === 1 ? "房客" : "屋主"}</Bold>
        <NewLink to="/profile/info/edit" onClick={() => setActiveIcon("")}>
          <ProfileImg src={currentUser?.profileImage} />
          <NewFlexColumn>
            <Bold>{currentUser?.email}</Bold>
            查看會員專區
          </NewFlexColumn>
        </NewLink>
        <SignoutButton
          onClick={() => {
            setOpenConfirm(true);
          }}
        >
          登出
        </SignoutButton>
      </NavModal>
    </NavModalOverlay>
  );
}

export default MemberModal;
