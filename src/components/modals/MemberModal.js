import React from "react";
import styled from "styled-components";
import { NavModalOverlay, NavModal } from "./ModalElements";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { StyledLink, Button1, Bold } from "../common/Components";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";

const SignoutButton = styled(Button1)`
  width: 90px;
  height: 35px;
  margin-top: 30px;
`;

function MemberModal({ setActiveIcon }) {
  const { signOut, currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = React.useState(false);
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
        <Bold>會員</Bold>
        <>{currentUser.email}</>
        <StyledLink to="/profile/info/edit" onClick={() => setActiveIcon("")}>
          會員專區
        </StyledLink>
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
