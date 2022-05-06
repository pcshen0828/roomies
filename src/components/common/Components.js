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

  @media screen and (max-width: 1279.98px) {
    font-size: 20px;
  }
`;

const MediumTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const SubTitle = styled.div`
  font-size: 14px;
  color: #505d68;
`;

const Bold = styled.div`
  font-weight: 700;
`;

const BodyWrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  align-items: flex-start;
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
  background: #fff;

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
  background: #fff;
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
  width: calc(20%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  overflow: hidden;

  @media screen and (max-width: 1279.98px) {
    flex-direction: row;
    width: 100%;
    margin-bottom: 20px;
  }
  @media screen and (max-width: 767.98px) {
    flex-wrap: wrap;
  }
`;

const ProfileItem = styled.div`
  font-size: 14px;
  padding: 20px;
  cursor: pointer;
  width: calc(100% - 45px);
  border-left: ${(props) =>
    props.active ? "5px solid #c1b18a" : "5px solid transparent"};
  background: ${(props) => (props.active ? "#f2f5f7" : "none")};
  font-weight: ${(props) => (props.active ? "700" : "400")};

  &:hover {
    background: #f2f5f7;
  }
  @media screen and (max-width: 1279.98px) {
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: none;
    border-bottom: ${(props) =>
      props.active ? "5px solid #c1b18a" : "5px solid transparent"};
  }
  @media screen and (max-width: 767.98px) {
    padding: 10px;
    width: calc(100% - 20px);
  }
`;

const ProfileContent = styled.div`
  width: calc(78% - 40px);
  min-height: 500px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;

  @media screen and (max-width: 1279.98px) {
    width: calc(100% - 40px);
  }
`;

const Error = styled.div`
  font-size: 14px;
  color: #ed3636;
  margin-top: 10px;
`;

const LoadingButton = styled.button`
  font-size: 16px;
  border: none;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  align-self: end;
  margin: 0 20px 0;
  cursor: not-allowed;
  background: #dadada;
  color: #424b5a;
`;

const PrevStepButton = styled.button`
  font-size: 16px;
  border: none;
  width: 100px;
  height: 40px;
  border-radius: 5px;
  align-self: end;
  margin: 0 20px 0 0;
  cursor: pointer;
  background: #e8e8e8;
  color: #424b5a;
  &:hover {
    background: #dadada;
  }
`;

const PagingList = styled(FlexWrapper)`
  justify-content: flex-end;
  align-self: end;
  min-height: 40px;
`;

const PagingItem = styled.div`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${(props) => (props.active ? "#f2f5f7" : "")};
  &:hover {
    background: #f2f5f7;
  }
`;

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
  background-color: #fff;
`;

const SearchButton = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 5px;
  top: 8px;
`;

const Button1 = styled.button`
  cursor: pointer;
  font-size: 16px;
  border: none;
  background: #424b5a;
  width: 120px;
  height: 40px;
  color: #fff;
  border-radius: 5px;

  &:hover {
    background: #c1b18a;
  }
`;

const CardWrapper = styled(FlexWrapper)`
  width: 100%;
  flex-wrap: wrap;
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ScheduleCard = styled(FlexWrapper)`
  width: 350px;
  height: 180px;
  border-radius: 10px;
  margin: 0 20px 20px 0;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  @media screen and (max-width: 767.98px) {
    width: 200px;
    height: 250px;
    margin: 0 0 20px;
    padding: 10px 10px 10px 20px;
  }
`;

const ScheduleInnerWrapper = styled(FlexWrapper)`
  width: 100%;
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
  }
`;

const ScheduleDate = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
  @media screen and (max-width: 767.98px) {
    flex-direction: row;
    width: 100%;
  }
`;

const ScheduleInfo = styled(FlexWrapper)`
  flex-direction: column;
  width: 60%;
  align-items: flex-start;
  @media screen and (max-width: 767.98px) {
    width: 100%;
  }
`;

const CardTop = styled(FlexWrapper)`
  flex-direction: column;
  height: 40%;
  border-bottom: 1px solid #dadada;
  @media screen and (max-width: 767.98px) {
    margin: 10px 0;
  }
`;

const CardBottom = styled(FlexWrapper)`
  height: 60%;
  align-items: flex-start;
  flex-direction: column;
`;

const Required = styled.span`
  color: #ed3636;
`;

const SlicedTitle = styled(Title)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SlicedBold = styled(Bold)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export {
  Wrapper,
  Title,
  MediumTitle,
  SubTitle,
  Bold,
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
  PrevStepButton,
  LoadingButton,
  PagingList,
  PagingItem,
  SearchWrapper,
  SearchInput,
  SearchButton,
  Button1,
  ScheduleDate,
  ScheduleInnerWrapper,
  ScheduleInfo,
  CardWrapper,
  ScheduleCard,
  CardTop,
  CardBottom,
  Required,
  SlicedTitle,
  SlicedBold,
};
