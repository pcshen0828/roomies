import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { googleMapsAppKey } from "../../appkeys";
import styled from "styled-components";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "500px",
  border: "1px solid #dadada",
};

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dadada;
`;

function ApartmentMap({ geoLocation }) {
  const [map, setMap] = React.useState(null);

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

  const renderMap = () => {
    return (
      <Wrapper>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={geoLocation}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={geoLocation}></Marker>
        </GoogleMap>
      </Wrapper>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <></>;
}

export default React.memo(ApartmentMap);
