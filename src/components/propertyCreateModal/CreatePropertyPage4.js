import React from "react";
import styled from "styled-components";
import {
  SmallTitle,
  FlexWrapper,
  Error,
  LoadingButton,
  PagingList,
  Button1,
} from "../common/Components";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";

const Image = styled.div`
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
`;

const ImageContainer = styled.div`
  position: relative;
  &:hover ${DeleteButton} {
    display: block;
  }
`;

const ImagesDisplayer = styled(FlexWrapper)`
  width: 95%;
  overflow-x: scroll;
`;

const HiddenInputFilePicker = styled.input`
  display: none;
`;

const UploadNewImage = styled.label`
  margin: 0 30px 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
`;

function CreatePropertyPage4({ id, paging, setPaging, toggle, apartment }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const fileRef = React.useRef(null);
  const [error, setError] = React.useState("");
  const [images, setImages] = React.useState(
    apartment.images ? apartment.images : []
  );

  React.useEffect(() => {
    console.log(apartment);
  }, [apartment]);

  function updateApartmentInfo() {
    setIsLoading(true);
    const time = Firebase.Timestamp.fromDate(new Date());
    api.updateDocData("apartments", id, {
      images,
      updateTime: time,
      status: 1,
    });
    setIsLoading(false);
    toggle(false);
  }

  function uploadImageFile(e) {
    const file = e.target.files[0];
    if ((file.size / 1024 / 1024).toFixed(4) >= 2) {
      setError("檔案大小過大，請重新上傳");
      return;
    }
    api
      .uploadFileAndGetDownloadUrl(`apartments/${id}/${file.name}`, file)
      .then((snapshot) => {
        Firebase.getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImages((prev) => [...prev, { name: file.name, url: downloadURL }]);
        });
      })
      .then(() => {
        setError("");
        fileRef.current = null;
      });
  }

  function deleteImage(indexToDelete) {
    setImages((prev) => prev.filter((image, index) => index !== indexToDelete));
    const desertRef = Firebase.ref(
      Firebase.storage,
      `apartments/${id}/${images[indexToDelete].name}`
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
          <HiddenInputFilePicker
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
      <PagingList>
        {paging === 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <Button1 onClick={updateApartmentInfo}>儲存並完成</Button1>
          ))}
      </PagingList>
    </>
  );
}

export default CreatePropertyPage4;
