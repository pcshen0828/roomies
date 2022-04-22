import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import heart from "../../images/heart.svg";
import heartFill from "../../images/heartFill.svg";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { Firebase } from "../../utils/firebase";

const Wrapper = styled.div`
  border: 1px solid #e8e8e8;
  height: 350px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
  height: 100%;
`;

const Heart = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
  height: 35px;
  cursor: pointer;
`;

const HeartFill = styled.img`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 10px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
`;

const Price = styled.div`
  font-weight: 700;
  font-size: 18px;
  align-self: flex-end;
`;

function Card({ detail }) {
  const auth = Firebase.getAuth();
  const { currentUser } = useAuth();
  const [user, loading, error] = useAuthState(auth);
  const [isCollected, setIsCollected] = React.useState(false);

  React.useEffect(() => {
    setIsCollected(
      currentUser && currentUser.collectionList.includes(detail.id)
    );
  }, [currentUser]);

  function RenderHeart() {
    // 收藏房源愛心：判斷是否登入為會員(房客?)
    if (loading) {
      return null;
    }
    if (user) {
      return isCollected ? (
        <HeartFill src={heartFill} onClick={() => cancelCollect(detail.id)} />
      ) : (
        <Heart src={heart} onClick={() => collectApartment(detail.id)} />
      );
    }
    if (error) {
      return null;
    }
  }

  function collectApartment(id) {
    console.log(id);
    api.updateDocData("users", currentUser.uid, {
      collectionList: [...currentUser.collectionList, id],
    });
  }

  function cancelCollect(id) {
    console.log(id);
    api.updateDocData("users", currentUser.uid, {
      collectionList: currentUser.collectionList.filter((item) => item !== id),
    });
  }

  return (
    <Wrapper>
      {RenderHeart()}
      <StyledLink to={`/apartment/${detail.id}`}>
        <CoverImage src={detail.coverImage} />
        <CardContent>
          <Title>{detail.title}</Title>
          <>
            {detail.rooms}房｜室友 {detail.rooms} 人
          </>
          <Price>{detail.monthlyRent.toLocaleString(2)} 元/月</Price>
        </CardContent>
      </StyledLink>
    </Wrapper>
  );
}

export default Card;
