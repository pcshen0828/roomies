import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FlexColumn } from "../common/Components";

const Wrapper = styled(FlexColumn)`
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  height: 350px;
  margin-bottom: 30px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  background: #fff;
  align-items: stretch;
  opacity: 0.9;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f2f5;
    opacity: 1;
  }
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
  height: 100%;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const CardContent = styled(FlexColumn)`
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
      <StyledLink to={`/apartment/${detail.id}`}>
        <CoverImage src={detail.coverImage} />
        <CardContent>
          <Title>{detail.title}</Title>
          <>
            {detail.rooms}房｜室友 {detail.roomiesCount} 人
          </>
          <Price>{detail.monthlyRent.toLocaleString(2)} 元/月</Price>
        </CardContent>
      </StyledLink>
    </Wrapper>
  );
}

Card.propTypes = {
  detail: PropTypes.object,
};

export default Card;
