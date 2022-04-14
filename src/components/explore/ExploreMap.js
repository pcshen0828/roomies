import React from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { googleMapsAppKey } from "../../appkeys";

const containerStyle = {
  width: "100%",
  height: "700px",
};

const center = {
  lat: 25.0384803,
  lng: 121.5301824,
};

const position = { lat: 25.0384803, lng: 121.5301824 };

const positions = [
  {
    lat: 25.0384803,
    lng: 121.5301824,
  },
  { lat: 25.1023664, lng: 121.5212715 },
];

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};

const onLoad = (marker) => {
  console.log("marker: ", marker);
};

function ExploreMap() {
  const [marker, setMarker] = React.useState(null);
  // when marker was clicked, show its info window
  // when info window on close click, close itself
  return (
    <LoadScript googleMapsApiKey={googleMapsAppKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
        {/* Child components, such as markers, info windows, etc. */}
        {positions.map((position, index) => (
          <>
            <Marker
              key={`marker${position.lat + position.lng}`}
              onLoad={onLoad}
              position={position}
              onClick={() => setMarker(position)}
            >
              {marker === position ? (
                <InfoWindow onCloseClick={() => setMarker(null)}>
                  <div>
                    {position.lat}| {position.lng}
                  </div>
                </InfoWindow>
              ) : null}
            </Marker>
          </>
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(ExploreMap);
