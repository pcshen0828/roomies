import styled, { keyframes } from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { subColor, mainColor } from "../../styles/GlobalStyle";

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

const BannerTitle = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;

  @media screen and (max-width: 1279.98px) {
    font-size: 24px;
  }

  @media screen and (max-width: 575.98px) {
    font-size: 20px;
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

const TitleSub = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;

  @media screen and (max-width: 1279.98px) {
    font-size: 18px;
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

const FlexWrap = styled(FlexWrapper)`
  flex-wrap: wrap;
`;

const FlexColumn = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
`;

const Input = styled.input`
  width: 90%;
  height: 38px;
  border: 1px solid #dadada;
  margin-bottom: 20px;
  padding-left: 10px;
  color: ${mainColor};
  flex-shrink: 0;
  background: #fff;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border: 1px solid ${subColor};
  }
`;

const Select = styled.select`
  width: 90%;
  height: 38px;
  border: 1px solid #dadada;
  margin-bottom: 20px;
  padding-left: 10px;
  color: ${mainColor};
  flex-shrink: 0;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border: 1px solid ${subColor};
  }
`;

const Textarea = styled.textarea`
  width: calc(90% - 20px);
  height: 120px;
  border: 1px solid #dadada;
  margin-bottom: 20px;
  padding: 10px;
  color: ${mainColor};
  background: #fff;
  flex-shrink: 0;
  font-family: "Noto Sans TC", sans-serif;
  resize: none;
  &:focus {
    outline: none;
    border: 1px solid ${subColor};
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
  color: ${mainColor};
  display: block;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid ${mainColor};
  }
`;

const StyledNavLink = styled(NavLink)`
  color: ${mainColor};
  display: block;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid ${mainColor};
  }
`;

const fadeIn = keyframes`
  0%   { 
    opacity: 0; 
    visibility: hidden;
  }
  100% { 
    opacity: 1; 
    visibility: visible;
  }
`;

const ProfileList = styled(FlexColumn)`
  width: calc(20%);
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
    animation: ${fadeIn} 0.8s ease;
    display: ${(props) => (props.show ? "flex" : "none")};
  }
`;

const Toggler = styled.div`
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;
  display: none;
  @media screen and (max-width: 767.98px) {
    display: block;
  }
`;

const Toggle = styled.img`
  width: 12px;
  height: 12px;
  margin-left: 10px;
  animation: ${fadeIn} 0.8s ease;
`;

const ProfileItem = styled.div`
  font-size: 14px;
  padding: 20px;
  cursor: pointer;
  width: calc(100% - 45px);
  border-left: ${(props) =>
    props.active ? `5px solid ${subColor}` : "5px solid transparent"};
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
      props.active ? `5px solid ${subColor}` : "5px solid transparent"};
  }
  @media screen and (max-width: 767.98px) {
    padding: 10px;
    width: calc(100% - 20px);
    justify-content: flex-start;
    border-bottom: ${(props) =>
      props.active ? `2px solid ${subColor}` : "2px solid transparent"};
    background: none;
  }
`;

const ProfileContent = styled.div`
  width: calc(78% - 40px);
  min-height: 680px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  overflow: hidden;

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
  color: ${mainColor};
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
  color: ${mainColor};
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
  top: 5px;
  right: 18px;
`;

const Button1 = styled.button`
  cursor: pointer;
  font-size: 16px;
  border: none;
  background: ${mainColor};
  width: 120px;
  height: 40px;
  color: #fff;
  border-radius: 5px;

  &:hover {
    background: ${subColor};
  }
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

const SlicedLink = styled(Link)`
  font-weight: 700;
  color: ${mainColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    text-decoration: underline;
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
  width: 360px;
  height: 220px;
  border-radius: 10px;
  margin: 0 20px 20px 0;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  align-items: flex-end;
  overflow: hidden;

  @media screen and (max-width: 767.98px) {
    width: 300px;
    height: 250px;
    margin: 0 0 20px;
  }
  @media screen and (max-width: 414px) {
    width: 200px;
    height: 200px;
  }
`;

const ScheduleInnerWrapper = styled(FlexWrapper)`
  width: 100%;
  padding: 10px 20px;
  height: ${(props) => (props.landlord ? "100%" : "50%")};
  background: rgba(255, 255, 255, 0.9);
  flex-direction: column;
  justify-content: center;
  transition: height 0.8s ease-out;
  &:hover {
    height: 100%;
  }
`;

const ScheduleDate = styled(FlexWrapper)`
  width: 100%;
  align-items: center;
`;

const DateTitle = styled(Bold)`
  margin: 0;
  @media screen and (max-width: 767.98px) {
    margin: 0 10px 0 0;
  }
  @media screen and (max-width: 414px) {
    font-size: 14px;
  }
`;

const TimeTitle = styled(Bold)`
  @media screen and (max-width: 414px) {
    font-size: 14px;
  }
`;

const ScheduleInfo = styled(FlexWrapper)`
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  @media screen and (max-width: 414px) {
    font-size: 14px;
  }
`;

