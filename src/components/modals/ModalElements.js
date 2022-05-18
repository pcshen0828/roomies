import styled, { keyframes } from "styled-components";
import { Button1, FlexColumn, FlexWrapper } from "../common/Components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const Overlay = styled(FlexWrapper)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  justify-content: center;

  visibility: ${(props) => (props.out ? "hidden" : "visible")};
  animation: ${(props) => (props.out ? fadeOut : fadeIn)} 0.3s ease-out;
  transition: visibility 0.3s ease-out;
`;

const Modal = styled(FlexColumn)`
  width: 70%;
  max-height: 90%;
  overflow-y: auto;
  background: #fff;
  border-radius: 10px;
  position: relative;
`;

const Header = styled(FlexWrapper)`
  padding: 15px 20px 10px;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  justify-content: space-between;
`;

const CloseButton = styled(FlexWrapper)`
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  width: 30px;
  height: 30px;
  justify-content: center;
  border-radius: 50%;
  align-self: end;
  &:hover {
    background: #e8e8e8;
  }
`;

const Title = styled.div`
  font-weight: 700;
`;

const Body = styled.div`
  width: calc(100% - 40px);
  border: 1px solid #dadada;
  height: 250px;
  overflow-y: auto;
  margin: 20px auto;
`;

const Button = styled(Button1)`
  align-self: end;
  margin: 20px 20px 40px 0;
  flex-shrink: 0;
`;

const NavModalOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  visibility: ${(props) => (props.out ? "hidden" : "visible")};
  animation: ${(props) => (props.out ? fadeOut : fadeIn)} 0.3s ease-out;
  transition: visibility 0.3s ease-out;
`;

const NavModal = styled(FlexColumn)`
  width: 350px;
  max-height: 300px;
  position: absolute;
  top: 80px;
  right: 0px;
  background: #ffffff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-radius: 0 0 10px 10px;
  padding: 20px;

  @media screen and (min-width: 1440px) {
    left: calc((100% - 1200px) / 2 + 850px);
  }
  @media screen and (max-width: 400px) {
    width: 300px;
  }
`;

export {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Title,
  Body,
  Button,
  NavModalOverlay,
  NavModal,
};
