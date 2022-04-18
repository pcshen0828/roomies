import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";

const Wrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1279.98px) {
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

  @media screen and (max-width: 1279.98px) {
    flex-direction: column;
  }
`;

const BodyLeft = styled.div`
  width: 35%;
  @media screen and (max-width: 1279.98px) {
    margin-bottom: 20px;
    width: 100%;
  }
`;

const BodyRight = styled.div`
  width: 63%;
  @media screen and (max-width: 1279.98px) {
    width: 100%;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 90%;
  height: 30px;
  border: 1px solid #dadada;
  margin-bottom: 20px;
  padding-left: 10px;
  color: #424b5a;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

const Select = styled.select`
  width: 90%;
  height: 30px;
  border: 1px solid #dadada;
  margin-bottom: 20px;
  padding-left: 10px;
  color: #424b5a;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

const Textarea = styled.textarea`
  width: 90%;
  height: 120px;
  border: 1px solid #dadada;
  margin-bottom: 20px;
  padding: 10px;
  color: #424b5a;
  flex-shrink: 0;
  font-family: "Noto Sans TC", sans-serif;

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

const SmallTitle = styled(Title)`
  font-size: 14px;
  margin-bottom: 10px;
`;

const SmallLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
  display: block;
`;

const SmallText = styled.div`
  font-size: 14px;
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid #424b5a;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: #424b5a;
  display: block;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid #424b5a;
  }
`;

const ProfileList = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProfileItem = styled.div`
  font-size: 14px;
  padding: 10px 0 5px;
  margin-bottom: 10px;
  cursor: pointer;
  border-bottom: ${(props) =>
    props.active ? "1px solid #c1b18a" : "1px solid transparent"};
  &:hover {
    border-bottom: 1px solid #c1b18a;
  }
`;

const ProfileContent = styled.div`
  width: 78%;
  @media screen and (max-width: 1279.98px) {
    width: 100%;
  }
`;

const Error = styled.div`
  font-size: 14px;
  color: #ed3636;
  margin-top: 10px;
`;

const LoadingButton = styled.button`
  align-self: end;
  margin: 20px;
  cursor: not-allowed;
  background: #dadada;
  color: #424b5a;
  &:hover {
    background: #dadada;
  }
`;

const PagingList = styled(FlexWrapper)`
  margin: 20px 14px 0 0;
  justify-content: flex-end;
`;

const PagingItem = styled.div`
  width: 30px;
  height: 30px;
  border: 1px solid #dadada;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.active ? "#dadada" : "")};
`;

export {
  Wrapper,
  Title,
  SubTitle,
  BodyWrapper,
  BodyLeft,
  BodyRight,
  FlexWrapper,
  Input,
  Select,
  Textarea,
  SmallTitle,
  SmallLabel,
  SmallText,
  StyledLink,
  StyledNavLink,
  ProfileList,
  ProfileItem,
  ProfileContent,
  Error,
  LoadingButton,
  PagingList,
  PagingItem,
};
