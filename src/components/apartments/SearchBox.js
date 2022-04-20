import React from "react";
import styled from "styled-components";
import { FlexWrapper, Input } from "../common/Components";
import search from "../../images/search.svg";

const SearchWrapper = styled(FlexWrapper)`
  padding: 0;
  position: relative;
  width: 100%;
`;

const SearchInput = styled(Input)`
  width: calc(100% - 10px);
  height: 30px;
  border: 1px solid #dadada;
  border-radius: 5px;
  padding-left: 10px;
  margin: 0;
`;

const Image = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 5px;
  top: 8px;
`;

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
      <Image src={search} />
    </SearchWrapper>
  );
}

export default SearchBox;
