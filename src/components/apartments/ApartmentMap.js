import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { googleMapsAppKey } from "../../appkeys";

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
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: googleMapsAppKey,
    libraries,
    language: "zh-TW",
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
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

export default memo(ApartmentMap);
