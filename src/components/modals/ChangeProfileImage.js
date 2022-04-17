import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Title,
  Body,
  Button,
} from "./ModalElements";
import { SmallLabel, Input } from "../common/Components";
import { Firebase } from "../../utils/firebase";

function ChangeProfileImageModal({ toggle }) {
  const [file, setFile] = React.useState();
  function uploadImage() {
    const storageRef = Firebase.ref(Firebase.storage, "users/default/default");
    Firebase.uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  }
  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>更換大頭照</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <Body>
          <SmallLabel htmlFor="profile">選擇照片</SmallLabel>
          <input
            id="profile"
            type="file"
            accept="image/*"
            value={file}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Body>
        <Button>確認</Button>
      </Modal>
    </Overlay>
  );
}

export default ChangeProfileImageModal;
