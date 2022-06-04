import PropTypes from "prop-types";
import styled from "styled-components";
import { Overlay, Modal, Header, Title, Button } from "./ModalElements";

const NewModal = styled(Modal)`
  max-width: 500px;
`;

const NewHeader = styled(Header)`
  justify-content: center;
  padding: 40px 0 20px;
  width: 100%;
`;
const CenterButton = styled(Button)`
  align-self: center;
  margin: 20px 0;
`;

function SignInFirstModal({ toggle }) {
  return (
    <Overlay out={false}>
      <NewModal>
        <NewHeader>
          <Title>請先登入</Title>
        </NewHeader>
        <CenterButton onClick={toggle}>確認</CenterButton>
      </NewModal>
    </Overlay>
  );
}

SignInFirstModal.propTypes = {
  toggle: PropTypes.func.isRequired,
};

export default SignInFirstModal;
