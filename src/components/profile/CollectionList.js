import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold } from "../common/Components";
import Card from "../apartments/ApartmentCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

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
  const [collectionList, setCollectionList] = React.useState([]);

  React.useEffect(() => {
    console.log(currentUser.collectionList);
    if (!currentUser.collectionList.length) {
      setCollectionList([]);
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
        console.log(res);
        setCollectionList(res);
      });
  }, [currentUser]);

  return (
    <Wrapper>
      <Bold>我的收藏</Bold>
      <CollectionWrapper>
        {collectionList.length
          ? collectionList.map((item, index) => (
              <Card key={item.id} detail={item} collected />
            ))
          : ""}
      </CollectionWrapper>
    </Wrapper>
  );
}

export default CollectionList;
