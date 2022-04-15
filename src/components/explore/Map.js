import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  StandaloneSearchBox,
  Circle,
} from "@react-google-maps/api";
import { googleMapsAppKey } from "../../appkeys";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { BodyLeft, BodyRight } from "../common/Components";
import api from "../../utils/api";
<<<<<<< HEAD
=======
import { getSuggestedQuery } from "@testing-library/react";
>>>>>>> d4dbcf6c39e94b7059300c7028852650097c13b7

const libraries = ["places"];

const defaultCenter = {
  lat: 25.0384803,
  lng: 121.5323711,
};

const options = {
  strokeColor: "#fff",
  strokeOpacity: 0.8,
  strokeWeight: 2,
<<<<<<< HEAD
  fillColor: "#424B5A",
  fillOpacity: 0.2,
=======
  fillColor: "#c1b18a",
  fillOpacity: 0.35,
>>>>>>> d4dbcf6c39e94b7059300c7028852650097c13b7
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
<<<<<<< HEAD
  radius: 450,
=======
  radius: 30,
>>>>>>> d4dbcf6c39e94b7059300c7028852650097c13b7
  zIndex: 1,
};

const containerStyle = {
  width: "100%",
  height: "700px",
  border: "1px solid #dadada",
};

const InfoModal = styled.div`
  width: 200px;
  height: 100px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-size: 14px;
  align-items: flex-start;
  font-family: "Noto Sans TC", sans-serif;
  font-weight: 700;
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 35px;
  border: 1px solid #dadada;
  margin-top: 20px;
  font-weight: 400;
`;

const SearchBox = styled.input`
  height: 30px;
  border: 1px solid #dadada;
  padding: 0;
<<<<<<< HEAD
  padding-left: 10px;
  width: calc(100% - 10px);
=======
  width: 100%;
>>>>>>> d4dbcf6c39e94b7059300c7028852650097c13b7

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

function MyMap() {
  const [map, setMap] = React.useState(null);
  const [center, setCenter] = React.useState(defaultCenter);
  const [circleCenter, setCircleCenter] = React.useState(defaultCenter);
  const [zoom, setZoom] = React.useState(12);
  const [marker, setMarker] = React.useState(center);
  const [apartments, setApartments] = React.useState([]);
  const [searchBox, setSearchBox] = React.useState(null);
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
    setCenter(newCenter);
    setCircleCenter(newCenter);
<<<<<<< HEAD
    setZoom(16);
=======
    setZoom(18);
>>>>>>> d4dbcf6c39e94b7059300c7028852650097c13b7
    setQuery("");
  };

  React.useEffect(() => {
    api
      .getAllDocsFromCollection("apartments")
      .then((res) => setApartments(res));
  }, []);

  const renderMap = () => {
    return (
      <>
        <BodyLeft>
          <StandaloneSearchBox
            onLoad={searchBoxOnLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <SearchBox
              type="text"
<<<<<<< HEAD
              placeholder="請輸入地點"
=======
              placeholder="Customized your placeholder"
>>>>>>> d4dbcf6c39e94b7059300c7028852650097c13b7
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </StandaloneSearchBox>
        </BodyLeft>
        <BodyRight>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {apartments.map((apartment, index) => (
              <div key={index}>
                <Marker
                  position={apartment.geoLocation}
                  onClick={() => setMarker(apartment.geoLocation)}
                >
                  {marker === apartment.geoLocation ? (
                    <InfoWindow onCloseClick={() => setMarker(null)}>
                      <InfoModal>
                        {apartment.title}
                        <StyledLink to={`/apartment/${apartment.id}`}>
                          查看房源
                        </StyledLink>
                      </InfoModal>
                    </InfoWindow>
                  ) : null}
                </Marker>
              </div>
            ))}
            {<Circle center={circleCenter} options={options} />}
          </GoogleMap>
        </BodyRight>
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <></>;
}

export default React.memo(MyMap);
