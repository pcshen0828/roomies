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
import { SmallLabel, Button1 } from "../common/Components";
import { useAuth } from "../../context/AuthContext";

const NewOverlay = styled(Overlay)``;

const NewModal = styled(Modal)`
  height: 600px;
  max-height: 90vh;
  overflow-y: auto;
  @media screen and (max-width: 767.98px) {
    width: 90%;
  }
`;

const NewBody = styled(Body)`
  height: auto;
  min-height: 400px;
  border: none;
  overflow-y: auto;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`;

const UploadButton = styled(SmallLabel)`
  padding: 15px 20px;
  border-radius: 5px;
  background: #e8e8e8;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileImage = styled.img`
  width: 50%;
  margin-bottom: 10px;
`;

const FileCancelButton = styled(Button1)`
  width: 90px;
  height: 35px;
  font-size: 14px;
`;

const Error = styled.div`
  font-size: 14px;
  color: #ed3636;
  margin-top: 10px;
`;

function ChangeProfileImageModal({ toggle, setProfileImage, file, setFile }) {
  const { currentUser } = useAuth();
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const fileRef = React.useRef(null);

  return (
    <NewOverlay out={false}>
      <NewModal>
        <Header>
          <Title>更新大頭照</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <UploadButton htmlFor="profile">＋ 上傳照片</UploadButton>
          <HiddenInput
            ref={fileRef}
            id="profile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if ((e.target.files[0].size / 1024 / 1024).toFixed(4) >= 1) {
                setError("檔案過大，請重新上傳");
                return;
              }
              setError("");
              setFile(e.target.files[0]);
              const objectUrl = URL.createObjectURL(e.target.files[0]);
              setUrl(objectUrl);
            }}
          />
          {error && <Error>{error}</Error>}
          {url && (
            <FileWrapper>
              <FileImage src={url} alt="" />
              <FileCancelButton
                onClick={() => {
                  setFile(null);
                  setUrl("");
                  fileRef.current.value = null;
                }}
              >
                重新選擇
              </FileCancelButton>
            </FileWrapper>
          )}
        </NewBody>
        <Button
          onClick={() => {
            setProfileImage(url ? url : currentUser.profileImage);
            toggle(false);
          }}
        >
          確認
        </Button>
      </NewModal>
    </NewOverlay>
  );
}

export default ChangeProfileImageModal;
