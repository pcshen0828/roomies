import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import { FlexWrapper, Bold } from "../common/Components";
import Card from "../apartments/ApartmentCard";
import Skeleton from "react-loading-skeleton";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const CollectionWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 260px);
  justify-content: space-between;
  margin: 20px auto;

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fill, calc((100% - 10px) / 2));
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 100%);
    margin-bottom: 20px;
  }
`;

function CollectionList() {
  const { currentUser } = useAuth();
  const [collectionList, setCollectionList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser.collectionList.length) {
      setCollectionList([]);
      setLoading(false);
      return;
    }
    api
      .getDataWithSingleQuery(
        "apartments",
        "id",
        "in",
        currentUser.collectionList
      )
      .then((res) => {
        setCollectionList(res);
        setLoading(false);
      });
  }, [currentUser]);

  return (
    <Wrapper>
      <Bold>我的收藏</Bold>
      <CollectionWrapper>
        {loading
          ? Array.from(Array(3).keys()).map((loader, index) => (
              <Skeleton key={index} height={350} borderRadius={20} />
            ))
          : collectionList.length
          ? collectionList.map((item, index) => (
              <Card key={item.id} detail={item} collected />
            ))
          : ""}
      </CollectionWrapper>
    </Wrapper>
  );
}

export default CollectionList;
