import styled from "styled-components";

const Wrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1280px) {
    margin: 30px auto;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const SubTitle = styled.div`
  font-size: 14px;
  color: #505d68;
`;

const BodyWrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 1280px) {
    flex-direction: column;
  }
`;

const BodyLeft = styled.div`
  width: 35%;
  border: 1px solid blue;
  @media screen and (max-width: 1280px) {
    margin-bottom: 20px;
    width: 100%;
  }
`;

const BodyRight = styled.div`
  width: 63%;
  border: 1px solid red;
  @media screen and (max-width: 1280px) {
    width: 100%;
  }
`;

export { Wrapper, Title, SubTitle, BodyWrapper, BodyLeft, BodyRight };
