import React from "react";
import styled from "styled-components";
import { SearchWrapper, SearchInput, SearchButton } from "../common/Components";
import search from "../../images/search.svg";

const StyldSearchWrapper = styled(SearchWrapper)`
  width: 95%;
  margin: 0 auto;
`;

const NewButton = styled(SearchButton)`
  top: 5px;
  right: 18px;
`;

function SearchBox({
  apartments,
  setApartments,
  page,
  setPaging,
  allPages,
  calcAllPages,
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  function searchKeyWords(keyword) {
    if (!keyword.trim()) {
      setApartments(apartments);
    }
    const filteredData = apartments.filter((item) =>
      item.basic.title.includes(keyword)
    );
    setPaging(1);
    allPages.current = calcAllPages(filteredData);
    setApartments(filteredData);
  }
  return (
    <StyldSearchWrapper>
      <SearchInput
        placeholder="請輸入房源關鍵字"
        value={searchQuery}
        onChange={(e) => {
          page.current = 1;
          setSearchQuery(e.target.value);
          searchKeyWords(e.target.value);
        }}
      />
      <NewButton src={search} />
    </StyldSearchWrapper>
  );
}

export default SearchBox;
