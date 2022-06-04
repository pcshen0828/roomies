import PropTypes from "prop-types";
import { Firebase } from "../../utils/firebase";
import styled from "styled-components";
import { Overlay, Modal, Header, Title, CloseButton } from "./ModalElements";
import { Button1, FlexWrapper, RejectButton } from "../common/Components";

const HigherOverlay = styled(Overlay)`
  z-index: 1200;
`;

const NewModal = styled(Modal)`
  justify-content: center;
  align-items: center;
  height: 160px;
  padding: 0px 20px 0px;
  max-width: 500px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: visible;
`;

const NewHeader = styled(Header)`
  width: 100%;
  align-items: center;
  height: auto;
`;

const ContentWrapper = styled(FlexWrapper)`
  width: 100%;
`;

const ButtonsWrapper = styled(FlexWrapper)`
  align-self: end;
  margin-bottom: 20px;
`;

function ConfirmBeforeQuitModal({ toggle, quit, apartmentId, file }) {
  async function closeAndDeleteDoc() {
    if (file) {
      await Firebase.deleteDoc(
        Firebase.doc(Firebase.db, "apartments", apartmentId)
      );
      const desertRef = Firebase.ref(
        Firebase.storage,
        `apartments/${apartmentId}/cover/cover`
      );
      Firebase.deleteObject(desertRef).catch((error) => {
        console.log(error);
      });
    }
    quit();
  }
  return (
    <HigherOverlay out={false}>
      <NewModal>
        <NewHeader>
          <Title>再次確認</Title>
          <CloseButton onClick={toggle}>×</CloseButton>
        </NewHeader>
        <ContentWrapper>尚未儲存，確認離開？</ContentWrapper>
        <ButtonsWrapper>
          <Button1 onClick={closeAndDeleteDoc}>確認</Button1>
          <RejectButton onClick={toggle}>取消</RejectButton>
        </ButtonsWrapper>
      </NewModal>
    </HigherOverlay>
  );
}

ConfirmBeforeQuitModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  quit: PropTypes.func.isRequired,
  apartmentId: PropTypes.string.isRequired,
  file: PropTypes.instanceOf(File),
};

export default ConfirmBeforeQuitModal;
