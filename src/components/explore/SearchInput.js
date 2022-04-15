import Autocomplete from "react-google-autocomplete";
import { googleMapsAppKey } from "../../appkeys";
import styled from "styled-components";

const StyledAutocomplete = styled(Autocomplete)`
  width: 90%;
  height: 30px;
  border: 1px solid #dadada;
  padding: 0 0 0 10px;

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

function SearchBox() {
  return (
    <StyledAutocomplete
      apiKey={googleMapsAppKey}
      onPlaceSelected={(place) => {
        console.log(place);
      }}
    />
  );
}

export default SearchBox;
