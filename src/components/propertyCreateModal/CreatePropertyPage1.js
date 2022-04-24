import React from "react";
import styled from "styled-components";
import {
  SmallTitle,
  SmallLabel,
  Input,
  Error,
  LoadingButton,
  PagingList,
  Button1,
} from "../common/Components";
import api from "../../utils/api";
import {
  GoogleMap,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { googleMapsAppKey } from "../../appkeys";
import { Firebase } from "../../utils/firebase";

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
  width: 120px;
  height: 35px;
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

function CreatePropertyPage1({ id, paging, setPaging, apartment }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState(
    apartment.title ? apartment.title : ""
  );
  const [monthlyRent, setMonthlyRent] = React.useState(
    apartment.monthlyRent ? apartment.monthlyRent : ""
  );
  const [rooms, setRooms] = React.useState(
    apartment.rooms ? apartment.rooms : ""
  );
  const [roomiesCount, setRoomiesCount] = React.useState(
    apartment.roomiesCount ? apartment.roomiesCount : ""
  );

  const [coverImage, setCoverImage] = React.useState(
    apartment.coverFile ? apartment.coverFile : ""
  );
  const [coverFile, setCoverFile] = React.useState(null);
  const coverFileRef = React.useRef(null);

  const [error, setError] = React.useState("");

  const [geoLocation, setGeoLocation] = React.useState(
    apartment.geoLocation ? apartment.geoLocation : {}
  );
  const [address, setAddress] = React.useState(
    apartment.address ? apartment.address : ""
  );
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
    console.log(searchBox.getPlaces());
    const place = searchBox.getPlaces()[0];
    const newCenter = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setAddress(place.formatted_address);
    setGeoLocation(newCenter);
    setQuery("");
  };

  function updateApartmentInfo() {
    setIsLoading(true);
    const time = Firebase.Timestamp.fromDate(new Date());
    if (coverFile) {
      api
        .uploadFileAndGetDownloadUrl(`apartments/${id}/cover/cover`, coverFile)
        .then((snapshot) => {
          Firebase.getDownloadURL(snapshot.ref).then((downloadURL) => {
            api.updateDocData("apartments", id, {
              address,
              geoLocation,
              coverImage: downloadURL,
              monthlyRent: parseInt(monthlyRent),
              roomiesCount: parseInt(roomiesCount),
              rooms: parseInt(rooms),
              title,
              updateTime: time,
            });
            setIsLoading(false);
            setPaging((prev) => (prev < 4 ? prev + 1 : 4));
          });
        });
    } else {
      api
        .updateDocData("apartments", id, {
          address,
          geoLocation,
          coverImage,
          monthlyRent: parseInt(monthlyRent),
          roomiesCount: parseInt(roomiesCount),
          rooms: parseInt(rooms),
          title,
          updateTime: time,
        })
        .then(() => {
          setIsLoading(false);
          setPaging((prev) => (prev < 4 ? prev + 1 : 4));
        });
    }
  }

  return (
    <>
      <SmallTitle htmlFor="title">封面照片（建議比例：16:9）</SmallTitle>
      <CoverImageDisplayer>
        <Image src={coverImage} />
        <ChooseImageButton htmlFor="coverImage">上傳封面照片</ChooseImageButton>
        <HiddenInputFilePicker
          id="coverImage"
          ref={coverFileRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if ((e.target.files[0].size / 1024 / 1024).toFixed(4) >= 2) {
              setError("檔案大小過大，請重新上傳");
              return;
            }
            setError("");
            setCoverFile(e.target.files[0]);
            const objectUrl = URL.createObjectURL(e.target.files[0]);
            setCoverImage(objectUrl);
            coverFileRef.current.value = null;
          }}
        />
        {error && <Error>{error}</Error>}
      </CoverImageDisplayer>

      <SmallLabel htmlFor="title">房源名稱</SmallLabel>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <SmallLabel htmlFor="geoLocation">快速搜尋房源地址</SmallLabel>
      {isLoaded ? (
        <>
          <StandaloneSearchBox
            onLoad={searchBoxOnLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <SearchBox
              placeholder="請輸入地點"
              id="geoLocation"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
          <SmallLabel htmlFor="address">顯示地址</SmallLabel>
          <Input
            value={address}
            id="address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </>
      ) : (
        <></>
      )}

      <SmallLabel htmlFor="monthlyRent">每月房租（間）</SmallLabel>
      <Input
        id="monthlyRent"
        value={monthlyRent}
        onChange={(e) => setMonthlyRent(e.target.value)}
      />

      <SmallLabel htmlFor="roomiesCount">可住人數</SmallLabel>
      <Input
        id="roomiesCount"
        value={roomiesCount}
        onChange={(e) => setRoomiesCount(e.target.value)}
      />

      <SmallLabel htmlFor="rooms">房間數</SmallLabel>
      <Input
        id="rooms"
        value={rooms}
        onChange={(e) => setRooms(e.target.value)}
      />
      <PagingList>
        {paging < 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <Button1 onClick={updateApartmentInfo}>儲存並繼續</Button1>
          ))}
      </PagingList>
    </>
  );
}

export default CreatePropertyPage1;
