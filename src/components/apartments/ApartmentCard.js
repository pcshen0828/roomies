import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import heart from "../../images/heart.svg";

const Wrapper = styled.div`
  border: 1px solid #e8e8e8;
  height: 400px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
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
  return (
    <Wrapper>
      <Heart src={heart} />
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
