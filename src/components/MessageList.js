import React from "react";
import styled from "styled-components";

const MessageList = styled.div`
  width: 30%;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MessageItem = styled.div`
  border-radius: 10px;
  height: 80px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #f2f5f7;
  }
`;

const MessageImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid #000;
  margin-right: 10px;
`;

const MessageOverview = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageObjectName = styled.div`
  font-weight: 700;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: #505d68;
`;

function List({ chats, uid, chatId, setChatId }) {
  function calcTimeGap(time) {
    const ObjectTime = Date.parse(new Date(time));
    const now = Date.parse(new Date());
    const milleSecondsPerDay = 24 * 3600 * 1000;
    const gapMilleSeconds = now - ObjectTime;
    const days = gapMilleSeconds / milleSecondsPerDay;
    return Math.floor(days) > 365
      ? `${Math.floor(days / 365)}年`
      : Math.floor(days) > 30
      ? `${Math.floor(days / 30)}個月`
      : Math.floor(days) > 7
      ? `${Math.floor(days / 7)}週`
      : Math.floor(days) >= 1
      ? `${Math.floor(days)}天`
      : Math.floor(days * 24) >= 1
      ? `${Math.floor(days * 24)}小時`
      : Math.floor(days * 24 * 60) >= 1
      ? `${Math.floor(days * 24 * 60)}分鐘`
      : "現在";
  }
  return (
    <MessageList>
      {chats.map((chat, index) => (
        <MessageItem key={index} onClick={() => setChatId(chat.id)}>
          <MessageImg
            src={
              chat.members.filter((member) => member.uid !== uid)[0]
                .profileImageUrl
            }
          />
          <MessageOverview>
            <MessageObjectName>
              {chat.members.filter((member) => member.uid !== uid)[0].name}
            </MessageObjectName>
            <LastMessage>
              {`${chat.messages.at(-1).content.slice(0, 10)}`}
              <span> · {calcTimeGap(chat.updateTime.toDate())}</span>
            </LastMessage>
          </MessageOverview>
        </MessageItem>
      ))}
    </MessageList>
  );
}

export default List;
