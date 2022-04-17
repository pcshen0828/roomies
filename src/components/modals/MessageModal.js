import React from "react";
import styled from "styled-components";
import { NavModalOverlay, NavModal } from "./ModalElements";

function MessageModal({ setActiveIcon }) {
  return (
    <NavModalOverlay onClick={() => setActiveIcon("")}>
      <NavModal onClick={(e) => e.stopPropagation()}>messages</NavModal>
    </NavModalOverlay>
  );
}

export default MessageModal;
