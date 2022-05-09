import React from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerClusterer,
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
import Card from "../apartments/ApartmentCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  padding-left: 10px;
  width: calc(100% - 10px);

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
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
  overflow-y: scroll;
`;

function MyMap() {
  const [map, setMap] = React.useState(null);
  const [center, setCenter] = React.useState(defaultCenter);
  const [circleCenter, setCircleCenter] = React.useState(defaultCenter);
  const [zoom, setZoom] = React.useState(9);
  const [marker, setMarker] = React.useState(center);
  const [apartments, setApartments] = React.useState([]);
  const [allData, setAllData] = React.useState([]);
  const [searchBox, setSearchBox] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [locations, setLocations] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

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
    setZoom(16);
    setQuery("");
    setApartments(
      allData.filter(
        (item) =>
          item.geoLocation.lat === newCenter.lat &&
          // item.geoLocation.lat >= newCenter.lat - 0.1 &&
          item.geoLocation.lng === newCenter.lng
        // item.geoLocation.lng >= newCenter.lng - 0.1
      )
    );
  };

  React.useEffect(() => {
    let mounted = true;
    api.getDataWithSingleQuery("apartments", "status", "==", 1).then((res) => {
      if (!mounted) return;
      setAllData(res);
      setApartments(res);
      setLocations(res.map((item) => item.geoLocation));
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
            <MarkerClusterer
              maxZoom={20}
              zoomOnClick={true}
              onClusteringBegin={() => {
                console.log("start clustering");
              }}
              onClusteringEnd={() => {
                console.log("end clustering");
              }}
            >
              {(clusterer) => {
                return allData.map((apartment, index) => (
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
                    clusterer={clusterer}
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
                ));
              }}
            </MarkerClusterer>
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

export default React.memo(MyMap);
