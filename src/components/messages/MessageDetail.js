import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import send from "../../images/send.svg";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import { FlexWrapper, ProfileImage, SlicedTitle } from "../common/Components";
import MessageBar from "./MessageBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChatroomHeader = styled(FlexWrapper)`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 20px);
  padding: 10px 0 0 20px;
  height: 60px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  z-index: 10;
`;

const NewProfileImage = styled(ProfileImage)`
  width: 45px;
  height: 45px;
  margin: 0 10px 10px 0;
`;

const MessageContent = styled.div`
  width: 70%;
  height: calc(100% - 40px);
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 995.98px) {
    width: calc(100% - 40px);
    padding: 10px 20px 20px;
  }
`;

const CreateTime = styled.div`
  font-size: 12px;
  color: #505d68;
  align-self: center;
  padding: 20px 0;
`;

const Messages = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-end;
  margin: 60px 0 60px;
  overflow-y: auto;
`;

const SendMessageBlock = styled.form`
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
  position: absolute;
  left: 20px;
  bottom: 20px;
  @media screen and (max-width: 995.98px) {
    bottom: 10px;
  }
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

function MessageDetail({ currentUser, chats, chatId, chat, myRole }) {
  const { id } = useParams();
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const messageTop = React.useRef(null);
  const last = React.useRef();
  const [loading, setLoading] = React.useState(true);

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
      );
      Firebase.onSnapshot(query, (snapshot) => {
        if (!mounted) return;
        const fetchedMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(fetchedMessages.reverse());
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        last.current = lastVisible;
      });
      api
        .getDataWithSingleQuery(
          "users",
          "uid",
          "in",
          chats.find((chat) => chat.id === chatId).userIDs
        )
        .then((res) => {
          setMembers(res);
          setLoading(false);
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
      status: 0,
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
      {loading ? (
        <ChatroomHeader>
          <Skeleton
            width={40}
            height={40}
            circle={true}
            inline={true}
            style={{ marginRight: "10px" }}
          />
          <Skeleton width={120} inline={true} />
        </ChatroomHeader>
      ) : (
        <ChatroomHeader>
          <NewProfileImage
            src={
              members.find((member) => member.uid !== currentUser.uid)
                ?.profileImage
            }
          />
          <SlicedTitle>
            {members.find((member) => member.uid !== currentUser.uid).alias}
          </SlicedTitle>
        </ChatroomHeader>
      )}

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
                members={members}
                self={currentUser}
              />
            ))
          : "查無聊天紀錄！"}
        {/* 
            測試 scroll anchor
           */}
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
