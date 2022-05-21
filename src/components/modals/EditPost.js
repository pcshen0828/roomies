import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";

import styled from "styled-components";
import { subColor } from "../../styles/GlobalStyle";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import {
  BackgroundImage,
  Bold,
  Error,
  FlexWrapper,
  HiddenInput,
  LoadingButton,
  ProfileImage,
  Textarea,
} from "../common/Components";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";

const NewModal = styled(Modal)`
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;

  @media screen and (max-width: 767.98px) {
    width: 90%;
  }
`;

const NewBody = styled(Body)`
  max-height: 350px;
  overflow-y: auto;
  border: none;
  height: auto;
`;

const Profile = styled(ProfileImage)`
  width: 45px;
  height: 45px;
  margin-right: 10px;
`;

const ContentBlock = styled.div`
  width: 100%;
  justify-content: space-between;
  margin: 20px 0;
`;

const NewTextarea = styled(Textarea)`
  margin: -10px 0 10px;
  width: calc(100% - 22px);
  height: 140px;
  font-size: 16px;
  padding: 10px 10px 10px 0;
  border: 1px solid transparent;
  &:hover,
  &:focus {
    border: 1px solid transparent;
  }
`;

const OptionBlock = styled.label`
  display: flex;
  align-items: center;
  width: calc(100% - 50px);
  margin: 10px auto 30px;
  height: 50px;
  border-radius: 10px;
  padding: 0 0 0 10px;
  justify-content: space-between;
  cursor: pointer;
  background: #f2f5f7;
  border: 1px solid #f2f5f7;
  &:hover {
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
  }
`;

const PostButton = styled(Button)`
  margin-top: -5px;
`;

const PendingButton = styled(Button)`
  cursor: not-allowed;
  background: #dadada;
  color: #424b5a;
  margin-top: -5px;

  &:hover {
    background: #dadada;
  }
`;

const AddImageButton = styled.div`
  font-size: 40px;
  font-weight: 700;
  margin-right: 20px;
  align-self: end;
`;

const ImageDisplayer = styled(FlexWrapper)`
  width: 100%;
  height: 120px;
  overflow-x: auto;
`;

const DeleteButton = styled.div`
  position: absolute;
  top: 0px;
  right: 5px;
  cursor: pointer;
  display: none;
  padding: 5px;
  font-size: 30px;
  font-weight: 700;
  border-radius: 50%;

  &:hover {
    color: ${subColor};
  }
`;

const ImageContainer = styled.div`
  width: 200px;
  height: 100%;
  position: relative;
  margin-right: 10px;
  flex-shrink: 0;
  &:hover ${DeleteButton} {
    display: block;
  }
`;

const Image = styled(BackgroundImage)`
  width: 100%;
  height: 100%;
`;

const NewError = styled(Error)`
  width: calc(100% - 40px);
  padding: 20px;
  margin: -30px auto 0;
  height: 30px;
`;

export default function EditPostModal({
  currentUser,
  toggle,
  post,
  setUpdated,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [postConfirm, setPostConfirm] = useState(false);
  const [content, setContent] = useState(post.content);
  const [images, setImages] = useState(post.images);
  const newImage = useRef(null);
  const [error, setError] = useState("");

  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  function displayFileImage(file) {
    if (!file) return;
    if ((file.size / 1024 / 1024).toFixed(4) >= 2) {
      setError("檔案過大，請重新上傳");
      return;
    }
    setNewFiles((prev) => [...prev, file]);
    const newUrl = URL.createObjectURL(file);
    setImages((prev) => [...prev, { name: file.name, url: newUrl }]);
    setError("");
    newImage.current.value = null;
  }

  function hideImage(indexToHide, fileName) {
    setImages((prev) => prev.filter((image, index) => index !== indexToHide));
    setNewFiles((prev) => [...prev.filter((file) => file.name !== fileName)]);
  }

  function updatePost() {
    setLoading(true);
    const time = Firebase.Timestamp.fromDate(new Date());

    const names = images.map((image) => image.name);
    post.images
      .filter((image) => !names.includes(image.name))
      .forEach((image) => {
        const desertRef = Firebase.ref(
          Firebase.storage,
          `posts/${post.id}/${image.name}`
        );
        Firebase.deleteObject(desertRef).catch((error) => {
          console.log(error);
        });
      });

    newFiles.forEach((file) => {
      api
        .uploadFileAndGetDownloadUrl(`posts/${post.id}/${file.name}`, file)
        .then((res) => {
          setImages((prev) => [
            ...prev.filter((image) => image.name !== file.name),
            { name: file.name, url: res },
          ]);
        });
    });

    api.updateDocData("posts", post.id, {
      content,
      images,
      updateTime: time,
    });
    setLoading(false);
    setUpdated("updated");
    toggle();
  }

  return (
    <Overlay>
      {openConfirm && (
        <ConfirmBeforeActionModal
          toggle={() => setOpenConfirm(false)}
          message="尚未儲存，確認離開？"
          action={() => {
            toggle();
          }}
        />
      )}
      {postConfirm && (
        <ConfirmBeforeActionModal
          toggle={() => setPostConfirm(false)}
          message="確認更新？"
          action={() => {
            updatePost();
          }}
        />
      )}
      <NewModal>
        <Header>
          <Title>編輯貼文</Title>
          <CloseButton
            onClick={() => {
              setOpenConfirm(true);
            }}
          >
            ×
          </CloseButton>
        </Header>
        <NewBody>
          <FlexWrapper>
            <Profile src={currentUser.profileImage} />
            <Bold>{currentUser.alias}</Bold>
          </FlexWrapper>
          <ContentBlock>
            <NewTextarea
              placeholder="建立公開貼文......"
              value={content}
              onChange={(e) => {
                setContent(`${e.target.value}`);
              }}
            ></NewTextarea>
            {images.length ? (
              <ImageDisplayer>
                {images.map((image, index) => (
                  <ImageContainer key={index}>
                    <Image src={image.url} />
                    <DeleteButton onClick={() => hideImage(index, image.name)}>
                      ×
                    </DeleteButton>
                  </ImageContainer>
                ))}
              </ImageDisplayer>
            ) : (
              ""
            )}
          </ContentBlock>
        </NewBody>
        <OptionBlock htmlFor="image">
          新增圖片到貼文
          <AddImageButton>+</AddImageButton>
        </OptionBlock>
        <HiddenInput
          id="image"
          type="file"
          accept="image/*"
          ref={newImage}
          onChange={(e) => {
            const file = e.target.files[0];
            displayFileImage(file);
          }}
        />
        {error && <NewError>{error}</NewError>}
        {content ? (
          loading ? (
            <LoadingButton>更新中</LoadingButton>
          ) : (
            <PostButton
              onClick={() => {
                setPostConfirm(true);
              }}
            >
              更新
            </PostButton>
          )
        ) : (
          <PendingButton>更新</PendingButton>
        )}
      </NewModal>
    </Overlay>
  );
}

EditPostModal.propTypes = {
  currentUser: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  setUpdated: PropTypes.func.isRequired,
};
