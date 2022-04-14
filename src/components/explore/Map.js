import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { googleMapsAppKey } from "../../appkeys";
import styled from "styled-components";
import { Link } from "react-router-dom";

///////////////////////////////////////////

const lib = ["places"];

const containerStyle = {
  width: "100%",
  height: "700px",
};

const center = {
  lat: 25.0384803,
  lng: 121.5301824,
};

const places = [
  { name: "AppWorks School", location: { lat: 25.0384803, lng: 121.5301824 } },
  {
    name: "捷運芝山站二樓採光窗景公寓",
    location: { lat: 25.1023664, lng: 121.5212715 },
  },
];

///////////////////////////////////////////

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

///////////////////////////////////////////

function MyComponent() {
  const [map, setMap] = React.useState(null);
  const [marker, setMarker] = React.useState(center);
  const [apartment, setApartment] = React.useState({ id: "test", name: "" });

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsAppKey,
  });

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const renderMap = () => {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        libraries={lib}
        center={center}
        zoom={17}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {places.map((place, index) => (
          <div key={place.location.lat + place.location.lng}>
            <Marker
              position={place.location}
              onClick={() => setMarker(place.location)}
            >
              {marker === place.location ? (
                <InfoWindow onCloseClick={() => setMarker(null)}>
                  <InfoModal>
                    {place.name}
                    <StyledLink to={`/apartment/${apartment.id}`}>
                      查看房源
                    </StyledLink>
                  </InfoModal>
                </InfoWindow>
              ) : null}
            </Marker>
          </div>
        ))}
      </GoogleMap>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <></>;
}

export default React.memo(MyComponent);
