import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import send from "../../images/send.svg";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

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
  font-size: 16px;

  &:focus {
    outline: none;
    border: 1px solid #e8e8e8;
  }
`;

const SendMessageButton = styled.img`
  width: 25px;
  height: 25px;
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
  margin-bottom: 5px;
`;

const MessageSentByOthers = styled.div`
  background: #f2f5f7;
  border-radius: 20px 20px 20px 0px;
  padding: 10px 20px;
  align-self: flex-start;
  display: flex;
  align-items: center;
  max-width: 40%;
  margin-bottom: 5px;
`;

function MessageDetail({ currentUser, chats, chatId, setChatId }) {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const selectedChat = chats.find((chat) => chat.id === chatId);
  const myRole = selectedChat
    ? selectedChat.members.find((member) => member.uid === currentUser.uid).role
    : 0;

  React.useEffect(() => {
    let mounted = true;
    if (chatId) {
      const snapRef2 = Firebase.collection(
        Firebase.db,
        "chats/" + chatId + "/messages"
      );
      const query = Firebase.query(snapRef2, Firebase.orderBy("timestamp"));
      Firebase.onSnapshot(query, (snapshot) => {
        if (!mounted) return;
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });
    }

    return function cleaup() {
      mounted = false;
    };
  }, [chatId]);

  async function updateChat() {
    if (!message.trim()) return;
    const time = Firebase.Timestamp.fromDate(new Date());
    const newMessage = {
      content: message,
      sender: myRole,
      timestamp: time,
    };
    api.updateDocData("chats", chatId, {
      latestMessage: newMessage,
      updateTime: time,
    });
    api.addNewDoc("chats/" + chatId + "/messages", newMessage);
    setMessage("");
    setChatId(selectedChat.id);
  }
  return (
    <MessageContent>
      {chatId &&
        messages.map((detail, index) => (
          <React.Fragment key={index}>
            {detail.sender === myRole ? (
              <MessageSentByMe>{detail.content}</MessageSentByMe>
            ) : (
              <MessageSentByOthers>{detail.content}</MessageSentByOthers>
            )}
            <SendMessageBlock>
              <MessageInput
                placeholder="Aa"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <SendMessageButton onClick={updateChat} src={send} />
            </SendMessageBlock>
          </React.Fragment>
        ))}
    </MessageContent>
  );
}

export default MessageDetail;
