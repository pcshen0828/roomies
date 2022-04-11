import React from "react";
import styled from "styled-components";

const MessageContent = styled.div`
  width: 70%;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const SendMessageBlock = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  left: 20px;
  bottom: 20px;
`;

const MessageInput = styled.input`
  width: calc(100% - 40px);
  height: 45px;
  border: 1px solid transparent;
  background: #f2f2f2;
  border-radius: 20px;
  padding-left: 20px;

  &:focus {
    outline: none;
    border: 1px solid #e8e8e8;
  }
`;

const SendMessageButton = styled.img`
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  position: absolute;
  right: 30px;
  cursor: pointer;
`;

const MessageSentByMe = styled.div`
  background: #c2d1d9;
  border-radius: 20px 20px 0px 20px;
  padding: 10px 20px;
  align-self: flex-end;
  display: flex;
  align-items: center;
  max-width: 40%;
`;

const MessageSentByOthers = styled.div`
  background: #f2f5f7;
  border-radius: 20px 20px 20px 0px;
  padding: 10px 20px;
  align-self: flex-start;
  display: flex;
  align-items: center;
  max-width: 40%;
`;

function Detail({ chats, uid, chatId, setChatId }) {
  return (
    <MessageContent>
      {chatId
        ? chats
            .filter((chat) => chat.id === chatId)[0]
            .messages.map((detail, index) => (
              <React.Fragment key={index}>
                {detail.sender === uid ? (
                  <MessageSentByMe>{detail.content}</MessageSentByMe>
                ) : (
                  <MessageSentByOthers>{detail.content}</MessageSentByOthers>
                )}
                <SendMessageBlock>
                  <MessageInput placeholder="Aa" />
                  <SendMessageButton />
                </SendMessageBlock>
              </React.Fragment>
            ))
        : ""}
    </MessageContent>
  );
}

export default Detail;
