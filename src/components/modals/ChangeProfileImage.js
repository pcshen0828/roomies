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
import { SmallLabel, Button1, FlexWrapper, Bold } from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import AvatarEditor from "react-avatar-editor";
import { mainColor } from "../../styles/GlobalStyle";

const NewOverlay = styled(Overlay)`
  overflow-y: auto;
`;

const NewModal = styled(Modal)`
  height: auto;
  max-height: 100vh;
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

const EditorWrapper = styled(FlexWrapper)`
  align-items: flex-start;
  min-height: 320px;
`;

const FileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
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

function ChangeProfileImageModal({ toggle, setProfileImage, file, setFile }) {
  const { currentUser } = useAuth();
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const fileRef = React.useRef(null);
  const editor = React.useRef(null);

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
            {file && (
              <FileWrapper>
                <AvatarEditor
                  ref={editor}
                  image={file}
                  width={250}
                  height={250}
                  borderRadius={125}
                  color={[0, 0, 0, 0.3]} // RGBA
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
                            setUrl(newUrl);
                            fetch(newUrl)
                              .then((res) => res.blob())
                              .then((blobFile) =>
                                setFile(
                                  new File([blobFile], "profile", {
                                    type: "image/png",
                                  })
                                )
                              );
                          }
                        });
                      }
                    }}
                  >
                    確認裁切
                  </CheckButton>
                </ButtonWrapper>
              </FileWrapper>
            )}
            {url && (
              <FileWrapper>
                <Bold>預覽結果：</Bold>
                <FileImage src={url} alt="" />
              </FileWrapper>
            )}
          </EditorWrapper>
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
