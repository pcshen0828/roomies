import React from "react";
import styled from "styled-components";
import {
  SmallTitle,
  FlexWrapper,
  Error,
  LoadingButton,
  PagingList,
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

function EditPropertyPage4({ apartment, paging, setPaging }) {
  const [isLoading, setIsLoading] = React.useState(false);

  // 4. 其他照片待上傳的圖片檔案們
  const [files, setFiles] = React.useState([]);
  // 5. 控制其他照片的 file ref
  const fileRef = React.useRef(null);

  // 7. 上傳其他照片的錯誤訊息
  const [bottomError, setBottomError] = React.useState("");
  // 8. 其他照片已上傳的圖片網址們
  const [images, setImages] = React.useState(apartment.images);

  // 9. 已上傳圖片網址 + 預覽圖片網址 的混合體 (optional)
  // const [hybridImages, setHybridImages] = array1.concat(array2);

  React.useEffect(() => {
    console.log(apartment);
  }, [apartment]);

  function updateApartmentInfo() {
    const time = Firebase.Timestamp.fromDate(new Date());
    // 更新第一層 document
    api.updateDocData("apartments", apartment.id, {
      ...apartment,
      images, //
      updateTime: time,
    });

    // firestore 要上傳 單張封面照片 並取得圖片網址
    // firestore 要上傳 多張特色照片 並取得圖片網址們
    // 要更新 多個 collection 的資料

    if (files.length) {
    }
  }
  async function getUploadedImageUrls() {
    let uploadedImages = [];
    const listRef = Firebase.ref(
      Firebase.storage,
      `apartments/${apartment.id}`
    );
    Firebase.listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          Firebase.getDownloadURL(Firebase.ref(Firebase.storage, itemRef)).then(
            (downloadURL) => {
              console.log(downloadURL);
              uploadedImages.push(downloadURL);
            }
          );
        });
        setImages(uploadedImages);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteImage(indexToDelete) {
    //  把點選掉的連結從 images 陣列中移除
    setImages((prev) => prev.filter((image, index) => index !== indexToDelete));
  }

  return (
    <>
      <SmallTitle htmlFor="title">其他照片</SmallTitle>
      {bottomError && <Error>{bottomError}</Error>}
      <ImagesDisplayer>
        <FlexWrapper>
          {images.map((image, index) => (
            <ImageContainer key={index}>
              <Image src={image} />
              <DeleteButton onClick={() => deleteImage(index)}>×</DeleteButton>
            </ImageContainer>
          ))}
          <UploadNewImage htmlFor="images">+</UploadNewImage>
          <HiddenInputFilePicker
            id="images"
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={(e) => {
              if ((e.target.files[0].size / 1024 / 1024).toFixed(4) >= 1.5) {
                setBottomError("檔案大小過大，請重新上傳");
                return;
              }
              setBottomError("");
              setFiles((prev) => [...prev, e.target.files[0]]);
              const objectUrl = URL.createObjectURL(e.target.files[0]);
              setImages((prev) => [...prev, objectUrl]);
              fileRef.current = null;
            }}
          />
        </FlexWrapper>
      </ImagesDisplayer>
      <PagingList>
        {paging > 1 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <button
              onClick={() => setPaging((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              上一頁
            </button>
          ))}
        {paging < 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <button
              onClick={() => setPaging((prev) => (prev < 4 ? prev + 1 : 4))}
            >
              儲存並繼續
            </button>
          ))}
        {paging === 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <button>儲存並完成</button>
          ))}
      </PagingList>
    </>
  );
}

export default EditPropertyPage4;
