import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import send from "../../images/send.svg";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import { FlexWrapper } from "../common/Components";

const MessageContent = styled.div`
  width: 70%;
  height: calc(100% - 40px);
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const CreateTime = styled.div`
  font-size: 12px;
  color: #505d68;
  align-self: center;
  margin-bottom: 20px;
`;

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

const Messages = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 60px;
  overflow-y: scroll;
`;

const SendMessageBlock = styled.form`
  width: calc(100% - 20px);
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

function MessageDetail({ currentUser, chats }) {
  const { id } = useParams();
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const selectedChat = chats.find((chat) => chat.id === id);
  const myRole = selectedChat
    ? selectedChat.members.find((member) => member.uid === currentUser.uid).role
    : 0;

  React.useEffect(() => {
    let mounted = true;
    if (id) {
      const snapRef2 = Firebase.collection(
        Firebase.db,
        "chats/" + id + "/messages"
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
  }, [id]);

  async function updateChat() {
    if (!message.trim()) return;
    const time = Firebase.Timestamp.fromDate(new Date());
    const newMessage = {
      content: message,
      sender: myRole,
      timestamp: time,
    };
    api.updateDocData("chats", id, {
      latestMessage: newMessage,
      updateTime: time,
    });
    api.addNewDoc("chats/" + id + "/messages", newMessage);
    setMessage("");
  }

  function generateReadableDate(time) {
    const endIndex = new Date(time.toDate()).toLocaleString().indexOf("午") - 1;
    return new Date(time.toDate()).toLocaleString().slice(0, endIndex);
  }

  function generateReadableTime(time) {
    const startIndex =
      new Date(time.toDate()).toLocaleString().indexOf("午") - 1;
    return new Date(time.toDate()).toLocaleString().slice(startIndex, -3);
  }

  return (
    <MessageContent>
      <Messages>
        <CreateTime>
          \ {generateReadableDate(selectedChat.createTime)}建立聊天室 /
        </CreateTime>
        {messages.length
          ? messages.map((detail, index) => (
              <React.Fragment key={index}>
                <SendDate>{generateReadableDate(detail.timestamp)}</SendDate>
                {detail.sender === myRole ? (
                  <>
                    <MessageSentByMe>
                      {detail.content}
                      <SendTime>
                        {generateReadableTime(detail.timestamp)}
                      </SendTime>
                    </MessageSentByMe>
                  </>
                ) : (
                  <>
                    <MessageSentByOthers>
                      {detail.content}
                      <SendTime>
                        {generateReadableTime(detail.timestamp)}
                      </SendTime>
                    </MessageSentByOthers>
                  </>
                )}
              </React.Fragment>
            ))
          : "查無聊天紀錄！"}
      </Messages>
      <SendMessageBlock
        onSubmit={(e) => {
          e.preventDefault();
          updateChat();
        }}
      >
        <MessageInput
          placeholder="Aa"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SendMessageButton onClick={updateChat} src={send} />
      </SendMessageBlock>
    </MessageContent>
  );
}

export default MessageDetail;
