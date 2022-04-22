import React from "react";
import styled from "styled-components";
import {
  FlexWrapper,
  Input,
  SearchWrapper,
  SearchInput,
  SearchButton,
} from "../common/Components";
import search from "../../images/search.svg";

function SearchBox({ apartments, setApartments, setPaging }) {
  const [searchQuery, setSearchQuery] = React.useState("");

  function searchKeyWords(keyword) {
    setApartments(
      apartments.filter((item) => item.basic.title.includes(keyword))
    );
  }
  return (
    <SearchWrapper>
      <SearchInput
        placeholder="請輸入房源關鍵字"
        value={searchQuery}
        onChange={(e) => {
          setPaging(1);
          setSearchQuery(e.target.value);
          searchKeyWords(e.target.value);
        }}
      />
      <SearchButton src={search} />
    </SearchWrapper>
  );
}

export default SearchBox;
