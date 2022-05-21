import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Firebase } from "../../../utils/firebase";
import api from "../../../utils/api";
import styled from "styled-components";
import { subColor } from "../../../styles/GlobalStyle";
import {
  SmallTitle,
  FlexWrapper,
  Error,
  HiddenInput,
  BackgroundImage,
} from "../../common/Components";

const Image = styled(BackgroundImage)`
  width: 320px;
  height: 200px;
  margin: 0 10px 10px 0;
`;

const DeleteButton = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  display: none;
  font-size: 30px;
  font-weight: 700;
  border-radius: 50%;
  padding: 0px 5px;

  &:hover {
    color: ${subColor};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  &:hover ${DeleteButton} {
    display: block;
  }
`;

const ImagesDisplayer = styled(FlexWrapper)`
  width: 95%;
  overflow-x: auto;
`;

const UploadNewImage = styled.label`
  margin: 0 30px 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
`;

function EditPropertyPage4({ apartment, images, setImages }) {
  const fileRef = useRef(null);
  const [error, setError] = useState("");

  function uploadImageFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if ((file.size / 1024 / 1024).toFixed(4) >= 2) {
      setError("檔案過大，請重新上傳");
      return;
    }
    api
      .uploadFileAndGetDownloadUrl(
        `apartments/${apartment.id}/${file.name}`,
        file
      )
      .then((res) => {
        setImages((prev) => [...prev, { name: file.name, url: res }]);
      })
      .then(() => {
        setError("");
        fileRef.current.value = null;
      });
  }

  function deleteImage(indexToDelete) {
    setImages((prev) => prev.filter((image, index) => index !== indexToDelete));
    const desertRef = Firebase.ref(
      Firebase.storage,
      `apartments/${apartment.id}/${images[indexToDelete].name}`
    );
    Firebase.deleteObject(desertRef).catch((error) => {
      setError(error);
    });
  }
  return (
    <>
      <SmallTitle htmlFor="title">其他照片</SmallTitle>
      {error && <Error>{error}</Error>}
      <ImagesDisplayer>
        <FlexWrapper>
          {images.map((image, index) => (
            <ImageContainer key={index}>
              <Image src={image.url} />
              <DeleteButton onClick={() => deleteImage(index)}>×</DeleteButton>
            </ImageContainer>
          ))}
          <UploadNewImage htmlFor="images">+</UploadNewImage>
          <HiddenInput
            id="images"
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={(event) => {
              uploadImageFile(event);
            }}
          />
        </FlexWrapper>
      </ImagesDisplayer>
    </>
  );
}

EditPropertyPage4.propTypes = {
  apartment: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
};

export default EditPropertyPage4;
