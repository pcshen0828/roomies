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

  @media screen and (max-width: 1279.98px) {
    flex-direction: row;
    width: 100%;
  }
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
  @media screen and (max-width: 1279.98px) {
    margin-right: 20px;
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
  font-size: 16px;
  border: none;
  width: 120px;
  height: 40px;
  border-radius: 5px;
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
  justify-content: flex-end;
  align-self: end;
`;

const PagingItem = styled.div`
  width: 30px;
  height: 30px;
  border: 1px solid #dadada;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${(props) => (props.active ? "#dadada" : "")};
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
  flex-wrap: wrap;
`;

const ScheduleCard = styled(FlexWrapper)`
  width: 350px;
  height: 200px;
  border-radius: 10px;
  margin: 0 20px 20px 0;
  ${"" /* cursor: pointer; */}
  padding: 20px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
`;

const ScheduleInnerWrapper = styled(FlexWrapper)`
  ${"" /* align-items: flex-start; */}
  width: 100%;
`;

const ScheduleDate = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
`;

const ScheduleInfo = styled(FlexWrapper)`
  flex-direction: column;
  width: 60%;
  align-items: flex-start;
`;

const CardTop = styled(FlexWrapper)`
  flex-direction: column;
  height: 40%;
  border-bottom: 1px solid #dadada;
`;

const CardBottom = styled(FlexWrapper)`
  height: 60%;
  align-items: flex-start;
  flex-direction: column;
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
};
