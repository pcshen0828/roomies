import React from "react";
import styled from "styled-components";
import {
  SmallTitle,
  SmallLabel,
  Input,
  Error,
  Required,
  Select,
} from "../../common/Components";
import api from "../../../utils/api";
import {
  GoogleMap,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { googleMapsAppKey } from "../../../appkeys";
import { Firebase } from "../../../utils/firebase";
import { mainColor } from "../../../styles/GlobalStyle";

const CoverImageDisplayer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const Image = styled.div`
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 320px;
  height: 200px;
  margin: 0 10px 10px 0;
`;

const ChooseImageButton = styled.label`
  width: 90px;
  height: 30px;
  border: 1px solid #dadada;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #dadada;
  }
`;

const HiddenInputFilePicker = styled.input`
  display: none;
`;

const SearchBox = styled.input`
  height: 38px;
  border: 1px solid #dadada;
  padding: 0;
  padding-left: 10px;
  width: 90%;
  margin-bottom: 20px;
  box-sizing: border-box;
  color: ${mainColor};

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

const libraries = ["places"];

function EditPropertyPage1({
  apartment,
  basicInfo,
  setBasicInfo,
  handleError,
}) {
  const coverFileRef = React.useRef(null);
  const [error, setError] = React.useState("");

  const [searchBox, setSearchBox] = React.useState(null);
  const [map, setMap] = React.useState(null);
  const [query, setQuery] = React.useState("");

  const { isLoaded, loadError } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: googleMapsAppKey,
    libraries,
    language: "zh-TW",
  });

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const searchBoxOnLoad = (ref) => {
    setSearchBox(ref);
  };
  const onPlacesChanged = () => {
    const place = searchBox.getPlaces()[0];
    const newCenter = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setBasicInfo({
      ...basicInfo,
      address: place.formatted_address,
      query: place.formatted_address,
      geoLocation: newCenter,
    });
    setQuery("");
  };

  function handleUpload(file) {
    if ((file.size / 1024 / 1024).toFixed(4) >= 2) {
      setError("檔案過大，請重新上傳");
      return;
    }
    setError("");
    api
      .uploadFileAndGetDownloadUrl(
        `apartments/${basicInfo.id}/cover/cover`,
        file
      )
      .then((snapshot) => {
        Firebase.getDownloadURL(snapshot.ref).then((downloadURL) => {
          setBasicInfo({
            ...basicInfo,
            coverImage: downloadURL,
            coverFile: file,
          });
          coverFileRef.current.value = null;
        });
      });
  }

  function checkIsNaN(e) {
    handleError("");
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
      handleError("只能輸入數字！");
    }
  }

  return (
    <>
      <SmallTitle htmlFor="title">
        封面照片（建議比例：16:9）<Required>*</Required>
      </SmallTitle>
      <CoverImageDisplayer>
        <Image src={basicInfo.coverImage} />
        <ChooseImageButton htmlFor="coverImage">重新選擇</ChooseImageButton>
        <HiddenInputFilePicker
          id="coverImage"
          ref={coverFileRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleUpload(e.target.files[0]);
          }}
        />
        {error && <Error>{error}</Error>}
      </CoverImageDisplayer>

      <SmallLabel htmlFor="title">
        房源名稱<Required>*</Required>
      </SmallLabel>
      <Input
        id="title"
        value={basicInfo.title}
        onFocus={() => {
          handleError("");
        }}
        onChange={(e) => {
          setBasicInfo({ ...basicInfo, title: e.target.value });
          if (!e.target.value.trim()) {
            handleError("請輸入房源名稱");
          }
        }}
      />

      <SmallLabel htmlFor="geoLocation">
        房源地址<Required>*</Required>
      </SmallLabel>
      {isLoaded ? (
        <>
          <StandaloneSearchBox
            onLoad={searchBoxOnLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <SearchBox
              placeholder="請輸入地點"
              id="geoLocation"
              value={basicInfo.query}
              onFocus={() => {
                handleError("");
              }}
              onChange={(e) => {
                setBasicInfo({ ...basicInfo, query: e.target.value });
                if (!e.target.value.trim()) {
                  handleError("請輸入房源地址");
                }
              }}
            />
          </StandaloneSearchBox>
          <GoogleMap
            mapContainerStyle={{ width: "0px", height: "0px" }}
            onLoad={onLoad}
            onUnmount={onUnmount}
            center={{
              lat: 25.0384803,
              lng: 121.5323711,
            }}
            zoom={17}
          ></GoogleMap>
        </>
      ) : (
        <></>
      )}

      <SmallLabel htmlFor="monthlyRent">
        每月房租（間）<Required>*</Required>
      </SmallLabel>
      <Input
        id="monthlyRent"
        type="tel"
        value={basicInfo.monthlyRent}
        onFocus={() => {
          handleError("");
        }}
        onKeyPress={(event) => {
          checkIsNaN(event);
        }}
        onChange={(e) => {
          if (!e.target.value.trim()) {
            handleError("請輸入每月房租");
          }
          if (parseInt(e.target.value) < 1) {
            handleError("請輸入有效數值");
            e.target.value = "";
          }
          setBasicInfo({ ...basicInfo, monthlyRent: e.target.value });
        }}
      />

      <SmallLabel htmlFor="roomiesCount">
        可住人數<Required>*</Required>
      </SmallLabel>
      <Select
        id="roomiesCount"
        value={basicInfo.roomiesCount}
        onFocus={() => {
          handleError("");
        }}
        onChange={(e) => {
          setBasicInfo({ ...basicInfo, roomiesCount: e.target.value });
        }}
      >
        {Array.from(Array(10).keys()).map((num) => (
          <option key={num} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </Select>

      <SmallLabel htmlFor="rooms">
        房間數<Required>*</Required>
      </SmallLabel>
      <Select
        id="rooms"
        value={basicInfo.rooms}
        onFocus={() => {
          handleError("");
        }}
        onChange={(e) => {
          setBasicInfo({ ...basicInfo, rooms: e.target.value });
        }}
      >
        {Array.from(Array(10).keys()).map((num) => (
          <option key={num} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </Select>
    </>
  );
}

export default EditPropertyPage1;