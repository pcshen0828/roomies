import React from "react";
import styled from "styled-components";
import { Overlay, Modal } from "./ModalElements";
import { Firebase } from "../../utils/firebase";
import { Button1 } from "../common/Components";

const HigherOverlay = styled(Overlay)`
  z-index: 1200;
`;

const NewModal = styled(Modal)`
  justify-content: center;
  align-items: center;
  height: 100px;
  padding: 20px 20px 0;
`;

function ConfirmBeforeQuitModal({ toggle, apartmentId }) {
  async function closeAndDeleteDoc() {
    toggle(false);
    // fix me
    await Firebase.deleteDoc(
      Firebase.doc(Firebase.db, "apartments", apartmentId)
    );
    const desertRef = Firebase.ref(
      Firebase.storage,
      `apartments/${apartmentId}/cover/cover`
    );
    Firebase.deleteObject(desertRef)
      .then(() => {
        console.log("deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <HigherOverlay>
      <NewModal>
        尚未儲存，確認離開？
        <Button1 onClick={closeAndDeleteDoc}>確認</Button1>
      </NewModal>
    </HigherOverlay>
  );
}

export default ConfirmBeforeQuitModal;
