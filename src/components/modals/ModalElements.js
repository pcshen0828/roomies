import styled, { keyframes } from "styled-components";
import { Button1 } from "../common/Components";

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

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;

  visibility: ${(props) => (props.out ? "hidden" : "visible")};
  animation: ${(props) => (props.out ? fadeOut : fadeIn)} 0.3s ease-out;
  transition: visibility 0.3s ease-out;
`;

const Modal = styled.div`
  width: 70%;
  overflow-y: scroll;
  background: #fff;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 15px 20px 10px;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
`;

const CloseButton = styled.div`
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: 700;
`;

const Body = styled.div`
  width: calc(100% - 40px);
  border: 1px solid #dadada;
  height: 250px;
  overflow-y: scroll;
  margin: 20px auto;
`;

const Button = styled(Button1)`
  align-self: end;
  margin: 20px 20px 40px 0;
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

const NavModal = styled.div`
  width: 350px;
  max-height: 300px;
  position: absolute;
  top: 80px;
  right: 0px;
  background: #ffffff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
