import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import send from "../../images/send.svg";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import { FlexWrapper } from "../common/Components";
import MessageBar from "./MessageBar";

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
  padding-bottom: 20px;
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

///////////////////////////////////////////////////

function MessageDetail({ currentUser, chats, chatId, chat, myRole }) {
  const { id } = useParams();
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const messageTop = React.useRef(null);
  const last = React.useRef();
  const notFirstRender = React.useRef();

  React.useEffect(() => {
    let mounted = true;
    if (chatId) {
      const snapRef2 = Firebase.collection(
        Firebase.db,
        "chats/" + chatId + "/messages"
      );
      const query = Firebase.query(
        snapRef2,
        Firebase.orderBy("timestamp", "desc")
        // Firebase.limit(10)
      );
      Firebase.onSnapshot(query, (snapshot) => {
        if (!mounted) return;
        const fetchedMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(fetchedMessages.reverse());
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        last.current = lastVisible;
      });
    }
    return function cleaup() {
      mounted = false;
    };
  }, [chatId]);

  // React.useEffect(() => {
  //   let mounted = true;
  //   const observer = new IntersectionObserver((entries, observer) => {
  //     const entry = entries[0];
  //     console.log("entry.isIntersecting", entry.isIntersecting);
  // const snapRef2 = Firebase.collection(
  //   Firebase.db,
  //   "chats/" + chatId + "/messages"
  // );
  //     if (entry.isIntersecting) {
  //       // first render
  //       if (!notFirstRender.current) {
  //         const query = Firebase.query(
  //           snapRef2,
  //           Firebase.orderBy("timestamp", "desc"),
  //           Firebase.limit(10)
  //         );
  //         Firebase.onSnapshot(query, (snapshot) => {
  //           if (!mounted) return;
  //           const fetchedMessages = snapshot.docs.map((doc) => doc.data());
  //           setMessages(fetchedMessages.reverse());
  //           const lastVisible = snapshot.docs[snapshot.docs.length - 1];
  //           last.current = lastVisible;
  //           notFirstRender.current = true;
  //         });
  //       }
  //       // next render
  //       if (notFirstRender.current) {
  //         let mounted = true;
  //         const query = Firebase.query(
  //           snapRef2,
  //           Firebase.orderBy("timestamp", "desc"),
  //           Firebase.startAfter(last.current),
  //           Firebase.limit(10)
  //         );
  //         Firebase.onSnapshot(query, (snapshot) => {
  //           if (!mounted) return;
  //           const fetchedMessages = snapshot.docs.map((doc) => doc.data());
  //           if (!fetchedMessages.length) return;
  //           setMessages((prev) => [...fetchedMessages.reverse(), ...prev]);
  //           const lastVisible = snapshot.docs[snapshot.docs.length - 1];
  //           last.current = lastVisible;
  //         });
  //       }
  //     }
  //   });
  //   observer.observe(messageTop.current);
  // }, []);

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
  }

  function generateReadableDate(time) {
    const endIndex = new Date(time.toDate()).toLocaleString().indexOf("午") - 1;
    return new Date(time.toDate()).toLocaleString().slice(0, endIndex);
  }

  return (
    <MessageContent>
      <Messages>
        <CreateTime ref={messageTop}>
          \ {generateReadableDate(chat.createTime)}建立聊天室 /
        </CreateTime>
        {messages.length
          ? messages.map((detail, index) => (
              <MessageBar
                key={index}
                detail={detail}
                myRole={myRole}
                generateReadableDate={generateReadableDate}
              />
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
