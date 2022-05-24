import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { SearchWrapper, SearchInput, SearchButton } from "../common/Components";
import search from "../../images/search.svg";

const StyldSearchWrapper = styled(SearchWrapper)`
  width: 95%;
  margin: 0 auto;
`;

const NewButton = styled(SearchButton)``;

function SearchBox({ dispatch, searchQuery, setSearchQuery }) {
  function searchKeyWords(keyword) {
    if (!keyword.trim()) {
      dispatch({ type: "reset" });
    }
    dispatch({ type: "search", payload: keyword });
  }
  return (
    <StyldSearchWrapper>
      <SearchInput
        placeholder="請輸入房源關鍵字"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          searchKeyWords(e.target.value);
        }}
      />
      <NewButton src={search} />
    </StyldSearchWrapper>
  );
}

SearchBox.propTypes = {
  dispatch: PropTypes.func,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default SearchBox;
