import React from "react";
import styled from "styled-components";
import { NavModalOverlay, NavModal } from "./ModalElements";
import { StyledLink } from "../common/Components";

function MessageModal({ setActiveIcon }) {
  return (
    <NavModalOverlay onClick={() => setActiveIcon("")}>
      <NavModal onClick={(e) => e.stopPropagation()}>
        <StyledLink to="/messages">查看收件匣</StyledLink>
      </NavModal>
    </NavModalOverlay>
  );
}

export default MessageModal;
