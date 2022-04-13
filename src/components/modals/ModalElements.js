import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 50%;
  overflow-y: scroll;
  background: #fff;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 15px 20px 10px;
  border-bottom: 1px solid #dadada;
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

const Button = styled.button`
  align-self: end;
  margin: 20px 20px 40px 0;
`;

export { Overlay, Modal, Header, CloseButton, Title, Body, Button };
