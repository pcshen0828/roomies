import { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../utils/api";
import {
  GoogleMap,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";

import styled from "styled-components";
import {
  SmallTitle,
  SmallLabel,
  Input,
  Error,
  Required,
  Select,
  FlexColumn,
  BackgroundImage,
  HiddenInput,
} from "../../common/Components";
import { generateSelectOptionsByAmountNumber } from "../../../utils/generate";
import { checkEventKeyIsNaN } from "../../../utils/calculate";

const CoverImageDisplayer = styled(FlexColumn)`
  margin-bottom: 10px;
`;

const Image = styled(BackgroundImage)`
  width: 320px;
  height: 180px;
  margin: 0 10px 10px 0;
  @media screen and (max-width: 575.98px) {
    width: 240px;
    height: 135px;
  }
`;

const ChooseImageButton = styled.label`
  width: 120px;
  height: 35px;
  border: 1px solid #dadada;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background: #dadada;
  }
`;

const SearchBox = styled.input`
  height: 30px;
  border: 1px solid #dadada;
  padding: 0;
  padding-left: 10px;
  width: 90%;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

const libraries = ["places"];

function Page1({ apartmentId, basicInfo, setBasicInfo, handleError }) {
  const coverFileRef = useRef(null);
  const [error, setError] = useState("");
  const [searchBox, setSearchBox] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "zh-TW",
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
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
  };

  function handleUpload(file) {
    if ((file.size / 1024 / 1024).toFixed(4) >= 2) {
      setError("檔案過大，請重新上傳");
      return;
    }
    setError("");
    api
      .uploadFileAndGetDownloadUrl(
        `apartments/${apartmentId}/cover/cover`,
        file
      )
      .then((downloadUrl) => {
        setBasicInfo({
          ...basicInfo,
          coverImage: downloadUrl,
          coverFile: file,
        });
        coverFileRef.current.value = null;
      });
  }

  return (
    <>
      <SmallTitle htmlFor="title">
        封面照片（建議比例：16:9）<Required>*</Required>
      </SmallTitle>
      <CoverImageDisplayer>
        <Image src={basicInfo.coverImage} />
        <ChooseImageButton htmlFor="coverImage">上傳封面照片</ChooseImageButton>
        <HiddenInput
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
      {isLoaded && (
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
        onKeyPress={(e) => {
          const bool = checkEventKeyIsNaN(e);
          if (bool) e.preventDefault();
          handleError(bool ? "只能輸入數字！" : "");
        }}
        onChange={(e) => {
          if (isNaN(e.target.value)) {
            handleError("只能輸入數字！");
            e.target.value = "";
          }
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
        {generateSelectOptionsByAmountNumber(10)}
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
        {generateSelectOptionsByAmountNumber(10)}
      </Select>
    </>
  );
}

Page1.propTypes = {
  apartmentId: PropTypes.string.isRequired,
  basicInfo: PropTypes.object.isRequired,
  setBasicInfo: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
};

export default Page1;
