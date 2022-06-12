import { memo, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  StandaloneSearchBox,
  Circle,
} from "@react-google-maps/api";
import api from "../../utils/api";

import styled from "styled-components";
import Skeleton from "react-loading-skeleton";

import { BodyLeft, BodyRight, FlexColumn, Input } from "../common/Components";
import Card from "../apartments/ApartmentCard";

const libraries = ["places"];

const defaultCenter = {
  lat: 25.0384803,
  lng: 121.5323711,
};

const options = {
  strokeColor: "#fff",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#424B5A",
  fillOpacity: 0.2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 450,
  zIndex: 1,
};

const containerStyle = {
  width: "100%",
  height: "700px",
  border: "1px solid #dadada",
};

const InfoModal = styled(FlexColumn)`
  width: 200px;
  height: 100px;
  border-radius: 10px;
  padding: 20px;
  font-size: 14px;
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

const SearchBox = styled(Input)`
  width: 100%;
  height: 30px;
  border: 1px solid #dadada;
  border-radius: 5px;
  padding-left: 10px;
  margin: 0;
  background-color: #fff;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 100%);
  justify-content: space-between;
  margin: 20px auto 0;

  @media screen and (max-width: 1279.98px) {
    display: none;
    grid-template-columns: repeat(auto-fill, calc((100% - 10px) / 2));
    height: 400px;
  }
  @media screen and (max-width: 700px) {
    grid-template-columns: repeat(auto-fill, 100%);
    height: 400px;
  }
  height: 648px;
  overflow-y: auto;
`;

function MyMap() {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [circleCenter, setCircleCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(11);
  const [marker, setMarker] = useState(center);
  const [apartments, setApartments] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchBox, setSearchBox] = useState(null);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "zh-TW",
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
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
    setCenter(newCenter);
    setCircleCenter(newCenter);
    setZoom(16);
    setQuery("");
    setApartments(
      allData.filter(
        (item) =>
          item.geoLocation.lat === newCenter.lat &&
          item.geoLocation.lng === newCenter.lng
      )
    );
  };

  useEffect(() => {
    let mounted = true;
    api
      .getDataWithSingleQuery("apartments", "status", "==", 1)
      .then((apartments) => {
        if (!mounted) return;
        setAllData(apartments);
        setApartments(apartments);
        setLoading(false);
      });
    return function cleanup() {
      mounted = false;
    };
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
              placeholder="請輸入地點"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </StandaloneSearchBox>
          <Cards>
            {loading
              ? Array.from(Array(3).keys()).map((loader, index) => (
                  <Skeleton
                    key={index}
                    height={350}
                    borderRadius={20}
                    style={{ marginBottom: "20px" }}
                  />
                ))
              : apartments.length
              ? apartments.map((item) => <Card key={item.id} detail={item} />)
              : ""}
          </Cards>
        </BodyLeft>
        <BodyRight>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {allData.map((apartment, index) => (
              <Marker
                key={apartment.id}
                position={apartment.geoLocation}
                onClick={(cluster) => {
                  setMarker(apartment.geoLocation);
                  setApartments(
                    allData.filter(
                      (item) => item.geoLocation === apartment.geoLocation
                    )
                  );
                }}
              >
                {marker === apartment.geoLocation ? (
                  <InfoWindow
                    onCloseClick={() => {
                      setMarker(null);
                      setApartments(allData);
                    }}
                  >
                    <InfoModal>
                      {apartment.title}
                      <StyledLink to={`/apartment/${apartment.id}`}>
                        查看房源
                      </StyledLink>
                    </InfoModal>
                  </InfoWindow>
                ) : null}
              </Marker>
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

  return isLoaded ? renderMap() : null;
}

export default memo(MyMap);
