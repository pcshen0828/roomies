import React from "react";
import styled from "styled-components";
import { FlexWrapper } from "../common/Components";

const Wrapper = styled.div``;

const SendDate = styled.div`
  font-size: 12px;
  color: #505d68;
  align-self: center;
  margin: 30px 0 20px;
`;

const SendTime = styled.div`
  font-size: 12px;
  color: #505d68;
  margin: 0 0 10px;
  position: absolute;
  right: 10px;
  bottom: 5px;
`;

const MessageSentByMe = styled.div`
  background: #c2d1d9;
  border-radius: 20px 20px 0px 20px;
  padding: 10px 70px 15px 20px;
  align-self: flex-end;
  display: flex;
  align-items: center;
  max-width: 40%;
  margin-bottom: 5px;
  position: relative;
`;

const MessageSentByOthers = styled.div`
  background: #f2f5f7;
  border-radius: 20px 20px 20px 0px;
  padding: 10px 70px 15px 20px;
  align-self: flex-start;
  display: flex;
  align-items: center;
  max-width: 40%;
  margin-bottom: 5px;
  position: relative;
`;

const MessageBar = ({ detail, myRole, generateReadableDate }) => {
  const scrollRef = React.useRef();

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail]);

  function generateReadableTime(time) {
    const startIndex =
      new Date(time.toDate()).toLocaleString().indexOf("午") - 1;
    return new Date(time.toDate()).toLocaleString().slice(startIndex, -3);
  }

  return detail.sender === myRole ? (
    <>
      <SendDate>{generateReadableDate(detail.timestamp)}</SendDate>
      <MessageSentByMe ref={scrollRef}>
        {detail.content}
        <SendTime>{generateReadableTime(detail.timestamp)}</SendTime>
      </MessageSentByMe>
    </>
  ) : (
    <>
      <SendDate>{generateReadableDate(detail.timestamp)}</SendDate>
      <MessageSentByOthers ref={scrollRef}>
        {detail.content}
        <SendTime>{generateReadableTime(detail.timestamp)}</SendTime>
      </MessageSentByOthers>
    </>
  );
};

export default MessageBar;
