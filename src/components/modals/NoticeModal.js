import React from "react";
import styled from "styled-components";
import { NavModalOverlay, NavModal } from "./ModalElements";

function NoticeModal({ setActiveIcon }) {
  return (
    <NavModalOverlay onClick={() => setActiveIcon("")}>
      <NavModal onClick={(e) => e.stopPropagation()}>notice</NavModal>
    </NavModalOverlay>
  );
}

export default NoticeModal;
