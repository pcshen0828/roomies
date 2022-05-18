import React from "react";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import { mainColor } from "../../styles/GlobalStyle";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Title,
  Body,
  Button,
} from "./ModalElements";
import {
  SmallLabel,
  Button1,
  FlexWrapper,
  Bold,
  FlexColumn,
} from "../common/Components";

import AvatarEditor from "react-avatar-editor";

const NewOverlay = styled(Overlay)`
  overflow-y: auto;
`;

const NewModal = styled(Modal)`
  height: auto;
  max-height: 100vh;
  max-width: 600px;
  @media screen and (max-width: 767.98px) {
    width: 90%;
  }
`;

const NewBody = styled(Body)`
  height: auto;
  min-height: 400px;
  border: none;
  overflow-y: auto;
  align-items: center;
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

const EditorWrapper = styled(FlexWrapper)`
  align-items: flex-start;
  min-height: 320px;
`;

const FileWrapper = styled(FlexColumn)`
  align-items: center;
`;

const FileImage = styled.img`
  width: 150px;
  height: 150px;
  margin: 10px 0;
  border-radius: 50%;
`;

const ButtonWrapper = styled(FlexWrapper)`
  margin-top: 20px;
`;

const CheckButton = styled(Button1)`
  width: 90px;
  height: 35px;
`;

const ResetButton = styled(Button1)`
  width: 90px;
  height: 35px;
  margin-right: 10px;
  background: #e8e8e8;
  color: ${mainColor};
  &:hover {
    background: #dadada;
  }
`;

const Error = styled.div`
  font-size: 14px;
  color: #ed3636;
  margin-top: 10px;
`;

const Loading = styled(Button1)`
  align-self: end;
  margin: 20px;
  cursor: not-allowed;
  background: #dadada;
  color: #424b5a;
  &:hover {
    background: #dadada;
  }
`;

function ChangeProfileImageModal({
  toggle,
  setProfileImage,
  file,
  setFile,
  setSaved,
}) {
  const { currentUser } = useAuth();
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const fileRef = React.useRef(null);
  const editor = React.useRef(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  function updateProfileImage() {
    setProfileImage(url ? url : currentUser.profileImage);
    if (file) {
      setIsUploading(true);
      const storageRef = Firebase.ref(
        Firebase.storage,
        `users/${currentUser.uid}/profile`
      );
      Firebase.uploadBytes(storageRef, file).then((snapshot) => {
        Firebase.getDownloadURL(snapshot.ref).then((downloadURL) => {
          api.updateDocData("users", currentUser.uid, {
            profileImage: downloadURL,
          });
          setIsUploading(false);
          toggle(false);
          setSaved(true);
        });
      });
    }
  }

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
            }}
          />
          {error && <Error>{error}</Error>}
          <EditorWrapper>
            {file && !showPreview ? (
              <FileWrapper>
                <AvatarEditor
                  ref={editor}
                  image={file}
                  width={250}
                  height={250}
                  borderRadius={125}
                  color={[0, 0, 0, 0.3]}
                  scale={1.2}
                  rotate={0}
                />
                <ButtonWrapper>
                  <ResetButton
                    onClick={() => {
                      setFile(null);
                      setUrl("");
                      fileRef.current.value = null;
                    }}
                  >
                    重新選擇
                  </ResetButton>
                  <CheckButton
                    onClick={() => {
                      if (editor.current) {
                        const img = editor.current.getImageScaledToCanvas();
                        img.toBlob((blob) => {
                          if (blob) {
                            const newUrl = URL.createObjectURL(blob);
                            fetch(newUrl)
                              .then((res) => res.blob())
                              .then((blobFile) => {
                                setFile(
                                  new File([blobFile], "profile", {
                                    type: "image/png",
                                  })
                                );
                              })
                              .then(() => {
                                setUrl(newUrl);
                                setShowPreview(true);
                              });
                          }
                        });
                      }
                    }}
                  >
                    確認裁切
                  </CheckButton>
                </ButtonWrapper>
              </FileWrapper>
            ) : (
              ""
            )}
            {showPreview && (
              <FileWrapper>
                <Bold>預覽結果：</Bold>
                <FileImage src={url} alt="" />
                <ResetButton
                  onClick={() => {
                    setFile(null);
                    setUrl("");
                    fileRef.current.value = null;
                    setShowPreview(false);
                  }}
                >
                  重新選擇
                </ResetButton>
              </FileWrapper>
            )}
          </EditorWrapper>
        </NewBody>
        {isUploading ? (
          <Loading>上傳中</Loading>
        ) : (
          <Button
            onClick={() => {
              updateProfileImage();
            }}
          >
            確認上傳
          </Button>
        )}
      </NewModal>
    </NewOverlay>
  );
}

export default ChangeProfileImageModal;
