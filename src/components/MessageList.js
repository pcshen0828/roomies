import { Firestore } from "firebase/firestore";
import React, { Fragment } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";

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
  background: ${(props) => (props.active ? "#f2f5f7" : "fff")};

  &:hover {
    background: #f2f5f7;
  }
`;

const MessageImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
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

function List({ chats, uid, setChatId }) {
  const [chatUserData, setChatUserData] = React.useState([]);

  React.useEffect(() => {
    const chatMates = chats
      .map((chat) => chat.userIDs)
      .map((uids) => uids.find((userid) => userid !== uid));
    async function getUserData() {
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "users"),
        Firebase.where("uid", "in", chatMates)
      );
      const querySnapshot = await Firebase.getDocs(query);
      const userData = querySnapshot.docs.map((doc) => doc.data());
      setChatUserData(userData);
    }
    if (chatMates.length) {
      getUserData();
    }

    return function cleanup() {};
  }, [chats]);

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
        <MessageItem
          key={index}
          onClick={() => {
            setChatId(chat.id);
          }}
        >
          <MessageImg
            src={
              chatUserData.length &&
              chatUserData.find(
                (userData) =>
                  userData.uid === chat.userIDs.find((userID) => userID !== uid)
              ).profileImage
            }
          />
          <MessageOverview>
            <MessageObjectName>
              {chatUserData.length &&
                chatUserData.find(
                  (userData) =>
                    userData.uid ===
                    chat.userIDs.find((userID) => userID !== uid)
                ).alias}
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