const CardTop = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 40%;
  width: 100%;
  border-bottom: 1px solid #dadada;
  @media screen and (max-width: 767.98px) {
    margin: 10px 0;
  }
  @media screen and (max-width: 414px) {
    margin: 10px 0 0;
  }
`;

const ScheduleTitle = styled(SlicedBold)`
  max-width: 300px;
  @media screen and (max-width: 767.98px) {
    max-width: 90%;
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

const ErrorMessage = styled.div`
  color: #ed3636;
  font-size: 14px;
  height: 20px;
`;

const ExitButton = styled(FlexWrapper)`
  background: none;
  color: ${mainColor};
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;

  &:hover {
    background: #e8e8e8;
  }
  @media screen and (max-width: 767.98px) {
    font-size: 14px;
  }
`;

const RejectButton = styled(FlexWrapper)`
  background: none;
  color: ${mainColor};
  width: 70px;
  height: 40px;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background: #e8e8e8;
  margin-left: 10px;

  &:hover {
    background: #dadada;
  }
  @media screen and (max-width: 767.98px) {
    font-size: 14px;
  }
`;

const ConfirmButton = styled(Button1)`
  width: 90px;
  height: 40px;
  position: relative;
  @media screen and (max-width: 767.98px) {
    font-size: 14px;
  }
`;

const Status = styled(FlexWrapper)`
  align-items: center;
  justify-content: center;
  background: #f2f5f7;
  padding: 5px 10px;
  border-radius: 5px;
  margin-left: 10px;
  font-size: 14px;
`;

const ProfileImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const BackgroundImage = styled.div`
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const BodyInnerWrapper = styled(FlexWrapper)`
  position: relative;
  align-items: flex-start;
  width: 100%;
  height: calc(100% - 75px);
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
  }
`;

const StepsWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: calc(30% - 20px);
  height: 100%;
  align-items: flex-start;
  padding: 20px 0 0 20px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-right: 1px solid #e8e8e8;
  @media screen and (max-width: 767.98px) {
    width: calc(100% - 20px);
    flex-direction: row;
    height: 50px;
    box-shadow: none;
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;
    align-items: center;
  }
`;

const StepIndicator = styled(FlexWrapper)`
  width: 50px;
  height: 50px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0px 2px 30px rgba(193, 177, 138, 0.1);
  background: ${(props) => (props.active ? mainColor : "none")};
  color: ${(props) => (props.active ? "#fff" : mainColor)};
  cursor: pointer;

  @media screen and (max-width: 767.98px) {
    width: 25px;
    height: 25px;
    margin: 0 10px 0 0;
    font-size: 14px;
  }
  @media screen and (max-width: 600px) {
    width: 30px;
    height: 30px;
  }
`;

const StepWrapper = styled(FlexWrapper)`
  justify-content: center;
  align-items: center;
  margin: 0 20px 20px 0;
  @media screen and (max-width: 767.98px) {
    margin: 0 20px 10px 0;
  }
  @media screen and (max-width: 600px) {
    margin-right: 10px;
  }
`;

const StepName = styled(SmallTitle)`
  margin: 0;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const BottomWrapper = styled(FlexWrapper)`
  justify-content: space-between;
  position: absolute;
  right: 0;
  bottom: 30px;
  width: calc(70% - 40px);
  padding: 0 20px;
  @media screen and (max-width: 767.98px) {
    width: calc(100% - 40px);
    bottom: 10px;
  }
`;

const ButtonWrapper = styled(FlexWrapper)`
  align-items: center;
`;

const HiddenInput = styled.input`
  display: none;
`;

const SkeletonWrapper = styled.div`
  width: 100%;
`;

const SkeletonWrapperGrid = styled.div`
  width: 100%;
  display: grid;
`;

const SkeletonWrapperFlex = styled(FlexWrapper)`
  width: 100%;
  justify-content: space-between;
`;

const SkeletonWrapperWidth = styled.div`
  width: ${(props) => props.width && props.width};
`;

export {
  Wrapper,
  BannerTitle,
  Title,
  TitleSub,
  MediumTitle,
  SubTitle,
  Bold,
  BodyWrapper,
  BodyLeft,
  BodyRight,
  FlexWrapper,
  FlexWrap,
  FlexColumn,
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
  Toggler,
  Toggle,
  PagingItem,
  SearchWrapper,
  SearchInput,
  SearchButton,
  Button1,
  ScheduleDate,
  DateTitle,
  TimeTitle,
  ScheduleInnerWrapper,
  ScheduleInfo,
  ScheduleTitle,
  CardWrapper,
  ScheduleCard,
  CardTop,
  CardBottom,
  Required,
  ErrorMessage,
  SlicedTitle,
  SlicedBold,
  SlicedLink,
  RejectButton,
  ExitButton,
  ConfirmButton,
  Status,
  ProfileImage,
  BackgroundImage,
  BodyInnerWrapper,
  StepsWrapper,
  StepIndicator,
  StepWrapper,
  StepName,
  BottomWrapper,
  ButtonWrapper,
  HiddenInput,
  SkeletonWrapper,
  SkeletonWrapperGrid,
  SkeletonWrapperFlex,
  SkeletonWrapperWidth,
};
