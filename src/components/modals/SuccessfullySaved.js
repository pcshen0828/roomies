import { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal, Overlay } from "./ModalElements";

const NewOverlay = styled(Overlay)`
  background: none;
`;

const NewModal = styled(Modal)`
  width: 200px;
  height: 60px;
  position: absolute;
  top: 85px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  transition: all 0.5s;
`;

export default function SuccessfullySavedModal({ toggle, message }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      toggle(false);
    }, 1500);
    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <NewOverlay out={false}>
      <NewModal>{message}</NewModal>
    </NewOverlay>
  );
}

SuccessfullySavedModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
