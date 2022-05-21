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
  ProfileImage,
  Textarea,
} from "../common/Components";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";

import { v4 as uuidv4 } from "uuid";

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

const newPostID = uuidv4();

export default function CreateNewPostModal({
  toggle,
  currentUser,
  groupID,
  setPosted,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [postConfirm, setPostConfirm] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const newImage = useRef(null);
  const [error, setError] = useState("");

  function uploadImageFile(file) {
    if (!file) return;
    if ((file.size / 1024 / 1024).toFixed(4) >= 2) {
      setError("檔案過大，請重新上傳");
      return;
    }
    api
      .uploadFileAndGetDownloadUrl(`posts/${newPostID}/${file.name}`, file)
      .then((downloadUrl) => {
        setImages((prev) => [...prev, { name: file.name, url: downloadUrl }]);
      })
      .then(() => {
        setError("");
        newImage.current.value = null;
      });
  }

  function deleteImage(indexToDelete) {
    setImages((prev) => prev.filter((image, index) => index !== indexToDelete));
    const desertRef = Firebase.ref(
      Firebase.storage,
      `posts/${newPostID}/${images[indexToDelete].name}`
    );
    Firebase.deleteObject(desertRef).catch((error) => {
      console.log(error);
    });
  }

  function createNewPost() {
    const time = Firebase.Timestamp.fromDate(new Date());
    const newPostDocRef = api.createNewDocRefWithDocID("posts", newPostID);
    api.setNewDoc(newPostDocRef, {
      id: newPostID,
      creator: currentUser.uid,
      content,
      images,
      groupID,
      createTime: time,
      updateTime: time,
      isOnTop: false,
    });
    toggle();
    setPosted("posted");
  }

  return (
    <Overlay>
      {openConfirm && (
        <ConfirmBeforeActionModal
          toggle={() => setOpenConfirm(false)}
          message="尚未發佈，確認離開？"
          action={() => {
            images.forEach((image, index) => {
              deleteImage(index);
            });
            toggle();
          }}
        />
      )}
      {postConfirm && (
        <ConfirmBeforeActionModal
          toggle={() => setPostConfirm(false)}
          message="確認發佈？"
          action={() => {
            createNewPost();
          }}
        />
      )}
      <NewModal>
        <Header>
          <Title>建立貼文</Title>
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
                    <DeleteButton onClick={() => deleteImage(index)}>
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
            uploadImageFile(file);
          }}
        />
        {error && <NewError>{error}</NewError>}
        {content ? (
          <PostButton
            onClick={() => {
              setPostConfirm(true);
            }}
          >
            發佈
          </PostButton>
        ) : (
          <PendingButton>發佈</PendingButton>
        )}
      </NewModal>
    </Overlay>
  );
}

CreateNewPostModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  groupID: PropTypes.string.isRequired,
  setPosted: PropTypes.func.isRequired,
};
